import { expect, test } from '@playwright/test';
import {
  collectUnexpectedConsoleErrors,
  collectUnexpectedFailedRequests,
} from './support/console-errors.mjs';

const cases = [
  { name: 'desktop-en-light', language: 'en', theme: 'light', width: 1440, height: 900, label: 'Capability type', reset: 'Reset filters' },
  { name: 'desktop-he-dark', language: 'he', theme: 'dark', width: 1440, height: 900, label: 'סוג יכולת', reset: 'איפוס מסננים' },
  { name: 'mobile-en-dark', language: 'en', theme: 'dark', width: 390, height: 844, label: 'Capability type', reset: 'Reset filters' },
  { name: 'mobile-he-light', language: 'he', theme: 'light', width: 390, height: 844, label: 'סוג יכולת', reset: 'איפוס מסננים' },
];

for (const entry of cases) {
  test(`FIX-041 ${entry.name} filters projects by canonical capability and preserves URL state`, async ({ page }) => {
    const consoleErrors = [];
    const failedRequests = [];
    collectUnexpectedConsoleErrors(page, consoleErrors);
    collectUnexpectedFailedRequests(page, failedRequests);

    await page.setViewportSize({ width: entry.width, height: entry.height });
    await page.emulateMedia({ colorScheme: entry.theme, reducedMotion: 'reduce' });
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('theme', theme);
    }, entry);
    await page.goto(`/${entry.language}/projects/?ref=fix-041`);

    await expect(page.locator('html')).toHaveAttribute('lang', entry.language);
    await expect(page.locator('html')).toHaveAttribute('dir', entry.language === 'he' ? 'rtl' : 'ltr');
    const systemRailBefore = await page.locator('.system-rail').boundingBox();
    const capabilityFilter = page.getByLabel(entry.label);
    await capabilityFilter.focus();
    await expect(capabilityFilter).toBeFocused();
    await expect(capabilityFilter.locator('option')).toHaveCount(6);
    await expect(capabilityFilter.locator('option[value="React"]')).toHaveCount(0);

    await capabilityFilter.selectOption('languages');
    await expect(page.locator('[data-project-id]')).toHaveCount(5);
    await expect(page).toHaveURL(new RegExp(`capability=languages.*ref=fix-041|ref=fix-041.*capability=languages`));

    await capabilityFilter.selectOption('databases');
    await expect(page.locator('[data-project-id]')).toHaveCount(1);
    await page.goBack();
    await expect(capabilityFilter).toHaveValue('languages');
    await expect(page.locator('[data-project-id]')).toHaveCount(5);

    await page.getByLabel(entry.language === 'he' ? 'קטגוריה' : 'Category').selectOption('fullstack');
    await capabilityFilter.selectOption('databases');
    await expect(page.locator('.projects-hub-empty')).toBeVisible();
    await page.getByRole('button', { name: entry.reset }).click();
    await expect(page.locator('[data-project-id]')).toHaveCount(7);
    await expect(page).toHaveURL(new RegExp(`/${entry.language}/projects/\\?ref=fix-041$`));

    expect(await page.locator('.system-rail').boundingBox()).toEqual(systemRailBefore);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(entry.width);
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });
}
