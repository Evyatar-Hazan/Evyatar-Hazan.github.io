import { expect, test } from '@playwright/test';

const projectVisualCounts = {
  nis_boutique: 2,
  online_converter: 2,
  emergency_protocol: 2,
  united_hatzalah: 1,
};

const viewports = [
  { id: 'desktop', width: 1440, height: 900 },
  { id: 'mobile', width: 390, height: 844 },
];

for (const language of ['en', 'he']) {
  for (const viewport of viewports) {
    test(`FIX-047 ${viewport.id}-${language} gives every product image a purposeful caption and alt`, async ({ page }) => {
      await page.addInitScript(({ activeLanguage, theme }) => {
        localStorage.setItem('i18nextLng', activeLanguage);
        localStorage.setItem('theme', theme);
      }, {
        activeLanguage: language,
        theme: viewport.id === 'mobile' ? 'dark' : 'light',
      });
      await page.setViewportSize(viewport);

      for (const [projectId, expectedCount] of Object.entries(projectVisualCounts)) {
        await page.goto(`/${language}/projects/${projectId}/`, { waitUntil: 'domcontentloaded' });
        const gallery = page.locator('.product-visual-gallery');
        await expect(gallery).toBeVisible();

        const figures = gallery.locator('figure');
        await expect(figures).toHaveCount(expectedCount);

        for (let index = 0; index < expectedCount; index += 1) {
          const figure = figures.nth(index);
          const image = figure.locator('img');
          const caption = figure.locator('figcaption');
          const alt = await image.getAttribute('alt');
          const captionId = await caption.getAttribute('id');
          const captionText = (await caption.locator('p').textContent())?.trim();

          expect(alt?.trim().length, `${projectId} image ${index + 1} alt`).toBeGreaterThan(20);
          expect(captionText?.length, `${projectId} image ${index + 1} caption`).toBeGreaterThan(20);
          expect(captionText, `${projectId} image ${index + 1} caption must add context`).not.toBe(alt?.trim());
          expect(captionId, `${projectId} image ${index + 1} caption id`).toBeTruthy();
          await expect(image).toHaveAttribute('aria-describedby', captionId);
        }

        expect(await page.evaluate(() => document.documentElement.dir)).toBe(language === 'he' ? 'rtl' : 'ltr');
        expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
          `${projectId} must not overflow at ${viewport.width}px`).toBe(false);
      }
    });
  }
}
