import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const DEFAULT_DIST_DIR = 'dist';

const decodeXml = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&apos;', "'");

export const extractPublicRoutes = (sitemapXml) => {
  const routes = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/gu)]
    .map(([, location]) => new URL(decodeXml(location)).pathname);
  const uniqueRoutes = [...new Set(routes)];

  if (uniqueRoutes.length === 0) {
    throw new Error('The generated sitemap did not contain any public routes. Run npm run build first.');
  }

  return uniqueRoutes;
};

export const routeToHtmlFile = (distDir, route) => {
  const pathname = decodeURIComponent(new URL(route, 'https://portfolio.invalid').pathname);
  const relativePath = pathname === '/'
    ? 'index.html'
    : path.join(pathname.replace(/^\/+|\/+$/gu, ''), 'index.html');
  const resolvedDist = path.resolve(distDir);
  const resolvedFile = path.resolve(resolvedDist, relativePath);
  const relativeToDist = path.relative(resolvedDist, resolvedFile);

  if (relativeToDist.startsWith('..') || path.isAbsolute(relativeToDist)) {
    throw new Error(`Route escapes the build directory: ${route}`);
  }

  return resolvedFile;
};

const isFile = async (filePath) => {
  try {
    return (await stat(filePath)).isFile();
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
};

export const createStrictStaticServer = (distDir) => createServer(async (request, response) => {
  try {
    const filePath = routeToHtmlFile(distDir, request.url ?? '/');
    if (!(await isFile(filePath))) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    response.end(error.message);
  }
});

const listen = async (server) => new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const address = server.address();
    if (!address || typeof address === 'string') {
      reject(new Error('Could not determine the deep-link gate server address.'));
      return;
    }

    resolve(`http://127.0.0.1:${address.port}`);
  });
});

const close = async (server) => new Promise((resolve, reject) => {
  server.close((error) => {
    if (error) reject(error);
    else resolve();
  });
});

export const verifyDeepLinks = async ({ distDir = DEFAULT_DIST_DIR, fetchImpl = fetch } = {}) => {
  const absoluteDist = path.resolve(distDir);
  const sitemapXml = await readFile(path.join(absoluteDist, 'sitemap.xml'), 'utf8');
  const routes = extractPublicRoutes(sitemapXml);
  const missingFiles = [];

  for (const route of routes) {
    const filePath = routeToHtmlFile(absoluteDist, route);
    if (!(await isFile(filePath))) missingFiles.push(`${route} -> ${path.relative(absoluteDist, filePath)}`);
  }

  if (missingFiles.length > 0) {
    throw new Error(`Deep-link gate found ${missingFiles.length} route(s) without a generated HTML document:\n${missingFiles.map((entry) => `- ${entry}`).join('\n')}`);
  }

  const server = createStrictStaticServer(absoluteDist);
  const baseUrl = await listen(server);

  try {
    const failures = [];
    for (const route of routes) {
      const response = await fetchImpl(`${baseUrl}${route}`, { redirect: 'manual' });
      if (response.status !== 200) failures.push(`${route}: HTTP ${response.status}`);
      await response.body?.cancel();
    }

    if (failures.length > 0) {
      throw new Error(`Deep-link gate failed for ${failures.length}/${routes.length} public route(s):\n${failures.map((entry) => `- ${entry}`).join('\n')}`);
    }

    return { routeCount: routes.length };
  } finally {
    await close(server);
  }
};

const isDirectExecution = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  const { routeCount } = await verifyDeepLinks();
  console.log(`Deep-link gate passed: ${routeCount}/${routeCount} public sitemap URLs resolved to generated HTML and returned HTTP 200.`);
}
