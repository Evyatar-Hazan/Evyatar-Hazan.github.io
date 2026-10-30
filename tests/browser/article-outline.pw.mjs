import { expect, test } from '@playwright/test';

const viewports = [
  { id: 'desktop', width: 1440, height: 900 },
  { id: 'mobile', width: 390, height: 844 },
];

for (const language of ['en', 'he']) {
  for (const viewport of viewports) {
    test(`FIX-066 keeps the ${language} article outline synchronized on ${viewport.id}`, async ({ page }) => {
      const runtimeErrors = [];
      page.on('console', (message) => {
        if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
      });
      page.on('pageerror', (error) => runtimeErrors.push(`page: ${error.message}`));
      page.on('requestfailed', (request) => runtimeErrors.push(`network: ${request.url()} ${request.failure()?.errorText ?? ''}`));

      await page.setViewportSize(viewport);
      await page.addInitScript(({ activeLanguage, theme }) => {
        localStorage.setItem('i18nextLng', activeLanguage);
        localStorage.setItem('theme', theme);
      }, { activeLanguage: language, theme: language === 'he' ? 'dark' : 'light' });

      await page.goto(`/${language}/blog/retries-should-not-duplicate-data/`, { waitUntil: 'domcontentloaded' });
      await page.locator('#main-content').waitFor({ state: 'visible' });

      const proseHeadings = page.locator('.blog-prose > h2, .blog-prose > h3');
      await expect(proseHeadings).toHaveCount(8);

      const outline = viewport.id === 'desktop'
        ? page.locator('.blog-reading-rail nav')
        : page.locator('.blog-mobile-outline');
      await expect(outline).toBeVisible();

      if (viewport.id === 'mobile') {
        const controlsBefore = await page.locator('.system-rail-mobile-actions button').evaluateAll((buttons) => (
          buttons.map((button) => button.getBoundingClientRect().toJSON())
        ));
        await outline.locator('summary').focus();
        await expect(outline.locator('summary')).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(outline).toHaveAttribute('open', '');
        const controlsAfter = await page.locator('.system-rail-mobile-actions button').evaluateAll((buttons) => (
          buttons.map((button) => button.getBoundingClientRect().toJSON())
        ));
        expect(controlsAfter).toEqual(controlsBefore);
      }

      const outlineLinks = outline.locator('a');
      await expect(outlineLinks).toHaveCount(8);
      expect(await outlineLinks.allTextContents()).toEqual(await proseHeadings.allTextContents());
      expect(await outlineLinks.evaluateAll((links) => links.map((link) => decodeURIComponent(link.hash)))).toEqual(
        await proseHeadings.evaluateAll((headings) => headings.map((heading) => `#${heading.id}`)),
      );

      await outlineLinks.first().focus();
      await expect(outlineLinks.first()).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/#.+/u);
      await expect(proseHeadings.first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
      expect(runtimeErrors).toEqual([]);
    });
  }

  test(`FIX-066 omits the ${language} outline below the six-section threshold`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript((activeLanguage) => {
      localStorage.setItem('i18nextLng', activeLanguage);
      localStorage.setItem('theme', 'light');
    }, language);

    await page.goto(`/${language}/blog/catering-whatsapp/`, { waitUntil: 'domcontentloaded' });
    await page.locator('#main-content').waitFor({ state: 'visible' });
    await expect(page.locator('.blog-prose > h2, .blog-prose > h3')).toHaveCount(4);
    await expect(page.locator('.blog-reading-rail nav')).toHaveCount(0);
    await expect(page.locator('.blog-mobile-outline')).toHaveCount(0);
  });
}
