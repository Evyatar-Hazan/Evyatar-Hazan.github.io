import { expect, test } from '@playwright/test';

const routes = [
  {
    path: '/blog/',
    selectors: ['.blog-archive-feature-copy > p:not(.blog-archive-label)'],
  },
  {
    path: '/blog/initial-html-should-contain-the-article/',
    selectors: ['.blog-article-deck > p', '.blog-prose'],
  },
  {
    path: '/contact/',
    selectors: ['.home-contact-page-header'],
  },
  {
    path: '/privacy/',
    selectors: ['.body-copy'],
  },
  {
    path: '/projects/nis_boutique/',
    selectors: ['.case-story-value', '.case-story-lede', '.case-story-context'],
  },
];

const viewports = [
  { id: 'desktop', width: 1440, height: 900 },
  { id: 'mobile', width: 390, height: 844 },
];

for (const language of ['en', 'he']) {
  test(`FIX-030 keeps ${language} body copy within the canonical readable measure`, async ({ page }) => {
    await page.addInitScript((activeLanguage) => {
      localStorage.setItem('i18nextLng', activeLanguage);
      localStorage.setItem('theme', activeLanguage === 'he' ? 'dark' : 'light');
    }, language);

    for (const route of routes) {
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto(`/${language}${route.path}`, { waitUntil: 'domcontentloaded' });
        await page.locator('#main-content').waitFor({ state: 'visible' });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        });

        expect(await page.evaluate(() => (
          getComputedStyle(document.documentElement).getPropertyValue('--measure-body').trim()
        )), `${language}${route.path} canonical measure`).toBe('62ch');

        for (const selector of route.selectors) {
          const elements = page.locator(`${selector}:visible`);
          expect(await elements.count(), `${language}${route.path} ${selector}`).toBeGreaterThan(0);

          for (const measure of await elements.evaluateAll((nodes) => nodes.map((element) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();

            return {
              actualWidth: rect.width,
              maxInlineSize: Number.parseFloat(style.maxInlineSize),
            };
          }))) {
            expect(Number.isFinite(measure.maxInlineSize), `${selector} must expose a finite max-inline-size`).toBe(true);
            expect(measure.actualWidth, `${language}${route.path} ${selector} ${viewport.id}`).toBeLessThanOrEqual(
              measure.maxInlineSize + 0.5,
            );
          }
        }

        expect(await page.evaluate(() => document.documentElement.dir), `${language}${route.path} direction`).toBe(
          language === 'he' ? 'rtl' : 'ltr',
        );
        expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
          `${language}${route.path} ${viewport.id} overflow`).toBe(false);
      }
    }
  });
}
