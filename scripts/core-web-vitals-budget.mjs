import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { chromium } from '@playwright/test';

const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultBudgetPath = join(rootDirectory, 'performance/core-web-vitals-budget.json');
const defaultReportPath = join(rootDirectory, 'output/core-web-vitals/report.json');
const metricNames = ['LCP', 'CLS', 'INP'];

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

export const percentile = (values, targetPercentile) => {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('Cannot calculate a percentile without samples.');
  }
  if (!(targetPercentile > 0 && targetPercentile <= 1)) {
    throw new Error('Percentile must be greater than 0 and at most 1.');
  }

  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.ceil(sorted.length * targetPercentile) - 1];
};

export const validateBudget = (budget) => {
  const errors = [];

  if (budget?.schemaVersion !== 1) errors.push('schemaVersion must be 1.');
  if (budget?.approvedTask !== 'FIX-093') errors.push('approvedTask must be FIX-093.');
  if (!(budget?.percentile > 0 && budget.percentile <= 1)) errors.push('percentile must be in (0, 1].');
  if (!Number.isInteger(budget?.samplesPerRoute) || budget.samplesPerRoute < 3) {
    errors.push('samplesPerRoute must be an integer of at least 3.');
  }
  if (!Array.isArray(budget?.routes) || budget.routes.length === 0) errors.push('routes must not be empty.');
  if (budget?.routes?.some((route) => typeof route !== 'string' || !route.startsWith('/'))) {
    errors.push('Every route must be an absolute site path.');
  }
  if (!(budget?.viewport?.width > 0 && budget?.viewport?.height > 0)) {
    errors.push('viewport width and height must be positive.');
  }
  if (!(budget?.cpuSlowdownMultiplier >= 1)) errors.push('cpuSlowdownMultiplier must be at least 1.');
  if (!(budget?.network?.latencyMs >= 0)) errors.push('network.latencyMs must not be negative.');
  if (!(budget?.network?.downloadKbps > 0 && budget?.network?.uploadKbps > 0)) {
    errors.push('network throughput must be positive.');
  }
  for (const metricName of metricNames) {
    if (!(budget?.thresholds?.[metricName] > 0)) {
      errors.push(`thresholds.${metricName} must be positive.`);
    }
  }
  for (const [route, thresholds] of Object.entries(budget?.routeThresholds ?? {})) {
    if (!budget?.routes?.includes(route)) errors.push(`routeThresholds contains unknown route ${route}.`);
    for (const [metricName, threshold] of Object.entries(thresholds)) {
      if (!metricNames.includes(metricName)) errors.push(`routeThresholds.${route} contains unknown metric ${metricName}.`);
      if (!(threshold > 0)) errors.push(`routeThresholds.${route}.${metricName} must be positive.`);
    }
  }

  if (errors.length > 0) throw new Error(`Invalid Core Web Vitals budget:\n- ${errors.join('\n- ')}`);
  return budget;
};

export const assessMeasurements = (budget, routeMeasurements) => {
  const routes = routeMeasurements.map(({ route, samples }) => {
    const thresholds = { ...budget.thresholds, ...budget.routeThresholds?.[route] };
    const measured = Object.fromEntries(metricNames.map((metricName) => [
      metricName,
      percentile(samples.map((sample) => sample[metricName]), budget.percentile),
    ]));
    const failures = metricNames
      .filter((metricName) => measured[metricName] > thresholds[metricName])
      .map((metricName) => ({
        metric: metricName,
        measured: measured[metricName],
        threshold: thresholds[metricName],
      }));

    return { route, samples, measured, thresholds, failures, passed: failures.length === 0 };
  });

  return { routes, passed: routes.every((route) => route.passed) };
};

