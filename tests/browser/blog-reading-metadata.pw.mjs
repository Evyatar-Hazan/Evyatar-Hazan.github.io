import { expect, test } from '@playwright/test';

const scenarios = [
  { language: 'en', theme: 'light', width: 1440, height: 900, time: '4 min read', label: 'Language: English' },
  { language: 'he', theme: 'light', width: 1440, height: 900, time: '4 דקות קריאה', label: 'שפה: עברית' },
  { language: 'en', theme: 'dark', width: 390, height: 844, time: '4 min read', label: 'Language: English' },
  { language: 'he', theme: 'dark', width: 390, height: 844, time: '4 דקות קריאה', label: 'שפה: עברית' },
];

for (const scenario of scenarios) {
  test(`FIX-065 shows reading time and language in ${scenario.language}-${scenario.theme}-${scenario.width}`, async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: scenario.height });
    await page.emulateMedia({ colorScheme: scenario.theme });
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('theme', theme);
    }, scenario);

    await page.goto(`/${scenario.language}/blog/`, { waitUntil: 'domcontentloaded' });
    const leadMeta = page.locator('.blog-archive-feature .blog-archive-meta');
    await expect(leadMeta).toContainText(scenario.time);
    await expect(leadMeta).toContainText(scenario.label);
    expect(await page.evaluate(() => document.documentElement.dir)).toBe(scenario.language === 'he' ? 'rtl' : 'ltr');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);

    await page.goto(`/${scenario.language}/blog/focus-tests-need-an-unfocused-baseline/`, { waitUntil: 'domcontentloaded' });
    const articleMeta = page.locator('.blog-article-meta');
    await expect(articleMeta).toContainText(scenario.time);
    await expect(articleMeta).toContainText(scenario.label);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);

    await page.goto(`/${scenario.language}/#writing`, { waitUntil: 'domcontentloaded' });
    const homeMeta = page.locator('.writing-article-meta').first();
    await expect(homeMeta).toContainText(scenario.time);
    await expect(homeMeta).toContainText(scenario.label);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  });
}
