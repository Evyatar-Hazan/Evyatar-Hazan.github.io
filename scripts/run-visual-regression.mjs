import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { chromium } from '@playwright/test';

export const SIGNIFICANT_DIFF_RATIO = 0.01;
export const MAX_DIMENSION_DELTA = 8;
export const PIXEL_THRESHOLD = 0.2;

export const ROUTES = [
  { id: 'home', path: '/' },
  { id: 'projects', path: '/projects/' },
  { id: 'about', path: '/about/' },
  { id: 'blog', path: '/blog/' },
  { id: 'contact', path: '/contact/' },
];

export const MODES = [
  { id: 'desktop-en-dark', language: 'en', theme: 'dark', viewport: { width: 1440, height: 900 } },
  { id: 'desktop-he-light', language: 'he', theme: 'light', viewport: { width: 1440, height: 900 } },
  { id: 'mobile-en-light', language: 'en', theme: 'light', viewport: { width: 390, height: 844 } },
  { id: 'mobile-he-dark', language: 'he', theme: 'dark', viewport: { width: 390, height: 844 } },
];

export const buildVisualMatrix = () => ROUTES.flatMap((route) => MODES.map((mode) => ({
  ...route,
  ...mode,
  id: `${route.id}-${mode.id}`,
  localizedPath: `/${mode.language}${route.path}`,
})));

const normalizeBaseUrl = (value) => value.replace(/\/$/u, '');

export const classifyVisualDifference = ({
  diffPixels,
  totalPixels,
  baselineWidth,
  baselineHeight,
  candidateWidth,
  candidateHeight,
  significantDiffRatio = SIGNIFICANT_DIFF_RATIO,
  maxDimensionDelta = MAX_DIMENSION_DELTA,
}) => {
  const ratio = totalPixels === 0 ? 0 : diffPixels / totalPixels;
  const widthDelta = Math.abs(baselineWidth - candidateWidth);
  const heightDelta = Math.abs(baselineHeight - candidateHeight);
  return {
    ratio,
    widthDelta,
    heightDelta,
    significant: ratio > significantDiffRatio
      || widthDelta > maxDimensionDelta
      || heightDelta > maxDimensionDelta,
  };
};

const padPng = (source, width, height) => {
  const padded = new PNG({ width, height, fill: true });
  PNG.bitblt(source, padded, 0, 0, source.width, source.height, 0, 0);
  return padded;
};

export const comparePngBuffers = (baselineBuffer, candidateBuffer) => {
  const baselineSource = PNG.sync.read(baselineBuffer);
  const candidateSource = PNG.sync.read(candidateBuffer);
  const width = Math.max(baselineSource.width, candidateSource.width);
  const height = Math.max(baselineSource.height, candidateSource.height);
  const baseline = padPng(baselineSource, width, height);
  const candidate = padPng(candidateSource, width, height);
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(
    baseline.data,
    candidate.data,
    diff.data,
    width,
    height,
    { threshold: PIXEL_THRESHOLD, includeAA: false },
  );
  const classification = classifyVisualDifference({
    diffPixels,
    totalPixels: width * height,
    baselineWidth: baselineSource.width,
    baselineHeight: baselineSource.height,
    candidateWidth: candidateSource.width,
    candidateHeight: candidateSource.height,
  });
  return {
    ...classification,
    diffPixels,
    totalPixels: width * height,
    baselineSize: { width: baselineSource.width, height: baselineSource.height },
    candidateSize: { width: candidateSource.width, height: candidateSource.height },
    diffBuffer: PNG.sync.write(diff),
  };
};

