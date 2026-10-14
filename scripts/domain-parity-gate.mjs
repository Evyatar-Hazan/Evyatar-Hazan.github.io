import { createHash } from 'node:crypto';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const defaultOrigins = [
  'https://evyatarhazan.com',
  'https://evyatar-hazan.github.io',
];
const defaultRoutes = ['/en/', '/he/'];
const shaPattern = /^[0-9a-f]{40}$/u;
const assetHashPattern = /^[0-9a-f]{64}$/u;

const sha256 = (content) => createHash('sha256').update(content).digest('hex');
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const normalizeOrigin = (candidate) => {
  const url = new URL(candidate);
  if (url.protocol !== 'https:' && url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') {
    throw new Error(`Parity origins must use HTTPS: ${candidate}`);
  }
  return url.origin;
};

export const validateDeploymentManifest = (manifest, origin) => {
  if (!manifest || manifest.schemaVersion !== 1) {
    throw new Error(`${origin} returned an unsupported deployment manifest.`);
  }
  if (!shaPattern.test(manifest.sourceSha || '')) {
    throw new Error(`${origin} returned an invalid source SHA.`);
  }
  if (!Array.isArray(manifest.assets) || manifest.assets.length === 0) {
    throw new Error(`${origin} returned an empty asset inventory.`);
  }

  const paths = new Set();
  for (const asset of manifest.assets) {
    if (typeof asset.path !== 'string' || !asset.path.startsWith('/') || asset.path.includes('..')) {
      throw new Error(`${origin} returned an unsafe asset path.`);
    }
    if (!Number.isInteger(asset.bytes) || asset.bytes < 0 || !assetHashPattern.test(asset.sha256 || '')) {
      throw new Error(`${origin} returned invalid metadata for ${asset.path}.`);
    }
    if (paths.has(asset.path)) throw new Error(`${origin} returned duplicate asset ${asset.path}.`);
    paths.add(asset.path);
  }

  return manifest;
};

export const compareDeploymentManifests = (left, right) => {
  if (left.sourceSha !== right.sourceSha) {
    throw new Error(`Deployment SHA mismatch: ${left.sourceSha} != ${right.sourceSha}.`);
  }
  if (JSON.stringify(left.assets) !== JSON.stringify(right.assets)) {
    throw new Error('Deployment asset inventories differ between origins.');
  }
};

export const extractAssetPaths = (html, origin) => [...new Set(
  [...html.matchAll(/(?:src|href)=["']([^"']+)["']/gu)]
    .map((match) => new URL(match[1], origin))
    .filter((url) => url.origin === origin && url.pathname.startsWith('/assets/'))
    .map((url) => url.pathname),
)].sort();

