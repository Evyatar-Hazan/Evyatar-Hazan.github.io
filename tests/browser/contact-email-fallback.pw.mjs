import { expect, test } from '@playwright/test';

const cases = [
  { language: 'en', theme: 'light', width: 1440, height: 900 },
  { language: 'he', theme: 'dark', width: 1440, height: 900 },
  { language: 'en', theme: 'dark', width: 390, height: 844 },
  { language: 'he', theme: 'light', width: 390, height: 844 },
];

for (const entry of cases) {
  test(`FIX-073 keeps the email fallback visible in ${entry.language}-${entry.theme}-${entry.width}`, async ({ page }) => {
    await page.setViewportSize({ width: entry.width, height: entry.height });
    await page.addInitScript(({ language, theme }) => {
      window.localStorage.setItem('i18nextLng', language);
      window.localStorage.setItem('theme', theme);
    }, entry);
    await page.route('https://formsubmit.co/**', (route) => route.abort('failed'));
    await page.goto(`/${entry.language}/contact/`);

    await page.getByRole('button', {
      name: entry.language === 'he'
        ? 'שליחת הודעה קצרה'
        : 'Send a short message',
    }).click();

    const fallback = page.locator('[data-email-fallback]');
    await expect(fallback).toBeVisible();
    await expect(fallback).toHaveText('evyatarhazan3.14@gmail.com');
    await expect(fallback).toHaveAttribute('href', /^mailto:evyatarhazan3\.14@gmail\.com/);

    await page.getByLabel(entry.language === 'he' ? 'הודעה' : 'Message').fill('Synthetic fallback check');
    await page.getByLabel(entry.language === 'he' ? 'שם' : 'Name').fill('Synthetic Visitor');
    await page.getByLabel(entry.language === 'he' ? 'כתובת אימייל' : 'Email address').fill('visitor@example.test');
    await page.getByRole('button', {
      name: entry.language === 'he' ? 'שליחה באמצעות FormSubmit' : 'Send with FormSubmit',
    }).click();

    await expect(page.locator('.contact-delivery-status.is-error')).toBeVisible();
    await expect(fallback).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
}
