import { expect, test } from '@playwright/test';

const sitemapPath = '/sitemap.xml';
const notFoundPath = '/en/fix-082-heading-audit-missing/';

test.setTimeout(120_000);

const readPublicPaths = (sitemap) => [
  ...new Set([
    ...Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu), ([, location]) => new URL(location).pathname),
    notFoundPath,
  ]),
];

const readHeadingOutline = (page) => page.locator('h1, h2, h3, h4, h5, h6').evaluateAll((headings) =>
  headings.map((heading) => ({
    level: Number(heading.tagName.slice(1)),
    text: heading.textContent?.trim().replace(/\s+/gu, ' ') ?? '',
  })),
);

test('FIX-082 keeps one h1 and a continuous heading outline on every public route', async ({ page, request }) => {
  const sitemapResponse = await request.get(sitemapPath);
  expect(sitemapResponse.ok()).toBe(true);

  const publicPaths = readPublicPaths(await sitemapResponse.text());
  expect(publicPaths.length).toBeGreaterThan(1);

  const violations = [];

  for (const path of publicPaths) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await page.locator('main h1').first().waitFor({ state: 'attached' });

    const headings = await readHeadingOutline(page);
    const h1Count = headings.filter(({ level }) => level === 1).length;
    const skippedLevels = headings.flatMap((heading, index) => {
      const previous = headings[index - 1];
      return previous && heading.level > previous.level + 1
        ? [{ from: previous, to: heading }]
        : [];
    });
    const audienceCardLevels = /^\/(?:en|he)\/$/u.test(path)
      ? await page.locator('[aria-labelledby="audience-entry-paths-title"] article h1, [aria-labelledby="audience-entry-paths-title"] article h2, [aria-labelledby="audience-entry-paths-title"] article h3, [aria-labelledby="audience-entry-paths-title"] article h4, [aria-labelledby="audience-entry-paths-title"] article h5, [aria-labelledby="audience-entry-paths-title"] article h6')
        .evaluateAll((cardHeadings) => cardHeadings.map((heading) => Number(heading.tagName.slice(1))))
      : [];
    const invalidAudienceCardLevels = audienceCardLevels.filter((level) => level !== 3);

    if (h1Count !== 1 || skippedLevels.length > 0 || invalidAudienceCardLevels.length > 0) {
      violations.push({ path, h1Count, skippedLevels, audienceCardLevels, headings });
    }
  }

  expect(
    violations,
    `Semantic heading violations:\n${JSON.stringify(violations, null, 2)}`,
  ).toEqual([]);
});
