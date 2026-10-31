import { expect, test } from '@playwright/test';

const routesWithImages = [
  '/en/',
  '/he/',
  '/en/projects/nis_boutique/',
  '/he/projects/online_converter/',
  '/en/projects/emergency_protocol/',
  '/he/projects/united_hatzalah/',
];

for (const route of routesWithImages) {
  test(`FIX-084 classifies every rendered image on ${route}`, async ({ page }) => {
    await page.goto(route);

    const images = page.locator('img');
    await expect(images.first()).toBeAttached();
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      const image = images.nth(index);
      const alt = await image.getAttribute('alt');

      expect(alt, `image ${index + 1} on ${route} must declare alt`).not.toBeNull();
      if (alt === '') {
        const isDecorative = await image.evaluate((element) => (
          element.getAttribute('aria-hidden') === 'true'
          || element.getAttribute('role') === 'presentation'
          || element.getAttribute('role') === 'none'
        ));
        expect(isDecorative, `empty alt on ${route} must be explicitly decorative`).toBe(true);
      } else {
        expect(alt.trim().length, `informative alt on ${route} must describe useful content`).toBeGreaterThan(20);
        expect(alt).not.toMatch(/previewTitle|live preview|תצוגה חיה|^image$|^photo$/iu);
      }
    }
  });
}
