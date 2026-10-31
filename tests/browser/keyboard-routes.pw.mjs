import { expect, test } from '@playwright/test';

const routeSamples = [
  { id: 'home', path: '/', readySelector: '#home h1' },
  { id: 'projects-index', path: '/projects/', readySelector: '.projects-hub h1' },
  {
    id: 'project-case-study',
    path: '/projects/online_converter/',
    readySelector: 'article[data-case-study-template="product-story-v1"] h1',
  },
  { id: 'articles-index', path: '/blog/', readySelector: '.blog-archive h1' },
  {
    id: 'article',
    path: '/blog/tests-need-honest-environments/',
    readySelector: '.blog-article-shell h1',
  },
  { id: 'about', path: '/about/', readySelector: '.about-dossier h1' },
  { id: 'contact', path: '/contact/', readySelector: '.contact-workspace h1' },
  { id: 'lab', path: '/lab/', readySelector: '.craft-lab h1' },
  { id: 'privacy', path: '/privacy/', readySelector: '#main-content h1' },
];

const languages = ['en', 'he'];
const themes = ['light', 'dark'];
const viewports = [
  { id: 'desktop', width: 1440, height: 900 },
  { id: 'mobile', width: 390, height: 844 },
];

const scenarios = routeSamples.flatMap((route) => languages.flatMap((language) => (
  themes.flatMap((theme) => viewports.map((viewport) => ({
    route,
    language,
    theme,
    viewport,
  })))
)));

const installKeyboardAuditIds = async (page) => page.evaluate(() => {
  const selector = [
    'a[href]',
    'button',
    'input',
    'select',
    'textarea',
    'summary',
    '[tabindex]',
    '[contenteditable="true"]',
  ].join(',');

  const candidates = Array.from(document.querySelectorAll(selector));
  const tabbable = candidates.filter((element) => {
    if (!(element instanceof HTMLElement)) return false;
    if (element.tabIndex < 0) return false;
    if ('disabled' in element && element.disabled) return false;
    if (element.closest('[inert], [aria-hidden="true"]')) return false;
    if (element.tagName !== 'SUMMARY' && element.closest('details:not([open])')) return false;

    const style = getComputedStyle(element);
    return style.display !== 'none'
      && style.visibility !== 'hidden'
      && element.getClientRects().length > 0;
  });

  const ordered = tabbable
    .map((element, domOrder) => ({ element, domOrder, tabIndex: element.tabIndex }))
    .sort((left, right) => {
      const leftOrder = left.tabIndex > 0 ? left.tabIndex : Number.MAX_SAFE_INTEGER;
      const rightOrder = right.tabIndex > 0 ? right.tabIndex : Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder || left.domOrder - right.domOrder;
    });

  return ordered.map(({ element }, index) => {
    const auditId = `keyboard-audit-${index}`;
    element.dataset.keyboardAuditId = auditId;
    return auditId;
  });
});

const resetFocusToDocumentStart = async (page) => page.evaluate(() => {
  document.body.setAttribute('tabindex', '-1');
  document.body.focus();
  document.body.removeAttribute('tabindex');
});

const activeElementState = async (page) => page.evaluate(() => {
  const element = document.activeElement;
  if (!(element instanceof HTMLElement)) return null;

  const style = getComputedStyle(element);
  const outlineWidth = Number.parseFloat(style.outlineWidth);
  const outlineIsVisible = style.outlineStyle !== 'none'
    && outlineWidth > 0
    && style.outlineColor !== 'rgba(0, 0, 0, 0)'
    && style.outlineColor !== 'transparent';
  const shadowIsVisible = style.boxShadow !== 'none'
    && !/^rgba?\(0, 0, 0, 0\)( 0px){3,4}$/u.test(style.boxShadow);
  const revealedSkipLink = element.classList.contains('skip-link')
    && Number.parseFloat(style.opacity) > 0
    && style.pointerEvents !== 'none';

  return {
    auditId: element.dataset.keyboardAuditId ?? null,
    focusVisible: element.matches(':focus-visible'),
    indicatorVisible: outlineIsVisible || shadowIsVisible || revealedSkipLink,
    description: {
      tag: element.tagName.toLowerCase(),
      id: element.id || null,
      label: element.getAttribute('aria-label'),
      text: element.textContent?.replace(/\s+/gu, ' ').trim().slice(0, 80) || null,
      href: element.getAttribute('href'),
      className: typeof element.className === 'string' ? element.className : null,
    },
  };
});