const resolveStaticFile = async (distDirectory, requestPath) => {
  const decodedPath = decodeURIComponent(requestPath.split('?')[0]);
  const relativePath = normalize(decodedPath).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
  const candidates = [];

  if (relativePath === '' || decodedPath.endsWith('/')) {
    candidates.push(join(distDirectory, relativePath, 'index.html'));
  } else {
    candidates.push(join(distDirectory, relativePath));
    candidates.push(join(distDirectory, relativePath, 'index.html'));
  }
  candidates.push(join(distDirectory, 'index.html'));

  for (const candidate of candidates) {
    if (!candidate.startsWith(`${distDirectory}/`) && candidate !== join(distDirectory, 'index.html')) continue;
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // Try the next candidate, ending with the SPA fallback.
    }
  }
  return null;
};

const startStaticServer = async (distDirectory) => {
  const server = createServer(async (request, response) => {
    try {
      const filePath = await resolveStaticFile(distDirectory, request.url ?? '/');
      if (!filePath) {
        response.writeHead(404).end('Not found');
        return;
      }

      const body = await readFile(filePath);
      const acceptsGzip = /\bgzip\b/u.test(request.headers['accept-encoding'] ?? '');
      const shouldCompress = acceptsGzip && ['.css', '.html', '.js', '.json', '.svg'].includes(extname(filePath));
      const headers = {
        'cache-control': 'no-store',
        'content-type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
        vary: 'Accept-Encoding',
      };
      if (shouldCompress) headers['content-encoding'] = 'gzip';
      response.writeHead(200, headers);
      response.end(shouldCompress ? gzipSync(body) : body);
    } catch (error) {
      response.writeHead(500).end(error instanceof Error ? error.message : String(error));
    }
  });

  await new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolvePromise);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Unable to resolve the performance server port.');

  return {
    origin: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolvePromise, reject) => server.close((error) => (
      error ? reject(error) : resolvePromise()
    ))),
  };
};

const getWebVitalsInitScript = async () => {
  const require = createRequire(import.meta.url);
  const packageEntry = require.resolve('web-vitals');
  const iifePath = join(dirname(packageEntry), 'web-vitals.iife.js');
  const library = await readFile(iifePath, 'utf8');

  return `${library}\n;(() => {
    const metrics = {};
    const record = (metric) => {
      metrics[metric.name] = metric.value;
      self.__coreWebVitals = metrics;
      void self.__recordCoreWebVital?.({ name: metric.name, value: metric.value });
    };
    webVitals.onLCP(record, { reportAllChanges: true });
    webVitals.onCLS(record, { reportAllChanges: true });
    webVitals.onINP(record, { reportAllChanges: true, durationThreshold: 0 });
  })();`;
};

const measureRoute = async ({ browser, budget, initScript, origin, route }) => {
  const samples = [];
  const sampleCount = Number.parseInt(process.env.CWV_SAMPLES ?? '', 10) || budget.samplesPerRoute;
  if (sampleCount < 1) throw new Error('CWV_SAMPLES must be a positive integer.');

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const metrics = {};
    const context = await browser.newContext({
      colorScheme: 'light',
      locale: 'en-US',
      reducedMotion: 'reduce',
      viewport: budget.viewport,
    });
    const page = await context.newPage();
    await page.exposeFunction('__recordCoreWebVital', ({ name, value }) => {
      if (metricNames.includes(name) && Number.isFinite(value)) metrics[name] = value;
    });
    await page.addInitScript({ content: initScript });

    const cdpSession = await context.newCDPSession(page);
    await cdpSession.send('Network.enable');
    await cdpSession.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: budget.network.latencyMs,
      downloadThroughput: (budget.network.downloadKbps * 1024) / 8,
      uploadThroughput: (budget.network.uploadKbps * 1024) / 8,
    });
    await cdpSession.send('Emulation.setCPUThrottlingRate', { rate: budget.cpuSlowdownMultiplier });

    try {
      await page.goto(`${origin}${route}`, { waitUntil: 'networkidle', timeout: 30_000 });
      await page.locator('#main-content').waitFor({ state: 'visible', timeout: 10_000 });
      await page.evaluate(() => document.fonts?.ready);

      const themeControl = page.locator('button.system-rail-icon:visible').first();
      await themeControl.click();
      const menuControl = page.locator('button.system-rail-menu-toggle:visible').first();
      await menuControl.click();
      await page.getByRole('dialog').waitFor({ state: 'visible' });
      await page.keyboard.press('Escape');
      await page.getByRole('dialog').waitFor({ state: 'hidden' });
      await page.waitForFunction(() => Number.isFinite(self.__coreWebVitals?.INP), null, { timeout: 3_000 });

      const backgroundPage = await context.newPage();
      await backgroundPage.bringToFront();
      await page.waitForTimeout(150);
      Object.assign(metrics, await page.evaluate(() => self.__coreWebVitals ?? {}));

      const missingMetrics = metricNames.filter((metricName) => !Number.isFinite(metrics[metricName]));
      if (missingMetrics.length > 0) {
        throw new Error(`${route} sample ${sampleIndex + 1} did not report ${missingMetrics.join(', ')}.`);
      }
      samples.push(Object.fromEntries(metricNames.map((metricName) => [metricName, metrics[metricName]])));
    } finally {
      await context.close();
    }
  }

  return { route, samples };
};

