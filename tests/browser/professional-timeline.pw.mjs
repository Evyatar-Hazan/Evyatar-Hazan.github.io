import { expect, test } from '@playwright/test';

const cases = [
  { language: 'en', width: 1440, heading: 'Each stage expanded the system I could own.' },
  { language: 'he', width: 1440, heading: 'כל שלב הרחיב את המערכת שיכולתי לקחת עליה אחריות.' },
  { language: 'en', width: 390, heading: 'Each stage expanded the system I could own.' },
  { language: 'he', width: 390, heading: 'כל שלב הרחיב את המערכת שיכולתי לקחת עליה אחריות.' },
];

for (const scenario of cases) {
  test(`FIX-052 renders the ${scenario.language} results timeline at ${scenario.width}px`, async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: scenario.width === 390 ? 844 : 900 });
    await page.goto(`/${scenario.language}/about/`);

    const controlsBefore = await page.locator('.system-rail').boundingBox();
    const timeline = page.locator('[data-professional-timeline]');
    await timeline.scrollIntoViewIfNeeded();

    await expect(page.getByRole('heading', { name: scenario.heading })).toBeVisible();
    await expect(timeline.locator('[data-timeline-entry]')).toHaveCount(4);
    await expect(timeline.getByText(scenario.language === 'he' ? 'מאפריל 2026' : 'From Apr 2026')).toBeVisible();
    await expect(timeline.getByText(scenario.language === 'he' ? 'מסירה מקצה לקצה והובלה טכנית' : 'End-to-end delivery & technical leadership')).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasHorizontalOverflow).toBe(false);
    expect(await page.locator('.system-rail').boundingBox()).toEqual(controlsBefore);
  });
}
