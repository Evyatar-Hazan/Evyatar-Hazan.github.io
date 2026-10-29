import { expect, test } from '@playwright/test';

const factIds = ['role', 'problem', 'result', 'status'];

const projectCardScenarios = [
  { language: 'en', route: '/', width: 1440, height: 900, cardCount: 4, colorScheme: 'light' },
  { language: 'he', route: '/', width: 390, height: 844, cardCount: 4, colorScheme: 'dark' },
  { language: 'en', route: '/projects/', width: 1440, height: 900, cardCount: 11, colorScheme: 'light' },
  { language: 'he', route: '/projects/', width: 390, height: 844, cardCount: 11, colorScheme: 'dark' },
];

for (const scenario of projectCardScenarios) {
  test(`FIX-042 keeps every ${scenario.language}${scenario.route} card on the shared fact contract`, async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: scenario.height });
    await page.emulateMedia({ colorScheme: scenario.colorScheme });
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('theme', theme);
    }, { language: scenario.language, theme: scenario.colorScheme });

    await page.goto(`/${scenario.language}${scenario.route}`, { waitUntil: 'domcontentloaded' });
    const cards = page.locator('[data-project-card]');
    await expect(cards).toHaveCount(scenario.cardCount);

    for (const card of await cards.all()) {
      await expect(card.locator('[data-project-card-facts]')).toHaveCount(1);
      for (const factId of factIds) {
        const fact = card.locator(`[data-project-fact="${factId}"]`);
        await expect(fact).toHaveCount(1);
        await expect(fact.locator('dt')).not.toHaveText('');
        await expect(fact.locator('dd')).not.toHaveText('');
      }
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });
}

test('FIX-042 keeps comparison cards on the same fact contract', async ({ page }) => {
  await page.goto('/en/projects/?compare=nis_boutique,online_converter', { waitUntil: 'domcontentloaded' });
  const comparisonCards = page.locator('.projects-hub-comparison-grid > [data-project-card]');
  await expect(comparisonCards).toHaveCount(2);

  for (const card of await comparisonCards.all()) {
    await expect(card.locator('[data-project-fact]')).toHaveCount(4);
  }
});