export const runCoreWebVitalsBudget = async ({
  budgetPath = process.env.CWV_BUDGET_PATH || defaultBudgetPath,
  reportPath = process.env.CWV_REPORT_PATH || defaultReportPath,
} = {}) => {
  const budget = validateBudget(JSON.parse(await readFile(budgetPath, 'utf8')));
  const distDirectory = join(rootDirectory, 'dist');
  if (!(await stat(distDirectory)).isDirectory()) {
    throw new Error('dist/ is missing. Run npm run build before the Core Web Vitals gate.');
  }

  const initScript = await getWebVitalsInitScript();
  const server = await startStaticServer(distDirectory);
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true });
  const startedAt = new Date().toISOString();

  try {
    const measurements = [];
    for (const route of budget.routes) {
      measurements.push(await measureRoute({ browser, budget, initScript, origin: server.origin, route }));
    }
    const assessment = assessMeasurements(budget, measurements);
    const report = {
      schemaVersion: 1,
      task: budget.approvedTask,
      startedAt,
      completedAt: new Date().toISOString(),
      percentile: budget.percentile,
      samplesPerRoute: Number.parseInt(process.env.CWV_SAMPLES ?? '', 10) || budget.samplesPerRoute,
      thresholds: budget.thresholds,
      environment: {
        viewport: budget.viewport,
        cpuSlowdownMultiplier: budget.cpuSlowdownMultiplier,
        network: budget.network,
      },
      ...assessment,
    };

    await mkdir(dirname(reportPath), { recursive: true });
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

    console.table(report.routes.map((entry) => ({
      route: entry.route,
      LCP: `${entry.measured.LCP.toFixed(1)} / ${entry.thresholds.LCP} ms`,
      CLS: `${entry.measured.CLS.toFixed(3)} / ${entry.thresholds.CLS}`,
      INP: `${entry.measured.INP.toFixed(1)} / ${entry.thresholds.INP} ms`,
      result: entry.passed ? 'PASS' : 'FAIL',
    })));
    console.log(`Core Web Vitals report: ${reportPath}`);

    if (!report.passed) {
      const failures = report.routes.flatMap((entry) => entry.failures.map((failure) => (
        `${entry.route} ${failure.metric} ${failure.measured.toFixed(3)} > ${failure.threshold}`
      )));
      throw new Error(`Core Web Vitals budget exceeded:\n- ${failures.join('\n- ')}`);
    }

    return report;
  } finally {
    await browser.close();
    await server.close();
  }
};

const isDirectExecution = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectExecution) {
  runCoreWebVitalsBudget().catch((error) => {
    console.error(error instanceof Error ? error.stack : error);
    process.exitCode = 1;
  });
}
