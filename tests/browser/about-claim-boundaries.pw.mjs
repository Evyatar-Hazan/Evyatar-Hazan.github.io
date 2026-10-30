import { expect, test } from '@playwright/test';

const scenarios = [
  { language: 'en', theme: 'light', viewport: { width: 1440, height: 900 } },
  { language: 'he', theme: 'dark', viewport: { width: 1440, height: 900 } },
  { language: 'en', theme: 'dark', viewport: { width: 390, height: 844 } },
  { language: 'he', theme: 'light', viewport: { width: 390, height: 844 } },
];

for (const scenario of scenarios) {
  test(`FIX-060 bounds professional claims in ${scenario.language}-${scenario.theme}-${scenario.viewport.width}`, async ({ page }) => {
    await page.setViewportSize(scenario.viewport);
    await page.emulateMedia({ colorScheme: scenario.theme, reducedMotion: 'reduce' });
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('theme', theme);
    }, scenario);

    await page.goto(`/${scenario.language}/about/`);
    await page.locator('#main-content').waitFor({ state: 'visible' });

    const boundary = page.locator('[data-about-evidence-boundary]');
    await expect(boundary).toBeVisible();
    await expect(boundary.getByRole('link')).toHaveCount(2);
    await expect(boundary.getByRole('link').nth(0)).toHaveAttribute('href', `/${scenario.language}/projects/`);
    await expect(boundary.getByRole('link').nth(1)).toHaveAttribute('href', `/${scenario.language}/blog/`);

    const bodyText = await page.locator('#main-content').innerText();
    const unboundedClaimText = bodyText.replace(await boundary.innerText(), '');
    expect(unboundedClaimText).not.toMatch(/\b\d+\+?\s+years?\b|\baward[- ]winning\b|\bcertified\b|\bexpert\b/i);
    expect(unboundedClaimText).not.toMatch(/\b\d+\+?\s+שנות?\b|מומחה|מוסמך|עטור פרסים/i);

    const capabilityButtons = page.locator('[aria-controls="capability-panel"]');
    await expect(capabilityButtons).toHaveCount(7);
    for (const button of await capabilityButtons.all()) {
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      const panel = page.locator('#capability-panel');
      await expect(panel).toBeVisible();
      await expect.poll(async () => (
        await panel.locator('[data-evidence-demonstrations] a').count()
        + await panel.locator('[data-evidence-gap]').count()
      )).toBeGreaterThan(0);
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
