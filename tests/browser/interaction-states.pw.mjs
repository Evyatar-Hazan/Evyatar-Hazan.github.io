import { expect, test } from '@playwright/test';

const interactionSnapshot = (locator) => locator.evaluate((element) => {
  const style = getComputedStyle(element);
  return {
    borderColor: style.borderColor,
    boxShadow: style.boxShadow,
    outlineStyle: style.outlineStyle,
    outlineWidth: style.outlineWidth,
    transform: style.transform,
  };
});

test.describe('FIX-027 interaction-state system', () => {
  test('keeps default, hover, focus, and pressed feedback distinct for actions, cards, and links', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
    await page.addInitScript(() => {
      localStorage.setItem('i18nextLng', 'en');
      localStorage.setItem('theme', 'light');
    });

    await page.goto('/en/', { waitUntil: 'domcontentloaded' });
    await page.locator('#main-content').waitFor({ state: 'visible' });

    const selectors = await page.evaluate(() => Array.from(document.styleSheets)
      .flatMap((sheet) => {
        try {
          return Array.from(sheet.cssRules, (rule) => rule.cssText);
        } catch {
          return [];
        }
      })
      .join('\n'));
    expect(selectors).toContain('.home-action:hover');
    expect(selectors).toContain('.home-action:active');
    expect(selectors).toContain('.ui-card--interactive:hover');
    expect(selectors).toContain('.ui-card--interactive:has(:active)');
    expect(selectors).toContain('.writing-all-link:hover');
    expect(selectors).toContain('.writing-all-link:active');

    const action = page.locator('.featured-case-card .home-action--primary').first();
    await action.focus();
    await expect(action).toBeFocused();
    await expect.poll(() => interactionSnapshot(action)).toMatchObject({ outlineStyle: 'solid', outlineWidth: '3px' });

    await page.locator('#main-content').focus();
    const card = page.locator('.featured-case-card').first();
    await card.scrollIntoViewIfNeeded();
    const cardDefault = await interactionSnapshot(card);
    const cardLink = card.locator('.home-action').first();
    await cardLink.focus();
    await expect.poll(() => interactionSnapshot(card)).not.toEqual(cardDefault);

    const textLink = page.locator('.writing-all-link');
    await textLink.scrollIntoViewIfNeeded();
    await textLink.focus();
    await expect(textLink).toBeFocused();
    await expect.poll(() => interactionSnapshot(textLink)).toMatchObject({ outlineStyle: 'solid', outlineWidth: '3px' });
  });
});
