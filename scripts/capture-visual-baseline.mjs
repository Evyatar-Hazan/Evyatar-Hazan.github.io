import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const LANGUAGES = ['en', 'he'];
export const THEMES = ['light', 'dark'];
export const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const PLAYWRIGHT_CLI_VERSION = '0.1.22';
const DEFAULT_BASE_URL = 'https://evyatarhazan.com';
const DEFAULT_OUTPUT_DIR = 'output/playwright/fix-001-baseline';

const escapeXml = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&apos;', "'");

export const extractLocalizedRoutes = (sitemapXml) => {
  const routes = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/gu)]
    .map((match) => new URL(escapeXml(match[1])).pathname)
    .filter((pathname) => /^\/(en|he)\//u.test(pathname))
    .map((pathname) => (pathname.endsWith('/') ? pathname : `${pathname}/`));

  const uniqueRoutes = [...new Set(routes)].sort((left, right) => left.localeCompare(right));
  if (uniqueRoutes.length === 0) {
    throw new Error('The sitemap contains no localized /en/ or /he/ routes. Run npm run build first.');
  }

  const routesByContentPath = new Map();
  for (const localizedPath of uniqueRoutes) {
    const [, language, ...segments] = localizedPath.split('/');
    const contentPath = `/${segments.filter(Boolean).join('/')}${segments.filter(Boolean).length ? '/' : ''}`;
    const languages = routesByContentPath.get(contentPath) ?? new Set();
    languages.add(language);
    routesByContentPath.set(contentPath, languages);
  }

  for (const [contentPath, languages] of routesByContentPath) {
    const missing = LANGUAGES.filter((language) => !languages.has(language));
    if (missing.length > 0) {
      throw new Error(`Route ${contentPath} is missing localized variants: ${missing.join(', ')}.`);
    }
  }

  return {
    localizedRoutes: uniqueRoutes,
    routeCount: routesByContentPath.size,
  };
};

export const routeSlug = (localizedPath) => {
  const contentPath = localizedPath.replace(/^\/(en|he)\//u, '/');
  const slug = contentPath.replace(/^\/|\/$/gu, '').replaceAll('/', '--');
  return slug || 'home';
};

export const buildCaptureMatrix = ({ localizedRoutes, baseUrl, outputDir, fullPage = true }) => {
  const normalizedBaseUrl = baseUrl.replace(/\/$/u, '');
  return localizedRoutes.flatMap((localizedPath) => {
    const language = localizedPath.split('/')[1];
    return THEMES.flatMap((theme) => VIEWPORTS.map((viewport) => {
      const relativeFile = path.join(language, routeSlug(localizedPath), theme, `${viewport.name}.webp`);
      return {
        localizedPath,
        language,
        theme,
        viewport,
        fullPage,
        url: `${normalizedBaseUrl}${localizedPath}`,
        relativeFile,
        absoluteFile: path.resolve(outputDir, relativeFile),
      };
    }));
  });
};

export const assertSafeOutputDir = (repoRoot, outputDir) => {
  const artifactRoot = path.resolve(repoRoot, 'output/playwright');
  const relative = path.relative(artifactRoot, outputDir);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('The output directory must be a named child of output/playwright/.');
  }
};

const buildPlaywrightFunction = (matrix) => `async (page) => {
  const matrix = ${JSON.stringify(matrix)};
  const failures = [];
  for (const entry of matrix) {
    try {
      await page.setViewportSize(entry.viewport);
      await page.emulateMedia({ colorScheme: entry.theme, reducedMotion: 'reduce' });
      await page.evaluate((theme) => localStorage.setItem('theme', theme), entry.theme);
      await page.goto(entry.url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate(async () => { await document.fonts.ready; });
      await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' });
      const state = await page.evaluate(() => ({
        language: document.documentElement.lang,
        direction: document.documentElement.dir,
        theme: document.documentElement.classList.contains('light') ? 'light' : 'dark',
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      const expectedDirection = entry.language === 'he' ? 'rtl' : 'ltr';
      if (state.language !== entry.language || state.direction !== expectedDirection || state.theme !== entry.theme) {
        throw new Error('document state mismatch: ' + JSON.stringify({ expected: { language: entry.language, direction: expectedDirection, theme: entry.theme }, actual: state }));
      }
      if (state.scrollWidth > state.clientWidth + 1) {
        throw new Error('horizontal overflow: ' + JSON.stringify(state));
      }
      await page.screenshot({
        path: entry.absoluteFile,
        type: 'webp',
        quality: 76,
        fullPage: entry.fullPage,
        animations: 'disabled',
        caret: 'hide',
        scale: 'css',
      });
    } catch (error) {
      failures.push({ route: entry.localizedPath, theme: entry.theme, viewport: entry.viewport.name, error: String(error) });
    }
  }
  if (failures.length > 0) throw new Error(JSON.stringify(failures, null, 2));
  return 'Captured ' + matrix.length + ' screenshots.';
}`;