const waitForServer = async (url, timeoutMs = 60_000) => {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.ok || (response.status >= 300 && response.status < 400)) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Preview did not become ready at ${url}: ${String(lastError)}`);
};

const startPreview = async (baseUrl) => {
  const url = new URL(baseUrl);
  const child = spawn(
    'npm',
    ['run', 'preview', '--', '--host', url.hostname, '--port', url.port, '--strictPort'],
    { stdio: 'inherit', env: { ...process.env } },
  );
  await waitForServer(baseUrl);
  return child;
};

const stopPreview = async (child) => {
  if (!child || child.exitCode !== null) return;
  child.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => child.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
  if (child.exitCode === null) child.kill('SIGKILL');
};

const capture = async ({ browser, baseUrl, entry, cacheKey }) => {
  const context = await browser.newContext({
    viewport: entry.viewport,
    colorScheme: entry.theme,
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
  });
  await context.addInitScript(({ language, theme }) => {
    localStorage.setItem('i18nextLng', language);
    localStorage.setItem('theme', theme);
  }, { language: entry.language, theme: entry.theme });
  const page = await context.newPage();
  try {
    const separator = entry.localizedPath.includes('?') ? '&' : '?';
    const url = `${normalizeBaseUrl(baseUrl)}${entry.localizedPath}${separator}visual-regression=${cacheKey}`;
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
    if (!response?.ok()) throw new Error(`${url} returned HTTP ${response?.status() ?? 'unknown'}`);
    await page.locator('main').waitFor({ state: 'visible', timeout: 30_000 });
    await page.evaluate(async () => { await document.fonts.ready; });
    await page.locator('img').evaluateAll(async (images) => {
      await Promise.all(images.map(async (image) => {
        image.loading = 'eager';
        if (!image.complete) {
          await new Promise((resolve) => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
          });
        }
        await image.decode().catch(() => undefined);
      }));
    });
    await page.addStyleTag({
      content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}',
    });
    const state = await page.evaluate(() => ({
      language: document.documentElement.lang,
      direction: document.documentElement.dir,
      theme: document.documentElement.classList.contains('light') ? 'light' : 'dark',
    }));
    const expectedDirection = entry.language === 'he' ? 'rtl' : 'ltr';
    if (state.language !== entry.language || state.direction !== expectedDirection || state.theme !== entry.theme) {
      throw new Error(`State mismatch for ${url}: ${JSON.stringify({ expectedDirection, entry, state })}`);
    }
    return await page.screenshot({
      type: 'png',
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    });
  } finally {
    await context.close();
  }
};

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const writeReport = async ({ outputDir, results, baselineBaseUrl, candidateBaseUrl, approved }) => {
  const significantResults = results.filter(({ significant }) => significant);
  const summary = {
    schemaVersion: 1,
    taskId: 'FIX-002',
    baselineBaseUrl,
    candidateBaseUrl,
    threshold: {
      maxDiffPixelRatio: SIGNIFICANT_DIFF_RATIO,
      maxDimensionDelta: MAX_DIMENSION_DELTA,
      pixelThreshold: PIXEL_THRESHOLD,
    },
    approved,
    comparisonCount: results.length,
    significantDifferenceCount: significantResults.length,
    results,
  };
  await writeFile(path.join(outputDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);

  const rows = results.map((result) => `<tr><td>${escapeHtml(result.id)}</td><td>${(result.ratio * 100).toFixed(3)}%</td><td>${result.widthDelta}×${result.heightDelta}px</td><td>${result.significant ? 'SIGNIFICANT' : 'pass'}</td>${result.significant ? `<td><a href="${result.id}/baseline.png">baseline</a> · <a href="${result.id}/candidate.png">candidate</a> · <a href="${result.id}/diff.png">diff</a></td>` : '<td>—</td>'}</tr>`).join('\n');
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>FIX-002 visual regression</title><style>body{font:14px system-ui;margin:2rem;color:#111}table{border-collapse:collapse;width:100%}th,td{border:1px solid #bbb;padding:.55rem;text-align:left}th{background:#eee}</style><h1>FIX-002 visual regression</h1><p>Baseline: ${escapeHtml(baselineBaseUrl)}<br>Candidate: ${escapeHtml(candidateBaseUrl)}<br>Significant differences: ${significantResults.length}/${results.length}${approved ? ' (explicitly approved)' : ''}</p><table><thead><tr><th>Case</th><th>Pixel diff</th><th>Dimension delta</th><th>Result</th><th>Evidence</th></tr></thead><tbody>${rows}</tbody></table></html>`;
  await writeFile(path.join(outputDir, 'index.html'), html);

  const markdown = [
    '## FIX-002 visual regression',
    '',
    `- Comparisons: ${results.length}`,
    `- Significant differences: ${significantResults.length}`,
    `- Threshold: ${(SIGNIFICANT_DIFF_RATIO * 100).toFixed(2)}% changed pixels or more than ${MAX_DIMENSION_DELTA}px dimension drift`,
    `- Explicit visual approval: ${approved ? 'yes' : 'no'}`,
    '',
    ...significantResults.map((result) => `- \`${result.id}\`: ${(result.ratio * 100).toFixed(3)}% changed; diff is attached in the \`visual-regression-report\` artifact.`),
    '',
  ].join('\n');
  await writeFile(path.join(outputDir, 'summary.md'), markdown);
  if (process.env.GITHUB_STEP_SUMMARY) {
    await writeFile(process.env.GITHUB_STEP_SUMMARY, markdown, { flag: 'a' });
  }
  return significantResults;
};

