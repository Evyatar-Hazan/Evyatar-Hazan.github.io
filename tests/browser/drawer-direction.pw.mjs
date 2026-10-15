import { expect, test } from '@playwright/test';

const cases = [
  { language: 'en', direction: 'ltr', openingSign: 1, edge: 'right' },
  { language: 'he', direction: 'rtl', openingSign: -1, edge: 'left' },
];

const roundedBox = async (locator) => {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return Object.fromEntries(
    Object.entries(box).map(([key, value]) => [key, Math.round(value * 100) / 100]),
  );
};

test.describe('FIX-013 language-aware drawer direction', () => {
  for (const entry of cases) {
    test(`${entry.language} opens from the natural ${entry.edge} edge`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
      await page.addInitScript((language) => {
        localStorage.setItem('i18nextLng', language);
        localStorage.setItem('theme', 'light');
      }, entry.language);

      await page.goto(`/${entry.language}/`);
      await page.locator('#main-content').waitFor({ state: 'visible' });
      await expect(page.locator('html')).toHaveAttribute('dir', entry.direction);

      const openingOffset = await page.evaluate(() => new Promise((resolve) => {
        const trigger = document.querySelector('.system-rail-menu-toggle');
        let remainingFrames = 30;

        const sample = () => {
          const drawer = document.querySelector('.system-rail-mobile-menu');
          if (drawer) {
            const matrix = new DOMMatrixReadOnly(getComputedStyle(drawer).transform);
            if (Math.abs(matrix.m41) > 1) {
              resolve(matrix.m41);
              return;
            }
          }

          remainingFrames -= 1;
          if (remainingFrames === 0) {
            resolve(null);
            return;
          }
          requestAnimationFrame(sample);
        };

        trigger?.click();
        requestAnimationFrame(sample);
      }));

      expect(openingOffset).not.toBeNull();
      expect(Math.sign(openingOffset)).toBe(entry.openingSign);

      const drawer = page.getByRole('dialog');
      await expect(drawer).toBeVisible();
      await expect.poll(async () => drawer.evaluate((element) => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
        return Math.abs(matrix.m41);
      })).toBeLessThan(0.5);

      const box = await roundedBox(drawer);
      if (entry.edge === 'right') {
        expect(Math.abs(box.x + box.width - 390)).toBeLessThan(0.5);
      } else {
        expect(Math.abs(box.x)).toBeLessThan(0.5);
      }
    });
  }
});
