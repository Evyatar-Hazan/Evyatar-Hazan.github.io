import { expect, test } from '@playwright/test';

const widths = [320, 390, 430];
const languages = ['en', 'he'];
const themes = ['light', 'dark'];

const cases = widths.flatMap((width) => languages.flatMap((language) => themes.map((theme) => ({
  name: `${width}px-${language}-${theme}`,
  width,
  language,
  theme,
}))));

const roundedBox = async (locator) => {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return Object.fromEntries(
    Object.entries(box).map(([key, value]) => [key, Math.round(value * 100) / 100]),
  );
};

const controlBoxes = async (themeControl, languageControl) => ({
  theme: await roundedBox(themeControl),
  language: await roundedBox(languageControl),
});

test.describe('FIX-006 stable navbar controls', () => {
  for (const entry of cases) {
    test(`${entry.name} keeps language and theme controls in place`, async ({ page }) => {
      await page.setViewportSize({ width: entry.width, height: 844 });
      await page.emulateMedia({ colorScheme: entry.theme, reducedMotion: 'reduce' });
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem('i18nextLng', language);
        localStorage.setItem('theme', theme);
      }, { language: entry.language, theme: entry.theme });

      await page.goto(`/${entry.language}/`);
      await page.locator('#main-content').waitFor({ state: 'visible' });

      const actions = page.locator('.system-rail-mobile-actions');
      const themeControl = actions.locator('.system-rail-icon');
      const languageControl = actions.locator('.system-rail-mobile-language');
      const menuTrigger = actions.locator('.system-rail-menu-toggle');

      await expect(actions).toBeVisible();
      await expect(themeControl).toHaveCount(1);
      await expect(languageControl).toHaveCount(1);
      await expect(menuTrigger).toHaveCount(1);
      await expect(actions.locator(':scope > button')).toHaveCount(3);

      const initial = await controlBoxes(themeControl, languageControl);

      await themeControl.click();
      await expect(themeControl).toHaveAttribute('aria-pressed', entry.theme === 'dark' ? 'false' : 'true');
      expect(await controlBoxes(themeControl, languageControl)).toEqual(initial);

      await menuTrigger.click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog).toBeInViewport();
      await expect(dialog.locator('.system-rail-mobile-link')).toHaveCount(5);
      await expect(dialog.locator('.system-rail-mobile-secondary a')).toHaveCount(2);
      await expect(dialog.locator('.system-rail-mobile-link.is-active')).toHaveCount(1);
      await expect(dialog.locator('.system-rail-icon, .system-rail-mobile-language')).toHaveCount(0);
      await expect(themeControl).toBeDisabled();
      await expect(languageControl).toBeDisabled();
      await expect(dialog.locator('.system-rail-mobile-close')).toBeFocused();
      expect(await controlBoxes(themeControl, languageControl)).toEqual(initial);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

      const dialogBox = await roundedBox(dialog);
      expect(dialogBox.x).toBeGreaterThanOrEqual(0);
      expect(dialogBox.y).toBeGreaterThanOrEqual(0);
      expect(dialogBox.x + dialogBox.width).toBeLessThanOrEqual(entry.width);
      expect(dialogBox.y + dialogBox.height).toBeLessThanOrEqual(844);

      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(themeControl).toBeEnabled();
      await expect(languageControl).toBeEnabled();
      await expect(menuTrigger).toBeFocused();
      expect(await controlBoxes(themeControl, languageControl)).toEqual(initial);

      await languageControl.click();
      const nextLanguage = entry.language === 'en' ? 'he' : 'en';
      await page.waitForURL(new RegExp(`/${nextLanguage}/`));
      await expect(page.locator('html')).toHaveAttribute('lang', nextLanguage);
      await expect(page.locator('html')).toHaveAttribute('dir', nextLanguage === 'he' ? 'rtl' : 'ltr');
      await expect(page.locator('.system-rail-mobile-actions .system-rail-icon')).toHaveCount(1);
      await expect(page.locator('.system-rail-mobile-actions .system-rail-mobile-language')).toHaveCount(1);
    });
  }
});

test.describe('FIX-011 animated mobile menu stability', () => {
  for (const language of languages) {
    test(`${language} keeps controls anchored throughout the drawer transition`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'no-preference' });
      await page.addInitScript((activeLanguage) => {
        localStorage.setItem('i18nextLng', activeLanguage);
        localStorage.setItem('theme', 'dark');
      }, language);

      await page.goto(`/${language}/`);
      await page.locator('#main-content').waitFor({ state: 'visible' });

      const actions = page.locator('.system-rail-mobile-actions');
      const themeControl = actions.locator('.system-rail-icon');
      const languageControl = actions.locator('.system-rail-mobile-language');
      const menuTrigger = actions.locator('.system-rail-menu-toggle');
      const initial = await controlBoxes(themeControl, languageControl);

      await menuTrigger.click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await page.waitForTimeout(140);
      expect(await controlBoxes(themeControl, languageControl)).toEqual(initial);
      await page.waitForTimeout(180);
      expect(await controlBoxes(themeControl, languageControl)).toEqual(initial);

      await page.keyboard.press('Escape');
      await page.waitForTimeout(140);
      expect(await controlBoxes(themeControl, languageControl)).toEqual(initial);
      await expect(dialog).toBeHidden();
      expect(await controlBoxes(themeControl, languageControl)).toEqual(initial);
    });
  }
});
