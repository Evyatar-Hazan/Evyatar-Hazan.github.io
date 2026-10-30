import { expect, test } from '@playwright/test';

const scenarios = [
  {
    name: 'desktop-en-light', language: 'en', theme: 'light', width: 1440, height: 900,
    open: 'Send a short message', message: 'Message', nameLabel: 'Name', email: 'Email address',
  },
  {
    name: 'mobile-he-dark', language: 'he', theme: 'dark', width: 390, height: 844,
    open: 'שליחת הודעה קצרה', message: 'הודעה', nameLabel: 'שם', email: 'כתובת אימייל',
  },
];

for (const scenario of scenarios) {
  test(`FIX-071 ${scenario.name} keeps the contact form to three required fields`, async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: scenario.height });
    await page.emulateMedia({ colorScheme: scenario.theme });
    await page.goto(`/${scenario.language}/contact/`);
    await page.getByRole('button', { name: scenario.open }).click();

    const form = page.locator('form');
    await expect(form.getByLabel(scenario.message)).toHaveAttribute('required', '');
    await expect(form.getByLabel(scenario.nameLabel)).toHaveAttribute('required', '');
    await expect(form.getByLabel(scenario.email)).toHaveAttribute('required', '');
    await expect(form.locator('[required]')).toHaveCount(3);
    await expect(page.locator('html')).toHaveAttribute('dir', scenario.language === 'he' ? 'rtl' : 'ltr');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(scenario.width);
  });
}
