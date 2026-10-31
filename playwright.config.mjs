import { defineConfig } from '@playwright/test';

const uiInvariantsBaseUrl = process.env.UI_INVARIANTS_BASE_URL?.replace(/\/$/, '');

export default defineConfig({
  testDir: './tests/browser',
  testMatch: '**/*.pw.mjs',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  timeout: 45_000,
  workers: process.env.CI ? 2 : 4,
  reporter: 'line',
  outputDir: 'output/playwright/test-results',
  use: {
    baseURL: uiInvariantsBaseUrl || 'http://127.0.0.1:43104',
    browserName: 'chromium',
    channel: 'chrome',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: uiInvariantsBaseUrl ? undefined : {
    command: 'npm run preview -- --host 127.0.0.1 --port 43104 --strictPort',
    url: 'http://127.0.0.1:43104/en/',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
