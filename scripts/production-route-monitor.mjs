import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const DEFAULT_ORIGINS = [
  'https://evyatarhazan.com',
  'https://evyatar-hazan.github.io',
];

const DEFAULT_REPORT_FILE = 'production-route-monitor.json';
const DEFAULT_ATTEMPTS = 3;
const DEFAULT_DELAY_MS = 2_000;
const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_CONCURRENCY = 8;

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export const normalizeOrigin = (candidate) => {
  const url = new URL(candidate);
  if (url.protocol !== 'https:') throw new Error(`Monitor origins must use HTTPS: ${candidate}`);
  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error(`Monitor origins must not include a path, query, or hash: ${candidate}`);
  }
  return url.origin;
};

const decodeXml = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&apos;', "'");

export const extractSitemapRoutes = (sitemapXml) => {
  const routes = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/gu)]
    .map(([, location]) => new URL(decodeXml(location)).pathname)
    .map((pathname) => (pathname.endsWith('/') ? pathname : `${pathname}/`));
  const uniqueRoutes = [...new Set(routes)].sort();

  if (uniqueRoutes.length === 0) throw new Error('Production sitemap contains no public routes.');
  if (uniqueRoutes.some((route) => !/^\/(?:en|he)\//u.test(route))) {
    throw new Error('Production sitemap contains a route outside the localized /en/ and /he/ trees.');
  }

  return uniqueRoutes;
};

const canonicalPathFromHtml = (html) => {
  const match = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/iu)
    ?? html.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/iu);
  return match ? new URL(match[1]).pathname : null;
};

const fetchWithTimeout = (fetchImpl, url, timeoutMs) => fetchImpl(url, {
  cache: 'no-store',
  redirect: 'follow',
  headers: {
    accept: 'text/html,application/xml;q=0.9,*/*;q=0.8',
    'user-agent': 'Evyatar-Hazan-portfolio-route-monitor/1.0',
  },
  signal: AbortSignal.timeout(timeoutMs),
});

const retry = async (operation, { attempts, delayMs }) => {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await wait(delayMs * attempt);
    }
  }
  throw lastError;
};

const readSitemap = async ({ origin, fetchImpl, attempts, delayMs, timeoutMs, cacheBust }) => retry(
  async () => {
    const response = await fetchWithTimeout(fetchImpl, `${origin}/sitemap.xml?monitor=${cacheBust}`, timeoutMs);
    if (!response.ok) throw new Error(`${origin}/sitemap.xml returned HTTP ${response.status}.`);
    return extractSitemapRoutes(await response.text());
  },
  { attempts, delayMs },
);

const inspectRoute = async ({ origin, route, fetchImpl, attempts, delayMs, timeoutMs, cacheBust }) => retry(
  async () => {
    const displayUrl = `${origin}${route}`;
    const requestUrl = `${displayUrl}?monitor=${cacheBust}`;
    const response = await fetchWithTimeout(fetchImpl, requestUrl, timeoutMs);
    const contentType = response.headers.get('content-type') ?? '';
    const html = await response.text();
    const canonicalPath = canonicalPathFromHtml(html);

    if (response.status !== 200) throw new Error(`${displayUrl} returned HTTP ${response.status}.`);
    if (!contentType.toLowerCase().includes('text/html')) {
      throw new Error(`${displayUrl} returned unexpected content type ${contentType || '(missing)'}.`);
    }
    if (!html.includes('<div id="root">')) throw new Error(`${displayUrl} did not contain the application root.`);
    if (canonicalPath !== route) {
      throw new Error(`${displayUrl} declared canonical path ${canonicalPath ?? '(missing)'} instead of ${route}.`);
    }

    return { origin, route, status: response.status, contentType, canonicalPath };
  },
  { attempts, delayMs },
);

const mapWithConcurrency = async (items, concurrency, mapper) => {
  const results = new Array(items.length);
  let cursor = 0;

  const worker = async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index]);
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
};

export const runProductionMonitor = async ({
  origins = DEFAULT_ORIGINS,
  fetchImpl = fetch,
  attempts = DEFAULT_ATTEMPTS,
  delayMs = DEFAULT_DELAY_MS,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  checkedAt = new Date().toISOString(),
} = {}) => {
  const normalizedOrigins = origins.map(normalizeOrigin);
  if (normalizedOrigins.length !== 2 || new Set(normalizedOrigins).size !== 2) {
    throw new Error('Production monitoring requires exactly two distinct origins.');
  }
  if (!Number.isInteger(attempts) || attempts < 1) throw new Error('attempts must be a positive integer.');

  const cacheBust = Date.parse(checkedAt).toString(36);
  const routeSets = await Promise.all(normalizedOrigins.map((origin) => readSitemap({
    origin,
    fetchImpl,
    attempts,
    delayMs,
    timeoutMs,
    cacheBust,
  })));

  if (JSON.stringify(routeSets[0]) !== JSON.stringify(routeSets[1])) {
    throw new Error('Production sitemap route sets differ between the two domains.');
  }

  const targets = normalizedOrigins.flatMap((origin) => routeSets[0].map((route) => ({ origin, route })));
  const checks = await mapWithConcurrency(targets, MAX_CONCURRENCY, (target) => inspectRoute({
    ...target,
    fetchImpl,
    attempts,
    delayMs,
    timeoutMs,
    cacheBust,
  }));

  return {
    schemaVersion: 1,
    status: 'ok',
    checkedAt,
    origins: normalizedOrigins,
    routeCount: routeSets[0].length,
    checkCount: checks.length,
    checks,
  };
};

export const failureReport = (error, { origins, checkedAt }) => {
  const message = error instanceof Error ? error.message : String(error);
  return {
    schemaVersion: 1,
    status: 'failed',
    checkedAt,
    origins,
    error: message,
    failureFingerprint: sha256(message),
  };
};

export const parseArguments = (argv) => {
  const options = {
    origins: [],
    reportFile: process.env.PRODUCTION_MONITOR_REPORT?.trim() || DEFAULT_REPORT_FILE,
    attempts: Number(process.env.PRODUCTION_MONITOR_ATTEMPTS || DEFAULT_ATTEMPTS),
    delayMs: Number(process.env.PRODUCTION_MONITOR_DELAY_MS || DEFAULT_DELAY_MS),
    timeoutMs: Number(process.env.PRODUCTION_MONITOR_TIMEOUT_MS || DEFAULT_TIMEOUT_MS),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--origin') options.origins.push(argv[++index]);
    else if (argument === '--report-file') options.reportFile = argv[++index];
    else if (argument === '--attempts') options.attempts = Number(argv[++index]);
    else if (argument === '--delay-ms') options.delayMs = Number(argv[++index]);
    else if (argument === '--timeout-ms') options.timeoutMs = Number(argv[++index]);
    else throw new Error(`Unknown argument: ${argument}`);
  }

  if (options.origins.length === 0) options.origins = [...DEFAULT_ORIGINS];
  if (!options.reportFile) throw new Error('report-file must not be empty.');
  return options;
};

const main = async () => {
  const options = parseArguments(process.argv.slice(2));
  const checkedAt = new Date().toISOString();

  try {
    const report = await runProductionMonitor({ ...options, checkedAt });
    await writeFile(options.reportFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(
      `Production route monitor passed: ${report.checkCount} checks across ${report.routeCount} routes `
      + `on ${report.origins.join(' and ')}.`,
    );
  } catch (error) {
    const report = failureReport(error, { origins: options.origins, checkedAt });
    await writeFile(options.reportFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.error(`Production route monitor failed: ${report.error}`);
    process.exitCode = 1;
  }
};

const isDirectExecution = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) await main();
