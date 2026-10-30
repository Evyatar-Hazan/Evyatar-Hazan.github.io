import { expect, test } from '@playwright/test';

const scenarios = [
  { language: 'en', theme: 'light', width: 1440, height: 900 },
  { language: 'en', theme: 'dark', width: 390, height: 844 },
  { language: 'he', theme: 'light', width: 1440, height: 900 },
  { language: 'he', theme: 'dark', width: 390, height: 844 },
];

for (const scenario of scenarios) {
  const { language, theme, width, height } = scenario;

  test(`FIX-057 ${language}-${theme}-${width} shows a concrete example for every working principle`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.addInitScript(({ activeLanguage, activeTheme }) => {
      localStorage.setItem('i18nextLng', activeLanguage);
      localStorage.setItem('theme', activeTheme);
    }, { activeLanguage: language, activeTheme: theme });

    await page.goto(`/${language}/about/#working-principles`, { waitUntil: 'domcontentloaded' });

    const section = page.locator('#working-principles');
    await expect(section).toBeVisible();

    const principles = section.locator('[data-principle-id]');
    await expect(principles).toHaveCount(4);

    for (const principle of await principles.all()) {
      const example = principle.locator('[data-evidence-tone="example"]');
      await expect(example).toHaveCount(1);
      await expect(example.locator('p').nth(1)).not.toHaveText('');

      const evidenceLink = example.getByRole('link');
      await expect(evidenceLink).toHaveCount(1);
      await expect(evidenceLink).toHaveAttribute('href', new RegExp(`^/${language}/(?:projects|blog)/`));
    }

    expect(await page.evaluate(() => document.documentElement.dir)).toBe(language === 'he' ? 'rtl' : 'ltr');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  });
}
