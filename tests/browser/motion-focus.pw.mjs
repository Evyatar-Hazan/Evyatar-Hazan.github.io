import { expect, test } from '@playwright/test';

const motionSnapshot = (locator) => locator.evaluate((element) => {
  const style = getComputedStyle(element);
  return {
    gap: style.gap,
    transform: style.transform,
  };
});

test.describe('FIX-039 motion focus', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
    await page.addInitScript(() => {
      localStorage.setItem('i18nextLng', 'en');
      localStorage.setItem('theme', 'light');
    });
  });

  test('keeps the home viewport free of a competing global scroll animation', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.locator('[data-motion-focus="single"]')).toHaveCount(1);
    await expect(page.getByTestId('scroll-progress')).toHaveCount(0);

    await page.goto('/en/blog/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.locator('[data-motion-focus="scroll-progress"]')).toHaveCount(1);
    await expect(page.getByTestId('scroll-progress')).toHaveCount(1);
  });

  test('uses the card as the only moving layer for project and writing hover feedback', async ({ page }) => {
    await page.goto('/en/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#main-content')).toBeVisible();

    const projectCard = page.locator('.featured-case-card').first();
    const projectImage = projectCard.locator('.featured-case-card__media img');
    await projectCard.scrollIntoViewIfNeeded();
    await projectCard.hover();
    await expect.poll(() => motionSnapshot(projectCard)).not.toMatchObject({ transform: 'none' });
    await expect.poll(() => motionSnapshot(projectImage)).toMatchObject({ transform: 'none' });

    const writingCard = page.locator('.writing-feature').first();
    const writingLink = writingCard.locator('.writing-read-link');
    await writingCard.scrollIntoViewIfNeeded();
    const linkDefault = await motionSnapshot(writingLink);
    await writingCard.hover();
    await expect.poll(() => motionSnapshot(writingCard)).not.toMatchObject({ transform: 'none' });
    await expect.poll(() => motionSnapshot(writingLink)).toMatchObject({
      gap: linkDefault.gap,
      transform: 'none',
    });
  });
});
