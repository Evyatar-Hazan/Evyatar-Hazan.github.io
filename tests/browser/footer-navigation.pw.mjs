import { expect, test } from '@playwright/test';

const scenarios = [
  {
    language: 'en',
    theme: 'dark',
    route: '/en/blog/',
    menuLabel: 'Open navigation menu',
    footerLabel: 'Footer navigation',
    activeLabel: 'Blog',
  },
  {
    language: 'he',
    theme: 'light',
    route: '/he/blog/',
    menuLabel: 'פתיחת תפריט ניווט',
    footerLabel: 'ניווט תחתון',
    activeLabel: 'בלוג',
  },
];

const roundedBox = async (locator) => {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return Object.fromEntries(Object.entries(box).map(([key, value]) => [key, Math.round(value)]));
};

for (const scenario of scenarios) {
  test(`FIX-020 keeps the ${scenario.language} mobile footer aligned with the menu`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: scenario.theme, reducedMotion: 'reduce' });
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('theme', theme);
    }, { language: scenario.language, theme: scenario.theme });

    await page.goto(scenario.route);
    await page.locator('#main-content').waitFor({ state: 'visible' });

    const actions = page.locator('.system-rail-mobile-actions');
    const initialActions = await roundedBox(actions);
    const menuButton = page.getByRole('button', { name: scenario.menuLabel });
    await menuButton.click();

    const dialog = page.getByRole('dialog');
    const menuLinks = dialog.getByRole('link');
    const menuDestinations = await menuLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(await roundedBox(actions)).toEqual(initialActions);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    expect(await roundedBox(actions)).toEqual(initialActions);

    const footerNavigation = page.getByRole('navigation', { name: scenario.footerLabel });
    await footerNavigation.scrollIntoViewIfNeeded();
    const footerLinks = footerNavigation.getByRole('link');
    const footerDestinations = await footerLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')));

    expect(footerDestinations).toEqual(menuDestinations);
    expect(new Set(footerDestinations).size).toBe(footerDestinations.length);
    await expect(footerLinks).toHaveCount(7);
    await expect(footerNavigation.getByRole('link', { name: scenario.activeLabel }))
      .toHaveAttribute('aria-current', 'page');

    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasOverflow).toBe(false);
  });
}
