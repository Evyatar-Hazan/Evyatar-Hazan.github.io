import { expect, test } from '@playwright/test';

const viewports = [
  { id: 'desktop', width: 1440, height: 900 },
  { id: 'mobile', width: 390, height: 844 },
];

for (const language of ['en', 'he']) {
  for (const viewport of viewports) {
    test(`FIX-034 shows three concise ${language} proof points on ${viewport.id}`, async ({ page }) => {
      await page.addInitScript(({ activeLanguage, theme }) => {
        localStorage.setItem('i18nextLng', activeLanguage);
        localStorage.setItem('theme', theme);
      }, {
        activeLanguage: language,
        theme: language === 'he' ? 'dark' : 'light',
      });

      await page.setViewportSize(viewport);
      await page.goto(`/${language}/`, { waitUntil: 'domcontentloaded' });

      const strip = page.getByTestId('hero-proof-strip');
      await expect(strip).toBeVisible();
      await expect(strip.locator('dt')).toHaveCount(3);
      await expect(strip.locator('dd')).toHaveCount(3);
      await expect(strip).toHaveAttribute(
        'aria-label',
        language === 'he' ? 'הוכחות במבט אחד' : 'At-a-glance proof',
      );

      if (viewport.id === 'mobile') {
        const descriptions = await strip.locator('dd').evaluateAll((nodes) => nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        }));
        expect(descriptions.every(({ width, height }) => width <= 1 && height <= 1)).toBe(true);
        await expect(page.getByTestId('localized-hero-actions')).toBeInViewport();
      } else {
        await expect(strip.locator('dd').first()).toBeVisible();
      }

      expect(await page.evaluate(() => document.documentElement.dir)).toBe(language === 'he' ? 'rtl' : 'ltr');
      expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth))
        .toBe(false);
    });
  }
}