const sha256 = async (file) => createHash('sha256').update(await readFile(file)).digest('hex');

const collectFiles = async (directory) => {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(target));
    else files.push(target);
  }
  return files;
};

const parseArgs = (argv) => {
  const options = {
    baseUrl: DEFAULT_BASE_URL,
    outputDir: DEFAULT_OUTPUT_DIR,
    sitemap: 'dist/sitemap.xml',
    browser: 'chrome',
    sourceSha: null,
    headed: false,
    fullPage: true,
    planOnly: false,
    limit: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--headed') options.headed = true;
    else if (argument === '--viewport-only') options.fullPage = false;
    else if (argument === '--plan-only') options.planOnly = true;
    else if (argument === '--base-url') options.baseUrl = argv[++index];
    else if (argument === '--output-dir') options.outputDir = argv[++index];
    else if (argument === '--sitemap') options.sitemap = argv[++index];
    else if (argument === '--browser') options.browser = argv[++index];
    else if (argument === '--source-sha') options.sourceSha = argv[++index];
    else if (argument === '--limit') options.limit = Number(argv[++index]);
    else throw new Error(`Unknown argument: ${argument}`);
  }

  if (options.limit !== null && (!Number.isInteger(options.limit) || options.limit < 1)) {
    throw new Error('--limit must be a positive integer.');
  }
  return options;
};

const runCli = (session, args, cwd) => execFileSync(
  'npx',
  ['--yes', '--package', `@playwright/cli@${PLAYWRIGHT_CLI_VERSION}`, 'playwright-cli', `-s=${session}`, ...args],
  { cwd, stdio: 'inherit' },
);

const run = async () => {
  const options = parseArgs(process.argv.slice(2));
  const repoRoot = process.cwd();
  const outputDir = path.resolve(repoRoot, options.outputDir);
  assertSafeOutputDir(repoRoot, outputDir);
  const sitemapXml = await readFile(path.resolve(repoRoot, options.sitemap), 'utf8');
  const { localizedRoutes, routeCount } = extractLocalizedRoutes(sitemapXml);
  const fullMatrix = buildCaptureMatrix({
    localizedRoutes,
    baseUrl: options.baseUrl,
    outputDir,
    fullPage: options.fullPage,
  });
  const matrix = options.limit === null ? fullMatrix : fullMatrix.slice(0, options.limit);

  await rm(outputDir, { recursive: true, force: true });
  await Promise.all(matrix.map(({ absoluteFile }) => mkdir(path.dirname(absoluteFile), { recursive: true })));
  await mkdir(outputDir, { recursive: true });

  const plan = {
    schemaVersion: 1,
    taskId: 'FIX-001',
    baseUrl: options.baseUrl,
    sourceSha: options.sourceSha ?? execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    routeCount,
    localizedRouteCount: localizedRoutes.length,
    languages: LANGUAGES,
    themes: THEMES,
    viewports: VIEWPORTS,
    fullPage: options.fullPage,
    expectedScreenshotCount: fullMatrix.length,
    selectedScreenshotCount: matrix.length,
    complete: matrix.length === fullMatrix.length,
    entries: matrix.map(({ absoluteFile: _absoluteFile, ...entry }) => entry),
  };
  await writeFile(path.join(outputDir, 'capture-plan.json'), `${JSON.stringify(plan, null, 2)}\n`);

  if (options.planOnly) {
    console.log(`Planned ${matrix.length}/${fullMatrix.length} screenshots across ${routeCount} canonical routes.`);
    return;
  }

  const codeFile = path.join(outputDir, '.capture-playwright.js');
  await writeFile(codeFile, `${buildPlaywrightFunction(matrix)}\n`);
  const session = `fix001-${process.pid}`;
  const cliCwd = outputDir;
  try {
    runCli(session, ['open', options.baseUrl, '--browser', options.browser, ...(options.headed ? ['--headed'] : [])], cliCwd);
    runCli(session, ['run-code', '--filename', codeFile], cliCwd);
  } finally {
    try {
      runCli(session, ['close'], cliCwd);
    } catch {
      // The capture error is more useful than a secondary close failure.
    }
    await rm(codeFile, { force: true });
  }

  const imageFiles = (await collectFiles(outputDir)).filter((file) => file.endsWith('.webp')).sort();
  if (imageFiles.length !== matrix.length) {
    throw new Error(`Captured ${imageFiles.length} screenshots; expected ${matrix.length}.`);
  }

  const files = await Promise.all(imageFiles.map(async (file) => ({
    path: path.relative(outputDir, file),
    bytes: (await stat(file)).size,
    sha256: await sha256(file),
  })));
  const manifest = {
    ...plan,
    capturedAt: new Date().toISOString(),
    browser: options.browser,
    playwrightCliVersion: PLAYWRIGHT_CLI_VERSION,
    files,
  };
  const manifestFile = path.join(outputDir, 'manifest.json');
  await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Captured and hashed ${files.length} screenshots in ${outputDir}.`);
};

const isEntryPoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntryPoint) {
  await run();
}
