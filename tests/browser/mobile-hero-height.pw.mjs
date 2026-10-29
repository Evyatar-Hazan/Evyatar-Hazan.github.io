import { expect, test } from '@playwright/test';

const cases = [
  { language: 'en', theme: 'light' },
  { language: 'en', theme: 'dark' },
  { language: 'he', theme: 'light' },
  { language: 'he', theme: 'dark' },
];

test.describe('FIX-033 compact mobile hero', () => {
  for (const entry of cases) {
    test(`${entry.language}-${entry.theme} reveals the next value path in the first viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ colorScheme: entry.theme, reducedMotion: 'reduce' });
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem('i18nextLng', language);
        localStorage.setItem('theme', theme);
      }, entry);

      await page.goto(`/${entry.language}/`, { waitUntil: 'domcontentloaded' });
      await page.locator('#main-content').waitFor({ state: 'visible' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });

      const hero = page.locator('#home');
      const nextValue = page.locator('.home-audience-entry, #projects').first();
      const nextValueLabel = nextValue.locator('.home-section-label').first();
      const projectsPath = nextValue.locator(`a[href="/${entry.language}/projects/"]`);
      const decorativeVisual = page.getByTestId('product-compiler-visual');

      await expect(hero).toBeVisible();
      await expect(nextValueLabel).toBeVisible();
      await expect(projectsPath).toHaveCount(1);
      await expect(decorativeVisual).toBeHidden();
      const nextValueBox = await nextValue.boundingBox();
      const nextValueLabelBox = await nextValueLabel.boundingBox();
      expect(nextValueBox).not.toBeNull();
      expect(nextValueLabelBox).not.toBeNull();
      expect(nextValueBox.y).toBeLessThan(844);
      expect(nextValueLabelBox.y).toBeLessThan(844);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    });
  }
});
