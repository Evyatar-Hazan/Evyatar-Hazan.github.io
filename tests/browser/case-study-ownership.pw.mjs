import { expect, test } from '@playwright/test';

const projectIds = [
  'nis_boutique',
  'online_converter',
  'emergency_protocol',
  'united_hatzalah',
];

const scenarios = [
  { language: 'en', theme: 'light', viewport: { width: 1440, height: 900 } },
  { language: 'en', theme: 'dark', viewport: { width: 390, height: 844 } },
  { language: 'he', theme: 'light', viewport: { width: 1440, height: 900 } },
  { language: 'he', theme: 'dark', viewport: { width: 390, height: 844 } },
];

for (const scenario of scenarios) {
  test(`FIX-044 states ownership for every ${scenario.language} case study at ${scenario.viewport.width}px`, async ({ page }) => {
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('theme', theme);
    }, scenario);
    await page.setViewportSize(scenario.viewport);

    for (const projectId of projectIds) {
      await page.goto(`/${scenario.language}/projects/${projectId}/`, { waitUntil: 'domcontentloaded' });

      const ownership = page.locator('#role .case-story-role-boundary');
      await expect(ownership).toBeVisible();
      await expect(ownership.locator(':scope > div')).toHaveCount(2);
      await expect(ownership.locator('p').nth(0)).not.toHaveText('');
      await expect(ownership.locator('p').nth(1)).not.toHaveText('');
      await expect(page.locator('#role .case-story-lede')).not.toHaveText('');
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
        `${scenario.language}/${projectId} must not overflow`,
      ).toBe(false);
    }
  });
}
