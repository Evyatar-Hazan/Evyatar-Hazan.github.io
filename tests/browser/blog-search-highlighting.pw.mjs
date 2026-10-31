import { expect, test } from '@playwright/test';
import {
  collectUnexpectedConsoleErrors,
  collectUnexpectedFailedRequests,
} from './support/console-errors.mjs';

const cases = [
  {
    name: 'desktop-en-light',
    language: 'en',
    theme: 'light',
    viewport: { width: 1440, height: 900 },
    searchLabel: 'Search all notes',
    query: 'unfocused baseline',
    highlight: 'unfocused baseline',
  },
  {
    name: 'mobile-he-dark',
    language: 'he',
    theme: 'dark',
    viewport: { width: 390, height: 844 },
    searchLabel: 'חיפוש בכל הרשומות',
    query: 'רינדור',
    highlight: 'רינדור',
  },
];

for (const entry of cases) {
  test(`FIX-063 ${entry.name} searches and highlights matching blog text`, async ({ page }) => {
    const consoleErrors = [];
    const failedRequests = [];
    collectUnexpectedConsoleErrors(page, consoleErrors);
    collectUnexpectedFailedRequests(page, failedRequests);

    await page.setViewportSize(entry.viewport);
    await page.emulateMedia({ colorScheme: entry.theme, reducedMotion: 'reduce' });
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('theme', theme);
    }, entry);
    await page.goto(`/${entry.language}/blog/?ref=fix-063`);

    await expect(page.locator('html')).toHaveAttribute('lang', entry.language);
    await expect(page.locator('html')).toHaveAttribute('dir', entry.language === 'he' ? 'rtl' : 'ltr');
    await expect(page.locator('html')).toHaveClass(entry.theme === 'dark' ? /dark/ : /^(?!.*dark)/);

    const systemRailBefore = await page.locator('.system-rail').boundingBox();
    const mobileActionsBefore = await page.locator('.system-rail-mobile-actions').boundingBox();
    const search = page.getByRole('searchbox', { name: entry.searchLabel });
    await search.focus();
    await expect(search).toBeFocused();
    await search.pressSequentially(entry.query, { delay: 35 });
    await expect(search).toHaveValue(entry.query);
    await expect(search).toBeFocused();

    await expect(page).toHaveURL(new RegExp(`q=${encodeURIComponent(entry.query).replaceAll('%20', '(?:\\+|%20)')}`));
    await expect(page.locator('[data-library-results] .blog-archive-entry')).toHaveCount(1);
    await expect(page.locator('mark.blog-search-highlight').filter({ hasText: entry.highlight }).first()).toBeVisible();
    await expect(page.locator('[aria-live="polite"]')).toHaveAttribute('data-result-count', '1');
    await expect(page.locator('.blog-archive-feature')).toHaveCount(0);

    expect(await page.locator('.system-rail').boundingBox()).toEqual(systemRailBefore);
    expect(await page.locator('.system-rail-mobile-actions').boundingBox()).toEqual(mobileActionsBefore);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });
}
