import { expect, test } from '@playwright/test';

const scenarios = [
  { language: 'en', theme: 'light', width: 1440, height: 900, copy: 'Copy code', copied: 'Copied' },
  { language: 'en', theme: 'dark', width: 390, height: 844, copy: 'Copy code', copied: 'Copied' },
  { language: 'he', theme: 'light', width: 1440, height: 900, copy: 'העתקת קוד', copied: 'הועתק' },
  { language: 'he', theme: 'dark', width: 390, height: 844, copy: 'העתקת קוד', copied: 'הועתק' },
];

for (const scenario of scenarios) {
  test(`FIX-067 ${scenario.language}-${scenario.theme}-${scenario.width} keeps code readable, scrollable, and copyable`, async ({ context, page }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.setViewportSize({ width: scenario.width, height: scenario.height });
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('theme', theme);
    }, scenario);

    await page.goto(`/${scenario.language}/blog/java-program-execution/`);

    const controlsBefore = await page.locator('.system-rail').boundingBox();
    const block = page.locator('.blog-code-block').first();
    const code = block.locator('code');
    const copyButton = block.getByRole('button', { name: scenario.copy });

    await expect(block).toBeVisible();
    await expect(code).not.toHaveText('');
    await expect(copyButton).toBeVisible();
    await expect(block.locator('pre')).toHaveAttribute('tabindex', '0');
    await expect(block.locator('pre')).toHaveAttribute('dir', 'auto');
    const copyTarget = await copyButton.boundingBox();
    expect(copyTarget.height).toBeGreaterThanOrEqual(44);
    expect(copyTarget.width).toBeGreaterThanOrEqual(44);

    const expectedCode = (await code.textContent()).replace(/\n$/, '');
    await copyButton.focus();
    await copyButton.press('Enter');
    await expect(block.getByRole('button', { name: scenario.copied })).toBeVisible();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(expectedCode);

    const scrollable = await page.locator('.blog-code-block pre').evaluateAll((elements) => (
      elements.some((element) => element.scrollWidth > element.clientWidth)
    ));
    expect(scrollable).toBe(scenario.width === 390);

    const metrics = await block.locator('pre').evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        overflowX: styles.overflowX,
        background: styles.backgroundColor,
        color: styles.color,
        pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(metrics.overflowX).toBe('auto');
    expect(metrics.background).not.toBe(metrics.color);
    expect(metrics.pageOverflow).toBe(0);
    expect(await page.locator('.system-rail').boundingBox()).toEqual(controlsBefore);
  });
}
