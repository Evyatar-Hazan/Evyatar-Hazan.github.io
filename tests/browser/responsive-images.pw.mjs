import { expect, test } from '@playwright/test';

const scenarios = [
  { route: '/en/', viewport: { width: 1440, height: 900 }, selector: '#projects img' },
  { route: '/he/', viewport: { width: 390, height: 844 }, selector: '#projects img' },
  { route: '/en/projects/nis_boutique/', viewport: { width: 1440, height: 900 }, selector: '.product-visual-gallery img' },
  { route: '/he/projects/online_converter/', viewport: { width: 390, height: 844 }, selector: '.product-visual-gallery img' },
];

for (const scenario of scenarios) {
  test(`FIX-092 serves responsive image candidates on ${scenario.route} at ${scenario.viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(scenario.viewport);
    await page.goto(scenario.route, { waitUntil: 'networkidle' });

    const images = page.locator(scenario.selector);
    await expect(images.first()).toBeAttached();

    for (let index = 0; index < await images.count(); index += 1) {
      const image = images.nth(index);
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveAttribute('srcset', /\d+w/);
      await expect(image).toHaveAttribute('sizes', /vw|px/);

      const candidateWidths = (await image.getAttribute('srcset'))
        .split(', ')
        .map((candidate) => Number(candidate.match(/(\d+)w$/)?.[1]));
      const intrinsicWidth = Number(await image.getAttribute('width'));
      expect(Math.max(...candidateWidths)).toBeLessThanOrEqual(intrinsicWidth);

      const picture = image.locator('xpath=..');
      await expect(picture).toHaveJSProperty('tagName', 'PICTURE');
      await expect(picture.locator('source[type="image/avif"]')).toHaveAttribute('srcset', /\.avif \d+w/);
      await expect(picture.locator('source[type="image/webp"]')).toHaveAttribute('srcset', /\.webp \d+w/);

      const currentSrc = await image.evaluate((element) => element.currentSrc);
      expect(currentSrc).toContain('/responsive/');
      const response = await page.request.get(currentSrc);
      expect(response.status()).toBe(200);
    }
  });
}
