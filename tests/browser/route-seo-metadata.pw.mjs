import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const routeSeo = JSON.parse(await readFile(
  new URL('../../src/data/routeSeo.json', import.meta.url),
  'utf8',
));

for (const language of ['en', 'he']) {
  for (const [routeId, entry] of Object.entries(routeSeo)) {
    test(`FIX-095 publishes canonical ${routeId} metadata in ${language}`, async ({ page }) => {
      const path = `/${language}${entry.path}`;
      const expected = entry[language];
      const expectedUrl = `https://evyatarhazan.com${path}`;

      await page.setViewportSize(language === 'he'
        ? { width: 390, height: 844 }
        : { width: 1440, height: 900 });
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();

      await expect(page).toHaveTitle(expected.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', expected.description);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expectedUrl);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', expected.title);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', expected.description);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', expectedUrl);
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
        'content',
        language === 'he' ? 'he_IL' : 'en_US',
      );
    });
  }
}

for (const path of ['/en/blog/catering-whatsapp/', '/he/projects/online_converter/']) {
  test(`FIX-095 aligns dynamic metadata for ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();

    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

    expect(title).toBeTruthy();
    expect(description).toBeTruthy();
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
  });
}
