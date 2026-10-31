import { mkdir } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import {
  collectUnexpectedConsoleErrors,
  collectUnexpectedFailedRequests,
} from './support/console-errors.mjs';

const scenarios = [
  { id: 'desktop-en-light', language: 'en', theme: 'light', viewport: { width: 1440, height: 900 } },
  { id: 'desktop-he-dark', language: 'he', theme: 'dark', viewport: { width: 1440, height: 900 } },
  { id: 'mobile-en-dark', language: 'en', theme: 'dark', viewport: { width: 390, height: 844 } },
  { id: 'mobile-he-light', language: 'he', theme: 'light', viewport: { width: 390, height: 844 } },
];

const outcomeLabel = {
  en: 'What you’ll take away',
  he: 'מה יישאר לך מהקריאה',
};

test.describe('FIX-064 article-card summaries and outcomes', () => {
  for (const scenario of scenarios) {
    test(`${scenario.id} gives every blog card a visible summary and reader outcome`, async ({ page }) => {
      const consoleErrors = [];
      const failedRequests = [];
      collectUnexpectedConsoleErrors(page, consoleErrors);
      collectUnexpectedFailedRequests(page, failedRequests);

      await page.setViewportSize(scenario.viewport);
      await page.emulateMedia({ colorScheme: scenario.theme, reducedMotion: 'reduce' });
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem('i18nextLng', language);
        localStorage.setItem('theme', theme);
      }, scenario);

      await page.goto(`/${scenario.language}/blog/`, { waitUntil: 'networkidle' });
      await expect(page).toHaveTitle(/Blog|בלוג/);
      await expect(page.locator('html')).toHaveAttribute('lang', scenario.language);
      await expect(page.locator('html')).toHaveAttribute('dir', scenario.language === 'he' ? 'rtl' : 'ltr');
      expect(await page.locator('html').evaluate((node) => node.classList.contains('dark')))
        .toBe(scenario.theme === 'dark');

      const cards = page.locator('.blog-archive-feature, .blog-archive-entry');
      await expect(cards).toHaveCount(13);
      for (const card of await cards.all()) {
        await expect(card.locator('h2 + p')).not.toBeEmpty();
        await expect(card.locator('.blog-card-outcome > span')).toHaveText(outcomeLabel[scenario.language]);
        await expect(card.locator('.blog-card-outcome > p')).not.toBeEmpty();
      }

      expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
      expect(consoleErrors).toEqual([]);
      expect(failedRequests).toEqual([]);

      if (process.env.FIX_064_SCREENSHOTS === '1') {
        await mkdir('output/playwright/fix-064', { recursive: true });
        await page.locator('.blog-archive-feature').screenshot({
          path: `output/playwright/fix-064/${scenario.id}-feature.png`,
        });
        await page.locator('.blog-archive-entry').first().screenshot({
          path: `output/playwright/fix-064/${scenario.id}-entry.png`,
        });
      }
    });
  }

  test('search includes the reader outcome and opens the matched article by keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/en/blog/', { waitUntil: 'networkidle' });

    const search = page.getByRole('searchbox', { name: 'Search all notes' });
    await search.fill('idempotent');
    const result = page.locator('[data-library-results] .blog-archive-entry');
    await expect(result).toHaveCount(1);
    await expect(result.getByRole('heading')).toHaveText('A retry should repeat intent, not duplicate data');
    await expect(result.locator('mark.blog-search-highlight')).toHaveText('idempotent');

    const articleLink = result.getByRole('link', {
      name: 'A retry should repeat intent, not duplicate data',
      exact: true,
    });
    await articleLink.focus();
    await expect(articleLink).toBeFocused();
    await articleLink.press('Enter');
    await expect(page).toHaveURL(/\/en\/blog\/retries-should-not-duplicate-data\/$/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'A retry should repeat intent, not duplicate data',
      { timeout: 15_000 },
    );
  });

  test('homepage cards expose the same reader outcome without moving shell controls', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      localStorage.setItem('i18nextLng', 'he');
      localStorage.setItem('theme', 'dark');
    });
    await page.goto('/he/', { waitUntil: 'networkidle' });

    const controls = page.locator('.system-rail-mobile-actions');
    const before = await controls.boundingBox();
    await page.locator('#writing').scrollIntoViewIfNeeded();
    await expect(page.locator('.writing-article-outcome')).toHaveCount(3);
    await expect(page.locator('.writing-article-outcome > span')).toHaveText([
      outcomeLabel.he,
      outcomeLabel.he,
      outcomeLabel.he,
    ]);
    expect(await controls.boundingBox()).toEqual(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  });
});
