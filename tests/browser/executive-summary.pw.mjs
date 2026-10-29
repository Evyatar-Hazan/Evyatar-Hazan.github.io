import { expect, test } from '@playwright/test';

const scenarios = [
  { projectId: 'nis_boutique', language: 'en', theme: 'light', viewport: { width: 1440, height: 900 } },
  { projectId: 'online_converter', language: 'he', theme: 'dark', viewport: { width: 390, height: 844 } },
  { projectId: 'emergency_protocol', language: 'en', theme: 'dark', viewport: { width: 390, height: 844 } },
  { projectId: 'united_hatzalah', language: 'he', theme: 'light', viewport: { width: 1440, height: 900 } },
];

for (const scenario of scenarios) {
  test(`FIX-043 opens ${scenario.projectId} with a concise ${scenario.language} executive summary`, async ({ page }) => {
    await page.setViewportSize(scenario.viewport);
    await page.emulateMedia({ colorScheme: scenario.theme, reducedMotion: 'reduce' });
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('theme', theme);
    }, scenario);

    await page.goto(`/${scenario.language}/projects/${scenario.projectId}/`);

    const summary = page.locator(`[data-executive-summary="${scenario.projectId}"]`);
    await expect(summary).toBeVisible();
    await expect(summary.getByRole('heading', {
      name: scenario.language === 'he' ? 'תקציר מנהלים' : 'Executive summary',
    })).toBeVisible();
    await expect(summary.locator('dt')).toHaveCount(4);
    await expect(summary.locator('dd')).toHaveCount(4);
    await expect(summary.locator('dd').last()).not.toBeEmpty();

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(scenario.viewport.width);

    if (scenario.viewport.width === 390) {
      const actions = page.locator('.system-rail-mobile-actions');
      await expect(actions.locator('.system-rail-icon')).toHaveCount(1);
      await expect(actions.locator('.system-rail-mobile-language')).toHaveCount(1);
      await expect(actions.locator('.system-rail-menu-toggle')).toHaveCount(1);
    }
  });
}