const auditTabOrder = async (page) => {
  const expectedIds = await installKeyboardAuditIds(page);
  expect(expectedIds.length).toBeGreaterThan(0);

  await resetFocusToDocumentStart(page);
  const visitedIds = new Set();

  for (let index = 0; index < expectedIds.length; index += 1) {
    await page.keyboard.press('Tab');
    await page.waitForFunction(() => {
      const activeElement = document.activeElement;
      return !(activeElement instanceof HTMLElement)
        || !activeElement.classList.contains('skip-link')
        || Number.parseFloat(getComputedStyle(activeElement).opacity) > 0.9;
    });
    const state = await activeElementState(page);

    expect(state, `Tab ${index + 1} did not focus an HTML element`).not.toBeNull();
    if (state.auditId === null) {
      const missingIds = expectedIds.filter((auditId) => !visitedIds.has(auditId));
      const missingElements = await page.evaluate((auditIds) => auditIds.map((auditId) => {
        const element = document.querySelector(`[data-keyboard-audit-id="${auditId}"]`);
        if (!(element instanceof HTMLElement)) return { auditId, missing: true };
        return {
          auditId,
          tag: element.tagName.toLowerCase(),
          id: element.id || null,
          label: element.getAttribute('aria-label'),
          text: element.textContent?.replace(/\s+/gu, ' ').trim().slice(0, 80) || null,
          href: element.getAttribute('href'),
          className: typeof element.className === 'string' ? element.className : null,
        };
      }), missingIds);
      throw new Error(
        `Unexpected keyboard target: ${JSON.stringify(state.description)}; remaining candidates: ${JSON.stringify(missingElements)}`,
      );
    }
    expect(
      visitedIds.has(state.auditId),
      `Keyboard focus became trapped at ${JSON.stringify(state.description)}`,
    ).toBe(false);
    expect(
      state.focusVisible && state.indicatorVisible,
      `Keyboard focus is not visibly indicated: ${JSON.stringify(state)}`,
    ).toBe(true);

    visitedIds.add(state.auditId);
  }

  expect([...visitedIds].sort()).toEqual([...expectedIds].sort());
};

const auditMobileMenu = async (page) => {
  const trigger = page.locator('.system-rail-menu-toggle');
  const controlsBefore = await page.locator('.system-rail-mobile-actions').boundingBox();

  await trigger.focus();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog');
  const closeButton = dialog.locator('.system-rail-mobile-close');
  const focusable = dialog.locator('a[href], button:not([disabled])');
  const lastFocusable = focusable.last();

  await expect(dialog).toBeVisible();
  await expect(closeButton).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(lastFocusable).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(closeButton).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(await page.locator('.system-rail-mobile-actions').boundingBox()).toEqual(controlsBefore);
};

test.describe('FIX-083 route-wide keyboard accessibility', () => {
  for (const scenario of scenarios) {
    const { route, language, theme, viewport } = scenario;

    test(`${route.id}-${viewport.id}-${language}-${theme}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.addInitScript(({ activeLanguage, activeTheme }) => {
        localStorage.setItem('i18nextLng', activeLanguage);
        localStorage.setItem('theme', activeTheme);
      }, { activeLanguage: language, activeTheme: theme });

      await page.goto(`/${language}${route.path}`, { waitUntil: 'networkidle' });
      await page.locator(route.readySelector).waitFor({ state: 'visible' });
      await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
      await expect(page.locator('#main-content')).toBeFocused();

      await auditTabOrder(page);

      if (viewport.id === 'mobile') {
        await auditMobileMenu(page);
      }
    });
  }
});
