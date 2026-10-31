import { expect, test } from '@playwright/test';
import axe from 'axe-core';

const routes = ['/', '/projects/', '/about/', '/blog/', '/contact/'];
const scenarios = [
  { name: 'desktop-en-light', language: 'en', theme: 'light', width: 1440, height: 900 },
  { name: 'desktop-en-dark', language: 'en', theme: 'dark', width: 1440, height: 900 },
  { name: 'desktop-he-light', language: 'he', theme: 'light', width: 1440, height: 900 },
  { name: 'desktop-he-dark', language: 'he', theme: 'dark', width: 1440, height: 900 },
  { name: 'mobile-en-light', language: 'en', theme: 'light', width: 390, height: 844 },
  { name: 'mobile-en-dark', language: 'en', theme: 'dark', width: 390, height: 844 },
  { name: 'mobile-he-light', language: 'he', theme: 'light', width: 390, height: 844 },
  { name: 'mobile-he-dark', language: 'he', theme: 'dark', width: 390, height: 844 },
];

const expectedFocusToken = {
  light: '#0369a1',
  dark: '#38bdf8',
};

test.describe('FIX-081 WCAG AA contrast audit', () => {
  test.describe.configure({ mode: 'serial' });

  for (const scenario of scenarios) {
    test(`${scenario.name} has WCAG AA contrast on primary routes`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: scenario.width, height: scenario.height });
    await page.emulateMedia({ colorScheme: scenario.theme, reducedMotion: 'reduce' });
    await page.addInitScript(({ language, theme }) => {
      localStorage.setItem('i18nextLng', language);
      localStorage.setItem('theme', theme);
    }, scenario);

    for (const route of routes) {
      await page.goto(`/${scenario.language}${route}`, { waitUntil: 'networkidle' });
      await page.locator('#main-content').waitFor({ state: 'visible' });
      await page.addScriptTag({ content: axe.source });

      const audit = await page.evaluate(async () => window.axe.run(document, {
        runOnly: { type: 'rule', values: ['color-contrast'] },
        resultTypes: ['violations'],
      }));
      expect(audit.violations, `${scenario.name} ${route}`).toEqual([]);

      expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-focus-ring').trim()))
        .toBe(expectedFocusToken[scenario.theme]);

      await page.locator('body').press('Tab');
      for (let step = 0; step < 12; step += 1) {
        const focus = await page.evaluate(() => {
          const element = document.activeElement;
          if (!(element instanceof HTMLElement)) return null;
          const style = getComputedStyle(element);
          const parseRgb = (value) => value.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
          const luminance = (value) => {
            const channels = parseRgb(value).map((channel) => channel / 255)
              .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
            return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
          };
          let background = element.parentElement;
          let backgroundColor = 'rgba(0, 0, 0, 0)';
          while (background) {
            backgroundColor = getComputedStyle(background).backgroundColor;
            if (!backgroundColor.endsWith(', 0)') && backgroundColor !== 'rgba(0, 0, 0, 0)') break;
            background = background.parentElement;
          }
          if (!background) backgroundColor = getComputedStyle(document.body).backgroundColor;
          const [lighter, darker] = [luminance(style.outlineColor), luminance(backgroundColor)].sort((first, second) => second - first);
          return {
            tag: element.tagName,
            outlineStyle: style.outlineStyle,
            outlineWidth: Number.parseFloat(style.outlineWidth),
            contrastRatio: (lighter + 0.05) / (darker + 0.05),
          };
        });

        expect(focus, `${scenario.name} ${route} focus step ${step}`).not.toBeNull();
        expect(focus.outlineStyle, `${scenario.name} ${route} ${focus.tag}`).toBe('solid');
        expect(focus.outlineWidth, `${scenario.name} ${route} ${focus.tag}`).toBeGreaterThanOrEqual(3);
        expect(focus.contrastRatio, `${scenario.name} ${route} ${focus.tag}`).toBeGreaterThanOrEqual(3);
        await page.keyboard.press('Tab');
      }

      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
    });
  }
});
