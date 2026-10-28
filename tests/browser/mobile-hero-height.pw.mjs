import { expect, test } from '@playwright/test';

const cases = [
  { language: 'en', theme: 'light' },
  { language: 'en', theme: 'dark' },
  { language: 'he', theme: 'light' },
  { language: 'he', theme: 'dark' },
];

test.describe('FIX-033 compact mobile hero', () => {
  for (const entry of cases) {
    test(`${entry.language}-${entry.theme} reveals proof in the first viewport`, async ({ page }) => {
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
      const proof = page.locator('#projects');
      const proofLabel = proof.locator('.home-section-label');
      const decorativeVisual = page.getByTestId('product-compiler-visual');

      await expect(hero).toBeVisible();
      await expect(proofLabel).toBeVisible();
      await expect(decorativeVisual).toBeHidden();
      const proofBox = await proof.boundingBox();
      const proofLabelBox = await proofLabel.boundingBox();
      expect(proofBox).not.toBeNull();
      expect(proofLabelBox).not.toBeNull();
      expect(proofBox.y).toBeLessThan(844);
      expect(proofLabelBox.y).toBeLessThan(844);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    });
  }
});