const run = async () => {
  const baselineBaseUrl = normalizeBaseUrl(process.env.VISUAL_BASELINE_URL ?? 'https://evyatarhazan.com');
  const candidateBaseUrl = normalizeBaseUrl(process.env.VISUAL_CANDIDATE_URL ?? 'http://127.0.0.1:4272');
  const approved = process.env.VISUAL_CHANGE_APPROVED === 'true';
  const outputDir = path.resolve(process.env.VISUAL_REPORT_DIR ?? 'test-results/visual-regression');
  const cacheKey = process.env.GITHUB_SHA ?? String(Date.now());
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  let preview;
  let browser;
  try {
    if (!process.env.VISUAL_CANDIDATE_URL) preview = await startPreview(candidateBaseUrl);
    browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome', headless: true });
    const results = [];
    for (const entry of buildVisualMatrix()) {
      process.stdout.write(`Comparing ${entry.id}... `);
      const baselineBuffer = await capture({ browser, baseUrl: baselineBaseUrl, entry, cacheKey });
      const candidateBuffer = await capture({ browser, baseUrl: candidateBaseUrl, entry, cacheKey });
      const comparison = comparePngBuffers(baselineBuffer, candidateBuffer);
      const result = {
        id: entry.id,
        localizedPath: entry.localizedPath,
        language: entry.language,
        theme: entry.theme,
        viewport: entry.viewport,
        ratio: comparison.ratio,
        diffPixels: comparison.diffPixels,
        totalPixels: comparison.totalPixels,
        widthDelta: comparison.widthDelta,
        heightDelta: comparison.heightDelta,
        baselineSize: comparison.baselineSize,
        candidateSize: comparison.candidateSize,
        significant: comparison.significant,
      };
      results.push(result);
      if (result.significant) {
        const evidenceDir = path.join(outputDir, entry.id);
        await mkdir(evidenceDir, { recursive: true });
        await Promise.all([
          writeFile(path.join(evidenceDir, 'baseline.png'), baselineBuffer),
          writeFile(path.join(evidenceDir, 'candidate.png'), candidateBuffer),
          writeFile(path.join(evidenceDir, 'diff.png'), comparison.diffBuffer),
        ]);
      }
      process.stdout.write(`${(result.ratio * 100).toFixed(3)}% ${result.significant ? 'SIGNIFICANT' : 'pass'}\n`);
    }
    const significantResults = await writeReport({
      outputDir,
      results,
      baselineBaseUrl,
      candidateBaseUrl,
      approved,
    });
    if (significantResults.length > 0 && !approved) {
      throw new Error(`${significantResults.length} significant visual difference(s) detected. Open ${path.join(outputDir, 'index.html')} or the CI artifact for baseline/candidate/diff evidence.`);
    }
  } finally {
    if (browser) await browser.close();
    await stopPreview(preview);
  }
};

const isEntryPoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntryPoint) {
  await run();
}
