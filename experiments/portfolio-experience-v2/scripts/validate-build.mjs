import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => readFile(path.join(root, relativePath));

test('the 3D engine ships only as a bounded dynamic scene chunk', async () => {
  const manifest = JSON.parse(await readFile(path.join(root, 'dist/.vite/manifest.json'), 'utf8'));
  const entry = manifest['index.html'];
  const scene = manifest['src/forge/SignalForgeCanvas.jsx'];
  assert.ok(entry?.isEntry, 'missing V2 entry manifest');
  assert.ok(scene?.isDynamicEntry, 'scene must remain a dynamic entry');
  assert.ok(entry.dynamicImports?.includes('src/forge/SignalForgeCanvas.jsx'));

  const entryBytes = await read(`dist/${entry.file}`);
  const sceneBytes = await read(`dist/${scene.file}`);
  assert.ok(gzipSync(entryBytes).length < 250_000, 'non-WebGL entry exceeded 250 kB gzip');
  assert.ok(gzipSync(sceneBytes).length < 200_000, 'scene chunk exceeded 200 kB gzip');

  const html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
  assert.equal(html.includes(path.basename(scene.file)), false, 'scene was eagerly preloaded');
  assert.ok((await stat(path.join(root, `dist/${scene.file}`))).size > 100_000);
});

test('the isolated preview keeps direct V2 routes inside the SPA', async () => {
  const redirects = await readFile(path.join(root, 'dist/_redirects'), 'utf8');
  const html = await readFile(path.join(root, 'dist/index.html'), 'utf8');

  assert.equal(redirects.trim(), '/* /index.html 200');
  assert.ok(html.includes('name="robots" content="noindex, nofollow"'));
});
