import { expect, test } from '@playwright/test';

const routes = ['/', '/projects/', '/about/', '/blog/', '/contact/'];
const languages = ['en', 'he'];
const minimumTargetSize = 44;

const inspectTouchTargets = () => [...document.querySelectorAll([
  'a[href]:not(.skip-link)',
  'button:not([disabled])',
  'input:not([type="hidden"]):not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[role="button"]:not([disabled])',
  '[role="link"]',
].join(','))]
  .map((element) => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);

    return {
      box,
      element,
      visible: style.display !== 'none'
        && style.visibility !== 'hidden'
        && box.width > 0
        && box.height > 0,
    };
  })
  .filter(({ visible }) => visible)
  .map(({ box, element }) => ({
    className: typeof element.className === 'string'
      ? element.className.trim().replace(/\s+/gu, ' ').slice(0, 120)
      : '',
    height: Math.round(box.height * 100) / 100,
    label: (element.getAttribute('aria-label') || element.textContent || '')
      .trim()
      .replace(/\s+/gu, ' ')
      .slice(0, 100),
    tag: element.tagName.toLowerCase(),
    width: Math.round(box.width * 100) / 100,
  }))
  .filter(({ height, width }) => height < 44 || width < 44);

test.describe('FIX-016 minimum touch targets', () => {
  test.describe.configure({ mode: 'serial' });

  for (const language of languages) {
    for (const route of routes) {
      test(`${language}${route} keeps standalone controls at least 44px`, async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.emulateMedia({ colorScheme: language === 'he' ? 'dark' : 'light', reducedMotion: 'reduce' });
        await page.addInitScript(({ activeLanguage, theme }) => {
          localStorage.setItem('i18nextLng', activeLanguage);
          localStorage.setItem('theme', theme);
        }, { activeLanguage: language, theme: language === 'he' ? 'dark' : 'light' });

        await page.goto(`/${language}${route}`);
        await page.locator('#main-content').waitFor({ state: 'visible' });

        const failures = await page.evaluate(inspectTouchTargets);
        expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
      });
    }
  }

  for (const language of languages) {
    test(`${language} landscape menu keeps every destination at least 44px`, async ({ page }) => {
      await page.setViewportSize({ width: 667, height: 375 });
      await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
      await page.addInitScript((activeLanguage) => {
        localStorage.setItem('i18nextLng', activeLanguage);
        localStorage.setItem('theme', 'dark');
      }, language);

      await page.goto(`/${language}/`);
      await page.locator('.system-rail-menu-toggle').click();

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      for (const target of await dialog.locator('a[href], button:not([disabled])').all()) {
        const box = await target.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width).toBeGreaterThanOrEqual(minimumTargetSize);
        expect(box.height).toBeGreaterThanOrEqual(minimumTargetSize);
      }
    });
  }
});
