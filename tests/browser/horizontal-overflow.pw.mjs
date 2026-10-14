import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const acceptedWidths = [320, 375, 390, 430, 480];
const sitemap = readFileSync(new URL('../../dist/sitemap.xml', import.meta.url), 'utf8');
const publicRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)]
  .map(([, location]) => new URL(location).pathname)
  .filter((route, index, routes) => routes.indexOf(route) === index);

if (publicRoutes.length === 0) {
  throw new Error('The generated sitemap did not contain any public routes.');
}

const inspectOverflow = () => {
  const root = document.documentElement;
  const viewportWidth = root.clientWidth;
  const overflowingElements = [...document.querySelectorAll('body *')]
    .map((element) => {
      const rect = element.getBoundingClientRect();

      return {
        element,
        rect,
      };
    })
    .filter(({ element, rect }) => {
      const style = getComputedStyle(element);

      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && rect.width > 0
        && (rect.left < -1 || rect.right > viewportWidth + 1);
    })
    .slice(0, 8)
    .map(({ element, rect }) => ({
      tag: element.tagName.toLowerCase(),
      id: element.id || undefined,
      className: typeof element.className === 'string'
        ? element.className.trim().replace(/\s+/gu, ' ').slice(0, 120)
        : undefined,
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      width: Math.round(rect.width),
    }));

  return {
    bodyScrollWidth: document.body.scrollWidth,
    documentScrollWidth: root.scrollWidth,
    overflowingElements,
    viewportWidth,
  };
};

test.describe('horizontal overflow gate', () => {
  for (const route of publicRoutes) {
    test(`${route} stays inside every accepted mobile viewport`, async ({ page }) => {
      await page.setViewportSize({ width: acceptedWidths[0], height: 844 });
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      for (const width of acceptedWidths) {
        await page.setViewportSize({ width, height: 844 });
        await page.locator('#main-content').waitFor({ state: 'visible' });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        });

        const result = await page.evaluate(inspectOverflow);
        const diagnostic = [
          `${route} overflows at ${width}px`,
          `document=${result.documentScrollWidth}px`,
          `body=${result.bodyScrollWidth}px`,
          `viewport=${result.viewportWidth}px`,
          `candidates=${JSON.stringify(result.overflowingElements)}`,
        ].join('; ');

        expect(result.documentScrollWidth, diagnostic).toBeLessThanOrEqual(result.viewportWidth);
      }
    });
  }
});
