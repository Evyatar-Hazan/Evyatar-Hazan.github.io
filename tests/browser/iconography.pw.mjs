import { expect, test } from '@playwright/test';

const routes = ['', 'projects/', 'about/', 'blog/', 'contact/'];
const languages = ['en', 'he'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
const allowedSizes = [14, 16, 20, 24];

const visibleIconMetrics = (page) => page.locator('svg.lucide').evaluateAll((icons) => icons
  .filter((icon) => {
    const box = icon.getBoundingClientRect();
    return box.width > 0 && box.height > 0;
  })
  .map((icon) => {
    const box = icon.getBoundingClientRect();
    const style = getComputedStyle(icon);
    return {
      name: icon.classList.item(1) ?? 'lucide',
      width: Math.round(box.width * 100) / 100,
      height: Math.round(box.height * 100) / 100,
      strokeWidth: Number.parseFloat(style.strokeWidth),
    };
  }));

test.describe('FIX-028 canonical iconography', () => {
  for (const viewport of viewports) {
    for (const language of languages) {
      test(`${viewport.name}-${language} keeps core-route icons on the shared scale and stroke`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.emulateMedia({ colorScheme: viewport.name === 'mobile' ? 'dark' : 'light', reducedMotion: 'reduce' });
        await page.addInitScript(({ activeLanguage, theme }) => {
          localStorage.setItem('i18nextLng', activeLanguage);
          localStorage.setItem('theme', theme);
        }, {
          activeLanguage: language,
          theme: viewport.name === 'mobile' ? 'dark' : 'light',
        });

        for (const route of routes) {
          await page.goto(`/${language}/${route}`);
          await page.locator('#main-content').waitFor({ state: 'visible' });
          const icons = await visibleIconMetrics(page);

          expect(icons.length, `expected visible Lucide icons on /${language}/${route}`).toBeGreaterThan(0);
          for (const icon of icons) {
            expect(icon.width, `${icon.name} width on /${language}/${route}`).toBe(icon.height);
            expect(allowedSizes, `${icon.name} size on /${language}/${route}`).toContain(icon.width);
            expect(icon.strokeWidth, `${icon.name} stroke on /${language}/${route}`).toBe(1.75);
          }
        }
      });
    }
  }
});
