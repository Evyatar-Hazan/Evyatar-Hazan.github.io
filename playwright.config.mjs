import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  testMatch: '**/*.pw.mjs',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: 'line',
  outputDir: 'output/playwright/test-results',
  use: {
    baseURL: 'http://127.0.0.1:43104',
    browserName: 'chromium',
    channel: 'chrome',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 43104 --strictPort',
    url: 'http://127.0.0.1:43104/en/',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
