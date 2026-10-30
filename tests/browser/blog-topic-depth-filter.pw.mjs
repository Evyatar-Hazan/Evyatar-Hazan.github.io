import { expect, test } from '@playwright/test';

const cases = [
  {
    name: 'desktop-en-light', language: 'en', theme: 'light', width: 1440, height: 900,
    topicLabel: 'Filter by topic', depthLabel: 'Filter by depth', appliedLabel: 'Applied',
    matchingTitle: 'One bad date should not blank an entire screen', resetLabel: 'Reset library',
  },
  {
    name: 'desktop-he-dark', language: 'he', theme: 'dark', width: 1440, height: 900,
    topicLabel: 'סינון לפי נושא', depthLabel: 'סינון לפי רמת עומק', appliedLabel: 'יישומי',
    matchingTitle: 'שדה תאריך שבור לא צריך להפיל מסך שלם', resetLabel: 'איפוס הספרייה',
  },
  {
    name: 'mobile-en-dark', language: 'en', theme: 'dark', width: 390, height: 844,
    topicLabel: 'Filter by topic', depthLabel: 'Filter by depth', appliedLabel: 'Applied',
    matchingTitle: 'One bad date should not blank an entire screen', resetLabel: 'Reset library',
  },
  {
    name: 'mobile-he-light', language: 'he', theme: 'light', width: 390, height: 844,
    topicLabel: 'סינון לפי נושא', depthLabel: 'סינון לפי רמת עומק', appliedLabel: 'יישומי',
    matchingTitle: 'שדה תאריך שבור לא צריך להפיל מסך שלם', resetLabel: 'איפוס הספרייה',
  },
];

for (const entry of cases) {
  test(`FIX-062 ${entry.name} filters the blog by topic and depth`, async ({ page }) => {
    const consoleErrors = [];
    const failedRequests = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('requestfailed', (request) => failedRequests.push(request.url()));

    await page.setViewportSize({ width: entry.width, height: entry.height });
    await page.emulateMedia({ colorScheme: entry.theme, reducedMotion: 'reduce' });
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('theme', theme);
    }, entry);
    await page.goto(`/${entry.language}/blog/?ref=fix-062`);

    await expect(page.locator('html')).toHaveAttribute('lang', entry.language);
    await expect(page.locator('html')).toHaveAttribute('dir', entry.language === 'he' ? 'rtl' : 'ltr');
    const railBefore = await page.locator('.system-rail').boundingBox();

    const topicGroup = page.getByRole('group', { name: entry.topicLabel });
    const depthGroup = page.getByRole('group', { name: entry.depthLabel });
    await expect(topicGroup.getByRole('button')).toHaveCount(9);
    await expect(depthGroup.getByRole('button')).toHaveCount(4);

    const reliability = topicGroup.getByRole('button', { name: 'Reliability' });
    await reliability.focus();
    await expect(reliability).toBeFocused();
    await reliability.press('Enter');
    await expect(reliability).toHaveAttribute('aria-pressed', 'true');

    const applied = depthGroup.getByRole('button', { name: entry.appliedLabel });
    await applied.focus();
    await expect(applied).toBeFocused();
    await applied.press('Enter');
    await expect(applied).toHaveAttribute('aria-pressed', 'true');

    await expect(page).toHaveURL(/topic=Reliability/);
    await expect(page).toHaveURL(/depth=applied/);
    await expect(page.locator('[data-library-results] [data-blog-depth="applied"]')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: entry.matchingTitle })).toBeVisible();
    await expect(page.locator('[aria-live="polite"]')).toHaveAttribute('data-result-count', '1');

    await page.getByRole('button', { name: entry.resetLabel }).click();
    await expect(page).toHaveURL(new RegExp(`/${entry.language}/blog/\\?ref=fix-062$`));
    await expect(page.locator('.blog-archive-feature')).toBeVisible();

    expect(await page.locator('.system-rail').boundingBox()).toEqual(railBefore);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(entry.width);
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });
}
