import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/projects/',
  '/about/',
  '/blog/',
  '/blog/initial-html-should-contain-the-article/',
  '/contact/',
  '/lab/',
  '/privacy/',
  '/projects/nis_boutique/',
];

const viewports = [
  { id: 'desktop', width: 1680, height: 900, expectedWidth: 1480, expectedInset: 100, expectedGutter: 48 },
  { id: 'mobile', width: 390, height: 844, expectedWidth: 390, expectedInset: 0, expectedGutter: 20 },
];

const containerMetrics = (elements) => elements.map((element) => {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);

  return {
    left: Math.round(rect.left),
    paddingLeft: Math.round(Number.parseFloat(style.paddingLeft)),
    paddingRight: Math.round(Number.parseFloat(style.paddingRight)),
    right: Math.round(rect.right),
    width: Math.round(rect.width),
  };
});

for (const language of ['en', 'he']) {
  test(`FIX-024 keeps ${language} pages on the canonical content container`, async ({ page }) => {
    await page.addInitScript((activeLanguage) => {
      localStorage.setItem('i18nextLng', activeLanguage);
      localStorage.setItem('theme', activeLanguage === 'he' ? 'dark' : 'light');
    }, language);

    for (const route of routes) {
      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(`/${language}${route}`, { waitUntil: 'domcontentloaded' });
        await page.locator('#main-content').waitFor({ state: 'visible' });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        });

        const containers = page.locator('.content-container:visible');
        await expect(containers.first(), `${language}${route} must expose a canonical container`).toBeVisible();
        expect(await containers.count(), `${language}${route} must expose a canonical container`).toBeGreaterThan(0);

        const metrics = await containers.evaluateAll(containerMetrics);
        for (const metric of metrics) {
          expect(metric.width, `${language}${route} ${viewport.id} width`).toBe(viewport.expectedWidth);
          expect(metric.left, `${language}${route} ${viewport.id} left inset`).toBe(viewport.expectedInset);
          expect(viewport.width - metric.right, `${language}${route} ${viewport.id} right inset`).toBe(viewport.expectedInset);
          expect(metric.paddingLeft, `${language}${route} ${viewport.id} left gutter`).toBe(viewport.expectedGutter);
          expect(metric.paddingRight, `${language}${route} ${viewport.id} right gutter`).toBe(viewport.expectedGutter);
        }

        expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
          `${language}${route} must not overflow at ${viewport.width}px`).toBe(false);
      }
    }
  });
}