const fetchBytes = async (url) => {
  const response = await fetch(url, { cache: 'no-store', redirect: 'follow' });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}.`);
  return Buffer.from(await response.arrayBuffer());
};

const fetchManifest = async (origin, cacheBust) => {
  const response = await fetch(`${origin}/deployment.json?parity=${cacheBust}`, {
    cache: 'no-store',
    headers: { accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`${origin}/deployment.json returned HTTP ${response.status}.`);
  return validateDeploymentManifest(await response.json(), origin);
};

const verifyOrigin = async ({ origin, manifest, routes, cacheBust }) => {
  const assetPaths = new Set(manifest.assets.map((asset) => asset.path));
  const routeHashes = [];

  for (const route of routes) {
    const url = `${origin}${route}?parity=${cacheBust}`;
    const html = await fetchBytes(url);
    const referencedAssets = extractAssetPaths(html.toString('utf8'), origin);
    if (referencedAssets.length === 0) throw new Error(`${url} did not reference any built assets.`);
    for (const assetPath of referencedAssets) {
      if (!assetPaths.has(assetPath)) {
        throw new Error(`${url} references ${assetPath}, which is missing from deployment.json.`);
      }
    }
    routeHashes.push({ path: route, sha256: sha256(html) });
  }

  const observedAssets = await Promise.all(manifest.assets.map(async (asset) => {
    const content = await fetchBytes(`${origin}${asset.path}?parity=${cacheBust}`);
    const observed = { path: asset.path, bytes: content.length, sha256: sha256(content) };
    if (observed.bytes !== asset.bytes || observed.sha256 !== asset.sha256) {
      throw new Error(`${origin}${asset.path} does not match its deployment manifest.`);
    }
    return observed;
  }));

  return { origin, routeHashes, observedAssets };
};

const compareObservedOrigins = (left, right) => {
  if (JSON.stringify(left.routeHashes) !== JSON.stringify(right.routeHashes)) {
    throw new Error('Localized entry-route HTML differs between origins.');
  }
  if (JSON.stringify(left.observedAssets) !== JSON.stringify(right.observedAssets)) {
    throw new Error('Observed asset bytes differ between origins.');
  }
};

export const parseArguments = (argv) => {
  const options = {
    origins: [],
    routes: [...defaultRoutes],
    expectedSha: process.env.EXPECTED_SHA?.trim().toLowerCase() || '',
    maxAttempts: Number(process.env.PARITY_MAX_ATTEMPTS || 12),
    delayMs: Number(process.env.PARITY_DELAY_MS || 10_000),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--origin') options.origins.push(normalizeOrigin(argv[++index]));
    else if (argument === '--route') options.routes.push(argv[++index]);
    else if (argument === '--expected-sha') options.expectedSha = argv[++index]?.trim().toLowerCase();
    else if (argument.startsWith('--expected-sha=')) {
      options.expectedSha = argument.slice('--expected-sha='.length).trim().toLowerCase();
    }
    else if (argument === '--max-attempts') options.maxAttempts = Number(argv[++index]);
    else if (argument === '--delay-ms') options.delayMs = Number(argv[++index]);
    else throw new Error(`Unknown argument: ${argument}`);
  }

  if (options.origins.length === 0) options.origins = defaultOrigins.map(normalizeOrigin);
  if (options.origins.length !== 2) throw new Error('Domain parity requires exactly two origins.');
  if (new Set(options.origins).size !== options.origins.length) {
    throw new Error('Domain parity requires two distinct origins.');
  }
  if (options.expectedSha && !shaPattern.test(options.expectedSha)) {
    throw new Error('Expected SHA must be a full 40-character Git SHA.');
  }
  if (!Number.isInteger(options.maxAttempts) || options.maxAttempts < 1) {
    throw new Error('max-attempts must be a positive integer.');
  }
  if (!Number.isFinite(options.delayMs) || options.delayMs < 0) {
    throw new Error('delay-ms must be zero or greater.');
  }
  options.routes = [...new Set(options.routes)].filter(Boolean);
  return options;
};

const runAttempt = async (options, attempt) => {
  const cacheBust = `${Date.now()}-${attempt}`;
  const manifests = await Promise.all(options.origins.map((origin) => fetchManifest(origin, cacheBust)));
  compareDeploymentManifests(manifests[0], manifests[1]);
  if (options.expectedSha && manifests[0].sourceSha !== options.expectedSha) {
    throw new Error(`Expected deployed SHA ${options.expectedSha}, observed ${manifests[0].sourceSha}.`);
  }

  const observations = await Promise.all(options.origins.map((origin, index) => verifyOrigin({
    origin,
    manifest: manifests[index],
    routes: options.routes,
    cacheBust,
  })));
  compareObservedOrigins(observations[0], observations[1]);
  return { manifest: manifests[0], observations };
};

const main = async () => {
  const options = parseArguments(process.argv.slice(2));
  let lastError;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt += 1) {
    try {
      const { manifest, observations } = await runAttempt(options, attempt);
      console.log(
        `Domain parity passed for ${manifest.sourceSha}: ${manifest.assets.length} assets and `
        + `${observations[0].routeHashes.length} localized entry routes match across ${options.origins.join(' and ')}.`,
      );
      return;
    } catch (error) {
      lastError = error;
      if (attempt < options.maxAttempts) {
        console.warn(`Domain parity attempt ${attempt}/${options.maxAttempts} failed: ${error.message}`);
        await wait(options.delayMs);
      }
    }
  }

  throw lastError;
};

const isDirectExecution = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) await main();
