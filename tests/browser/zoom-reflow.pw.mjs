import { expect, test } from '@playwright/test';

const routes = ['', 'projects/', 'about/', 'blog/', 'contact/'];
const scenarios = [
  { id: 'desktop-200', viewport: { width: 720, height: 450 } },
  { id: 'mobile-200', viewport: { width: 195, height: 422 } },
];

for (const language of ['en', 'he']) {
  for (const theme of ['light', 'dark']) {
    for (const scenario of scenarios) {
      test.describe(`${scenario.id}-${language}-${theme}`, () => {
        test.use({ viewport: scenario.viewport });

        for (const route of routes) {
          test(`${route || 'home'} reflows without clipped actions`, async ({ page }) => {
            await page.addInitScript(({ activeLanguage, activeTheme }) => {
              localStorage.setItem('i18nextLng', activeLanguage);
              localStorage.setItem('theme', activeTheme);
            }, { activeLanguage: language, activeTheme: theme });

            await page.goto(`/${language}/${route}`, { waitUntil: 'domcontentloaded' });

            const layout = await page.evaluate(() => ({
              clientWidth: document.documentElement.clientWidth,
              scrollWidth: document.documentElement.scrollWidth,
              interactiveOverflow: [...document.querySelectorAll('a, button, input, textarea, select')]
                .filter((element) => {
                  const rect = element.getBoundingClientRect();
                  const style = getComputedStyle(element);
                  return rect.width > 0
                    && rect.height > 0
                    && style.display !== 'none'
                    && style.visibility !== 'hidden';
                })
                .map((element) => {
                  const rect = element.getBoundingClientRect();
                  const insideHorizontalScroller = [...function* ancestors() {
                    let parent = element.parentElement;
                    while (parent && parent !== document.body) {
                      yield parent;
                      parent = parent.parentElement;
                    }
                  }()].some((parent) => {
                    const style = getComputedStyle(parent);
                    return ['auto', 'scroll'].includes(style.overflowX)
                      && parent.scrollWidth > parent.clientWidth + 1;
                  });
                  return {
                    label: element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 60),
                    left: rect.left,
                    right: rect.right,
                    insideHorizontalScroller,
                  };
                })
                .filter(({ left, right }) => (
                  left < -1 || right > document.documentElement.clientWidth + 1
                ))
                .filter(({ insideHorizontalScroller }) => !insideHorizontalScroller),
            }));

            expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
            expect(layout.interactiveOverflow).toEqual([]);

            if (route === 'blog/') {
              const filterGroups = await page.locator('.blog-library-filter-group').evaluateAll((groups) => (
                groups.map((group) => {
                  const rect = group.getBoundingClientRect();
                  return { left: rect.left, right: rect.right };
                })
              ));
              expect(filterGroups.every(({ left, right }) => left >= -1 && right <= layout.clientWidth + 1)).toBe(true);

              for (const filters of await page.locator('.blog-library-filters').all()) {
                const lastFilter = filters.locator('button').last();
                await lastFilter.focus();
                await expect(lastFilter).toBeInViewport();
              }
            }

            if (!route && scenario.id === 'mobile-200') {
              const proofTitles = await page.getByTestId('hero-proof-strip').locator('dt').evaluateAll((titles) => (
                titles.map((title) => ({ clientWidth: title.clientWidth, scrollWidth: title.scrollWidth }))
              ));
              expect(proofTitles.every(({ clientWidth, scrollWidth }) => scrollWidth <= clientWidth + 1)).toBe(true);
            }
          });
        }

        if (scenario.id === 'mobile-200') {
          test('keeps language and theme controls fixed when the menu opens', async ({ page }) => {
            await page.addInitScript(({ activeLanguage, activeTheme }) => {
              localStorage.setItem('i18nextLng', activeLanguage);
              localStorage.setItem('theme', activeTheme);
            }, { activeLanguage: language, activeTheme: theme });
            await page.goto(`/${language}/`, { waitUntil: 'domcontentloaded' });

            const languageControl = page.locator('.system-rail-mobile-language');
            const themeControl = page.locator('.system-rail-mobile-actions .system-rail-icon');
            const menuControl = page.locator('.system-rail-menu-toggle');
            const before = await Promise.all([
              languageControl.evaluate((element) => element.getBoundingClientRect().toJSON()),
              themeControl.evaluate((element) => element.getBoundingClientRect().toJSON()),
            ]);

            await menuControl.click();
            await expect(page.getByRole('dialog')).toBeVisible();

            const after = await Promise.all([
              languageControl.evaluate((element) => element.getBoundingClientRect().toJSON()),
              themeControl.evaluate((element) => element.getBoundingClientRect().toJSON()),
            ]);
            expect(after).toEqual(before);
          });
        }
      });
    }
  }
}
