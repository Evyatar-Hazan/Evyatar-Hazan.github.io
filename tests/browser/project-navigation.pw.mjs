import { expect, test } from '@playwright/test';

const cases = [
  {
    language: 'en',
    previousLabel: 'Previous project',
    nextLabel: 'Next project',
  },
  {
    language: 'he',
    previousLabel: 'הפרויקט הקודם',
    nextLabel: 'הפרויקט הבא',
  },
];

for (const { language, previousLabel, nextLabel } of cases) {
  test(`FIX-048 keeps previous and next case-study navigation working in ${language}`, async ({ page }) => {
    await page.setViewportSize({ width: language === 'he' ? 390 : 1440, height: language === 'he' ? 844 : 900 });
    await page.goto(`/${language}/projects/online_converter/`, { waitUntil: 'domcontentloaded' });

    const navigation = page.locator('#next .case-story-next-grid');
    const previous = navigation.getByRole('heading', { name: previousLabel }).locator('..').getByRole('link');
    const next = navigation.getByRole('heading', { name: nextLabel }).locator('..').getByRole('link');

    await expect(previous).toHaveAttribute('href', `/${language}/projects/nis_boutique/`);
    await expect(next).toHaveAttribute('href', `/${language}/projects/emergency_protocol/`);
    await expect(previous).toBeVisible();
    await expect(next).toBeVisible();

    await previous.focus();
    await expect(previous).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/${language}/projects/nis_boutique/$`));

    await page.goto(`/${language}/projects/online_converter/`, { waitUntil: 'domcontentloaded' });
    const directNext = page.locator('#next .case-story-next-grid')
      .getByRole('heading', { name: nextLabel })
      .locator('..')
      .getByRole('link');
    await directNext.click();
    await expect(page).toHaveURL(new RegExp(`/${language}/projects/emergency_protocol/$`));

    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  });
}
