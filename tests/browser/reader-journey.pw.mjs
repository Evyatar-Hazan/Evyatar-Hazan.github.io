import { expect, test } from '@playwright/test';

const expectedJourney = [
  { id: 'home', stage: 'value' },
  { id: 'projects', stage: 'proof' },
  { id: 'about', stage: 'capabilities' },
  { id: 'writing', stage: 'content' },
  { id: 'contact', stage: 'contact' },
];

for (const language of ['en', 'he']) {
  test(`FIX-035 keeps the ${language} homepage reader journey in semantic order`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${language}/`, { waitUntil: 'domcontentloaded' });

    const sections = page.locator('main.home-page > section[data-reader-journey-stage]');
    await expect(sections).toHaveCount(expectedJourney.length);

    const journey = await sections.evaluateAll((nodes) => nodes.map((node) => ({
      id: node.id,
      stage: node.getAttribute('data-reader-journey-stage'),
      top: node.getBoundingClientRect().top + window.scrollY,
    })));

    expect(journey.map(({ id, stage }) => ({ id, stage }))).toEqual(expectedJourney);
    expect(journey.map(({ top }) => top)).toEqual([...journey.map(({ top }) => top)].sort((a, b) => a - b));
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  });
}
