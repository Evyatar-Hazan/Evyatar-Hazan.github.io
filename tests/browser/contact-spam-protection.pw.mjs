import { expect, test } from '@playwright/test';

const scenarios = [
  { language: 'en', viewport: { width: 1440, height: 900 }, toggle: 'Build a short project brief (optional)' },
  { language: 'he', viewport: { width: 390, height: 844 }, toggle: 'הכנת תקציר פרויקט קצר (לא חובה)' },
];

for (const scenario of scenarios) {
  test(`FIX-077 keeps spam protection transparent in ${scenario.language}`, async ({ page }) => {
    await page.setViewportSize(scenario.viewport);
    await page.goto(`/${scenario.language}/contact/`);
    await page.getByRole('button', { name: scenario.toggle }).click();

    const honeypot = page.locator('input[name="_honey"]');
    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toBeHidden();
    await expect(honeypot).toHaveAttribute('tabindex', '-1');
    await expect(page.locator('iframe[src*="recaptcha"], script[src*="recaptcha"]')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText('I am not a robot');

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      await page.evaluate(() => document.documentElement.clientWidth),
    );
  });
}
