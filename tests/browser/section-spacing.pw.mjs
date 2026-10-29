import { expect, test } from '@playwright/test';

const readSpacing = async (page, selectors) => page.evaluate((targets) => {
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  document.body.append(probe);

  const resolveToken = (token) => {
    probe.style.paddingBlockStart = `var(${token})`;
    return getComputedStyle(probe).paddingBlockStart;
  };

  const tokens = {
    compact: resolveToken('--space-section-compact'),
    standard: resolveToken('--space-section'),
    spacious: resolveToken('--space-section-spacious'),
  };
  probe.remove();

  return {
    tokens,
    targets: targets.map(({ selector, token, startToken = token, endToken = token }) => {
      const element = document.querySelector(selector);
      if (!element) return { selector, missing: true };
      const style = getComputedStyle(element);
      return {
        selector,
        token,
        startToken,
        endToken,
        paddingBlockStart: style.paddingBlockStart,
        paddingBlockEnd: style.paddingBlockEnd,
        marginBlockStart: style.marginBlockStart,
        marginBlockEnd: style.marginBlockEnd,
      };
    }),
  };
}, selectors);

const expectTokenSpacing = ({ tokens, targets }) => {
  for (const target of targets) {
    expect(target.missing, `${target.selector} should exist`).not.toBe(true);
    expect(target.marginBlockStart, `${target.selector} should not create an arbitrary section gap`).toBe('0px');
    expect(target.marginBlockEnd, `${target.selector} should not create an arbitrary section gap`).toBe('0px');
    expect(target.paddingBlockStart).toBe(tokens[target.startToken]);
    expect(target.paddingBlockEnd).toBe(tokens[target.endToken]);
  }
};

const waitForTargets = async (page, targets) => {
  await Promise.all(targets.map(({ selector }) => expect(page.locator(selector).first()).toBeAttached()));
};

test.describe('FIX-025 canonical section spacing', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('keeps the About sections on the shared responsive rhythm', async ({ page }) => {
    await page.goto('/en/about/');
    const targets = [
      { selector: '[aria-labelledby="about-story-title"]', token: 'standard' },
      { selector: '[aria-labelledby="capability-explorer-title"]', token: 'standard' },
      { selector: '[aria-labelledby="delivery-process-title"]', token: 'standard' },
      { selector: '#working-principles', token: 'spacious' },
      { selector: '#service-engagements', token: 'standard' },
    ];
    await waitForTargets(page, targets);
    expectTokenSpacing(await readSpacing(page, targets));
  });

  test('keeps project index sections on one spacious cadence', async ({ page }) => {
    await page.goto('/he/projects/');
    const targets = [
      { selector: '.projects-hub-hero', token: 'spacious' },
      { selector: '.projects-hub-section', token: 'spacious' },
      { selector: '.projects-hub-contact', token: 'compact' },
    ];
    await waitForTargets(page, targets);
    expectTokenSpacing(await readSpacing(page, targets));
  });

  test('keeps case-study chapters on the standard cadence', async ({ page }) => {
    await page.goto('/en/projects/nis_boutique/');
    expectTokenSpacing(await readSpacing(page, [
      { selector: '#visual-proof', startToken: 'compact', endToken: 'standard' },
      { selector: '#challenge', token: 'standard' },
      { selector: '#decisions', token: 'standard' },
      { selector: '#system', token: 'standard' },
      { selector: '#evidence', token: 'standard' },
    ]));
  });

  test('keeps homepage boundaries margin-free in RTL', async ({ page }) => {
    await page.goto('/he/');
    await expect(page.locator('main > .home-section')).toHaveCount(4);
    const margins = await page.locator('main > .home-section').evaluateAll((sections) => sections.map((section) => {
      const style = getComputedStyle(section);
      return [style.marginBlockStart, style.marginBlockEnd];
    }));

    expect(margins.length).toBe(4);
    expect(margins.every(([start, end]) => start === '0px' && end === '0px')).toBe(true);
  });
});
