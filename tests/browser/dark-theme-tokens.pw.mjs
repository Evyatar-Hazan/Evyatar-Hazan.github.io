import { expect, test } from '@playwright/test';

const cases = [
  { language: 'en', viewport: { width: 1440, height: 900 } },
  { language: 'he', viewport: { width: 390, height: 844 } },
];

for (const entry of cases) {
  test(`FIX-029 uses the designed dark palette for ${entry.language} at ${entry.viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(entry.viewport);
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    await page.addInitScript(({ language }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('theme', 'dark');
    }, entry);

    await page.goto(`/${entry.language}/`);
    await page.locator('#main-content').waitFor({ state: 'visible' });
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.waitForTimeout(600);

    const palette = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const body = getComputedStyle(document.body);
      return {
        canvas: root.getPropertyValue('--color-surface-canvas').trim(),
        raised: root.getPropertyValue('--color-surface-raised').trim(),
        primary: root.getPropertyValue('--color-content-primary').trim(),
        background: body.backgroundColor,
        color: body.color,
        noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth,
      };
    });

    expect(palette).toEqual({
      canvas: '#0b1220',
      raised: '#172136',
      primary: '#f8fafc',
      background: 'rgb(11, 18, 32)',
      color: 'rgb(248, 250, 252)',
      noHorizontalOverflow: true,
    });
  });
}
