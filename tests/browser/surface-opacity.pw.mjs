import { expect, test } from '@playwright/test';

const scenarios = [
  {
    id: 'en-light-blog-desktop',
    route: '/en/blog/',
    language: 'en',
    theme: 'light',
    viewport: { width: 1440, height: 900 },
    selectors: ['.system-rail', '.blog-archive-feature', '.blog-archive-entry'],
  },
  {
    id: 'he-dark-projects-mobile',
    route: '/he/',
    language: 'he',
    theme: 'dark',
    viewport: { width: 390, height: 844 },
    selectors: ['.system-rail', '.featured-case-card__media > span'],
  },
  {
    id: 'en-dark-case-study',
    route: '/en/projects/nis_boutique/',
    language: 'en',
    theme: 'dark',
    viewport: { width: 1440, height: 900 },
    selectors: ['.case-story-hero-facts > div', '.case-story-hero-meta'],
  },
];

const readSurface = (element) => {
  const style = getComputedStyle(element);
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = style.backgroundColor;
  context.fillRect(0, 0, 1, 1);

  return {
    alpha: context.getImageData(0, 0, 1, 1).data[3],
    backdropFilter: style.backdropFilter,
    backgroundColor: style.backgroundColor,
    webkitBackdropFilter: style.webkitBackdropFilter,
  };
};

test.describe('FIX-026 opaque surface contract', () => {
  for (const scenario of scenarios) {
    test(`${scenario.id} keeps principal surfaces opaque and blur-free`, async ({ page }) => {
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem('i18nextLng', language);
        localStorage.setItem('theme', theme);
      }, scenario);
      await page.setViewportSize(scenario.viewport);
      await page.goto(scenario.route, { waitUntil: 'domcontentloaded' });

      for (const selector of scenario.selectors) {
        const surface = page.locator(selector).first();
        await expect(surface, `${selector} should exist`).toBeAttached();
        const result = await surface.evaluate(readSurface);
        expect(result.alpha, `${selector} background ${result.backgroundColor}`).toBe(255);
        expect(result.backdropFilter, selector).toBe('none');
        expect(result.webkitBackdropFilter || 'none', selector).toBe('none');
      }

      expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
        `${scenario.id} should not overflow`).toBe(false);
    });
  }
});
