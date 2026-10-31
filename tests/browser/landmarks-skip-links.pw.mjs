import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/projects/',
  '/projects/online_converter/',
  '/about/',
  '/blog/',
  '/blog/tests-need-honest-environments/',
  '/contact/',
  '/privacy/',
  '/lab/',
];
const scenarios = [
  {
    language: 'en',
    primaryNavigation: 'Primary navigation',
    footerNavigation: 'Footer navigation',
    skipLink: 'Skip to content',
    theme: 'light',
    viewport: { width: 1440, height: 900 },
  },
  {
    language: 'he',
    primaryNavigation: 'ניווט ראשי',
    footerNavigation: 'ניווט תחתון',
    skipLink: 'דילוג לתוכן הראשי',
    theme: 'dark',
    viewport: { width: 390, height: 844 },
  },
];

test.describe('FIX-085 consistent landmarks and skip links', () => {
  for (const scenario of scenarios) {
    for (const route of routes) {
      test(`${scenario.language}${route} exposes one complete landmark shell`, async ({ page }) => {
        await page.setViewportSize(scenario.viewport);
        await page.emulateMedia({ colorScheme: scenario.theme, reducedMotion: 'reduce' });
        await page.addInitScript(({ language, theme }) => {
          localStorage.setItem('i18nextLng', language);
          localStorage.setItem('theme', theme);
        }, { language: scenario.language, theme: scenario.theme });

        await page.goto(`/${scenario.language}${route}`, { waitUntil: 'networkidle' });

        const main = page.getByRole('main');
        const skipLink = page.getByRole('link', { name: scenario.skipLink });

        await expect(page.getByRole('banner')).toHaveCount(1);
        await expect(main).toHaveCount(1);
        await expect(main).toHaveAttribute('id', 'main-content');
        await expect(page.getByRole('contentinfo')).toHaveCount(1);
        await expect(page.getByRole('navigation', { name: scenario.primaryNavigation })).toHaveCount(1);
        await expect(page.getByRole('navigation', { name: scenario.footerNavigation })).toHaveCount(1);
        await expect(skipLink).toHaveCount(1);
        await expect(skipLink).toHaveAttribute('href', '#main-content');

        const navigationLabels = await page.locator('nav').evaluateAll((navigations) => (
          navigations.map((navigation) => (
            navigation.getAttribute('aria-label') ?? navigation.getAttribute('aria-labelledby')
          ))
        ));
        expect(navigationLabels.every(Boolean)).toBe(true);
        expect(new Set(navigationLabels).size).toBe(navigationLabels.length);

        await skipLink.focus();
        await expect(skipLink).toBeFocused();
        await expect(skipLink).toBeVisible();
        await page.keyboard.press('Enter');
        await expect(main).toBeFocused();
      });
    }
  }
});
