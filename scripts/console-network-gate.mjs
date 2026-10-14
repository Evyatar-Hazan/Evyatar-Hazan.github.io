import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { pathToFileURL } from 'node:url';
import process from 'node:process';
import { chromium } from 'playwright-core';

const host = '127.0.0.1';
const routes = [
  '/en/',
  '/he/',
  '/en/projects/',
  '/he/projects/',
  '/en/about/',
  '/he/about/',
  '/en/blog/',
  '/he/blog/',
  '/en/contact/',
  '/he/contact/',
];
const browserModes = [
  {
    name: 'desktop-light',
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    isMobile: false,
  },
  {
    name: 'mobile-dark',
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
    isMobile: true,
  },
];

export const isFirstPartyUrl = (candidate, appOrigin) => {
  if (!candidate) return true;

  try {
    return new URL(candidate, appOrigin).origin === appOrigin;
  } catch {
    return true;
  }
};

export const shouldFailConsoleMessage = ({ type, sourceUrl }, appOrigin) => (
  type === 'error' && isFirstPartyUrl(sourceUrl, appOrigin)
);

export const sourceUrlFromError = (error) => (
  error.stack?.match(/https?:\/\/[^\s)]+/)?.[0] ?? ''
);

const reservePort = async () => new Promise((resolve, reject) => {
  const server = createServer();
  server.once('error', reject);
  server.listen(0, host, () => {
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : null;
    server.close((error) => {
      if (error) reject(error);
      else if (port) resolve(port);
      else reject(new Error('Could not reserve a preview port.'));
    });
  });
});

const waitForPreview = async (baseUrl, child) => {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Preview server exited with code ${child.exitCode}.`);
    }

    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The preview process may still be binding the port.
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  throw new Error(`Preview server did not become ready at ${baseUrl}.`);
};

const startPreview = async () => {
  const port = await reservePort();
  const baseUrl = `http://${host}:${port}`;
  const child = spawn(
    process.execPath,
    ['./node_modules/vite/bin/vite.js', 'preview', '--host', host, '--port', String(port), '--strictPort'],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );
  let output = '';
  child.stdout.on('data', (chunk) => { output += chunk; });
  child.stderr.on('data', (chunk) => { output += chunk; });

  try {
    await waitForPreview(baseUrl, child);
  } catch (error) {
    child.kill('SIGTERM');
    throw new Error(`${error.message}\n${output.trim()}`);
  }

  return { baseUrl, child };
};

const stopPreview = async (child) => {
  if (!child || child.exitCode !== null) return;
  child.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => child.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 2_000)),
  ]);
  if (child.exitCode === null) child.kill('SIGKILL');
};

const describeConsoleMessage = (message) => {
  const location = message.location();
  return `${message.type().toUpperCase()} ${message.text()}${location.url ? ` (${location.url}:${location.lineNumber ?? 0})` : ''}`;
};

const runRoute = async ({ context, baseUrl, mode, route }) => {
  const appOrigin = new URL(baseUrl).origin;
  const page = await context.newPage();
  const failures = [];
  const ignoredThirdPartyDiagnostics = [];

  page.on('pageerror', (error) => {
    const rendered = `runtime error: ${error.stack || error.message}`;
    if (isFirstPartyUrl(sourceUrlFromError(error), appOrigin)) failures.push(rendered);
    else ignoredThirdPartyDiagnostics.push(rendered);
  });
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const sourceUrl = message.location().url;
    const rendered = `console ${describeConsoleMessage(message)}`;
    if (shouldFailConsoleMessage({ type: message.type(), sourceUrl }, appOrigin)) failures.push(rendered);
    else ignoredThirdPartyDiagnostics.push(rendered);
  });
  page.on('requestfailed', (request) => {
    const rendered = `request failed: ${request.method()} ${request.url()} — ${request.failure()?.errorText ?? 'unknown error'}`;
    if (isFirstPartyUrl(request.url(), appOrigin)) failures.push(rendered);
    else ignoredThirdPartyDiagnostics.push(rendered);
  });
  page.on('response', (response) => {
    if (response.status() < 400) return;
    const rendered = `HTTP ${response.status()}: ${response.request().method()} ${response.url()}`;
    if (isFirstPartyUrl(response.url(), appOrigin)) failures.push(rendered);
    else ignoredThirdPartyDiagnostics.push(rendered);
  });

  try {
    const response = await page.goto(`${baseUrl}${route}?qa=console-network`, {
      waitUntil: 'networkidle',
      timeout: 30_000,
    });
    if (!response || response.status() >= 400) {
      failures.push(`document response was ${response?.status() ?? 'missing'}`);
    }
    await page.locator('#main-content').waitFor({ state: 'visible', timeout: 10_000 });

    if (route === '/en/') {
      const themeButton = page.getByRole('button', { name: /Use (?:light|dark) theme/ });
      await themeButton.click();
      await page.getByRole('button', { name: /Switch language to עברית/ }).click();
      await page.waitForURL(/\/he\//);

      if (mode.isMobile) {
        await page.getByRole('button', { name: 'פתיחת תפריט ניווט' }).click();
        await page.getByRole('dialog', { name: 'ניווט באתר' }).waitFor({ state: 'visible' });
        await page.keyboard.press('Escape');
        await page.getByRole('dialog', { name: 'ניווט באתר' }).waitFor({ state: 'hidden' });
      }
    }

    await page.waitForTimeout(100);
  } catch (error) {
    failures.push(`gate interaction failed: ${error.stack || error.message}`);
  } finally {
    await page.close();
  }

  return {
    label: `${mode.name} ${route}`,
    failures,
    ignoredThirdPartyDiagnostics,
  };
};

const main = async () => {
  let preview;
  let browser;

  try {
    preview = process.env.QA_BASE_URL
      ? { baseUrl: process.env.QA_BASE_URL.replace(/\/$/, ''), child: null }
      : await startPreview();
    browser = await chromium.launch({
      channel: process.env.QA_BROWSER_CHANNEL || 'chrome',
      headless: process.env.QA_HEADLESS !== 'false',
    });

    const results = [];
    for (const mode of browserModes) {
      const context = await browser.newContext({
        viewport: mode.viewport,
        colorScheme: mode.colorScheme,
        reducedMotion: 'reduce',
        locale: mode.name.startsWith('mobile') ? 'he-IL' : 'en-US',
        hasTouch: mode.isMobile,
        isMobile: mode.isMobile,
      });

      for (const route of routes) {
        results.push(await runRoute({ context, baseUrl: preview.baseUrl, mode, route }));
      }
      await context.close();
    }

    const failures = results.flatMap((result) => result.failures.map((failure) => `${result.label}: ${failure}`));
    const ignoredCount = results.reduce(
      (total, result) => total + result.ignoredThirdPartyDiagnostics.length,
      0,
    );

    if (failures.length > 0) {
      console.error(`Console/network gate failed with ${failures.length} first-party diagnostic(s):`);
      failures.forEach((failure) => console.error(`- ${failure}`));
      process.exitCode = 1;
      return;
    }

    console.log(
      `Console/network gate passed: ${results.length} route checks across desktop/light and mobile/dark; `
      + `0 first-party console errors, runtime errors, failed requests, or HTTP 4xx/5xx responses. `
      + `Ignored third-party diagnostics: ${ignoredCount}.`,
    );
  } finally {
    await browser?.close();
    await stopPreview(preview?.child);
  }
};

const isDirectExecution = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  await main();
}
