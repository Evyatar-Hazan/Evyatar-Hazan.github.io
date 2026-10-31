import { expect, test } from '@playwright/test';

const coreRoutes = ['/', '/projects/', '/about/', '/blog/', '/contact/'];
const scenarios = [
  { language: 'en', theme: 'light', width: 1440, height: 900 },
  { language: 'he', theme: 'dark', width: 390, height: 844 },
];

const activeCssMotion = (page) => page.locator('body').evaluate(() => {
  const durationInMilliseconds = (value) => {
    const duration = Number.parseFloat(value);
    return value.trim().endsWith('ms') ? duration : duration * 1000;
  };

  return Array.from(document.querySelectorAll('*')).flatMap((element) => {
    const style = getComputedStyle(element);
    const transitionDurations = style.transitionDuration.split(',').map(durationInMilliseconds);
    const animationDurations = style.animationDuration.split(',').map(durationInMilliseconds);
    const hasTransition = transitionDurations.some((duration) => duration > 0.01);
    const hasAnimation = style.animationName !== 'none'
      && animationDurations.some((duration) => duration > 0.01);

    return hasTransition || hasAnimation
      ? [{
          tag: element.tagName,
          className: typeof element.className === 'string' ? element.className : '',
          animationName: style.animationName,
          animationDuration: style.animationDuration,
          transitionDuration: style.transitionDuration,
        }]
      : [];
  });
});

test.describe('FIX-086 complete reduced motion', () => {
  for (const scenario of scenarios) {
    for (const route of coreRoutes) {
      test(`${scenario.width}px ${scenario.language} ${scenario.theme} ${route} removes non-essential CSS motion`, async ({ page }) => {
        await page.setViewportSize({ width: scenario.width, height: scenario.height });
        await page.emulateMedia({ colorScheme: scenario.theme, reducedMotion: 'reduce' });
        await page.addInitScript(({ language, theme }) => {
          localStorage.setItem('i18nextLng', language);
          localStorage.setItem('theme', theme);
        }, scenario);

        await page.goto(`/${scenario.language}${route}`, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#main-content')).toBeVisible();
        await expect.poll(() => activeCssMotion(page)).toEqual([]);
        await expect(page.locator('html')).toHaveAttribute('lang', scenario.language);
        await expect(page.locator('html')).toHaveAttribute('dir', scenario.language === 'he' ? 'rtl' : 'ltr');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      });
    }
  }

  test('preserves the final hero state without an active browser animation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto('/en/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('.product-compiler-scene')).toBeVisible();
    await expect.poll(() => page.evaluate(() => (
      document.getAnimations().filter((animation) => animation.playState === 'running').length
    ))).toBe(0);
  });
});
