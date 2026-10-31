import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(projectRoot, 'dist');
const entryHtmlPath = path.join(distDir, 'en', 'index.html');
const initialJavaScriptBudgetBytes = 750_000;
const routeChunkPrefixes = [
  'BlogIndex-',
  'BlogPost-',
  'ContactPage-',
  'PrivacyPage-',
  'ProjectCaseStudy-',
];

const entryHtml = await readFile(entryHtmlPath, 'utf8');
const initialAssetPaths = [...entryHtml.matchAll(
  /<(?:script|link)[^>]+(?:src|href)="(\/assets\/[^"?]+\.js)"/gu,
)].map((match) => match[1]);

if (initialAssetPaths.length === 0) {
  throw new Error(`No initial JavaScript assets were found in ${entryHtmlPath}.`);
}

const initialAssetNames = initialAssetPaths.map((assetPath) => path.basename(assetPath));
const initialJavaScriptBytes = (await Promise.all(
  initialAssetNames.map(async (assetName) => (
    await stat(path.join(distDir, 'assets', assetName))
  ).size),
)).reduce((total, size) => total + size, 0);

if (initialJavaScriptBytes > initialJavaScriptBudgetBytes) {
  throw new Error(
    `Initial JavaScript is ${initialJavaScriptBytes} bytes, above the ${initialJavaScriptBudgetBytes}-byte route bundle budget.`,
  );
}

const emittedAssets = await readdir(path.join(distDir, 'assets'));
for (const prefix of routeChunkPrefixes) {
  const routeChunk = emittedAssets.find((assetName) => (
    assetName.startsWith(prefix) && assetName.endsWith('.js')
  ));

  if (!routeChunk) {
    throw new Error(`Expected a separate ${prefix}*.js route chunk.`);
  }

  if (initialAssetNames.includes(routeChunk)) {
    throw new Error(`${routeChunk} is route-specific but is still loaded by the initial document.`);
  }
}

console.log(
  `Route bundle gate passed: ${initialJavaScriptBytes} initial JS bytes across ${initialAssetNames.length} assets; `
  + `${routeChunkPrefixes.length} route chunks stay deferred.`,
);
