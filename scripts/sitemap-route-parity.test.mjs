import { describe, expect, it } from 'vitest';
import {
  assertSitemapRouteParity,
  buildLocalizedPublicRoutes,
  extractSitemapPaths,
} from './sitemap-route-parity.mjs';

const siteUrl = 'https://evyatarhazan.com';
const languages = ['en', 'he'];
const sitemap = (paths) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset>${paths.map((path) => `<url><loc>${siteUrl}${path}</loc></url>`).join('')}</urlset>`;

describe('FIX-096 sitemap route parity', () => {
  it('builds one localized sitemap path for every public route and language', () => {
    expect(buildLocalizedPublicRoutes(['/', '/projects'], languages)).toEqual([
      '/en/',
      '/he/',
      '/en/projects/',
      '/he/projects/',
    ]);
  });

  it('accepts exact one-to-one parity between the public route registry and sitemap', () => {
    const sitemapXml = sitemap(['/en/', '/he/', '/en/projects/', '/he/projects/']);

    expect(assertSitemapRouteParity({
      routePaths: ['/', '/projects/'],
      languages,
      sitemapXml,
      siteUrl,
    })).toEqual({ routeCount: 4 });
    expect(extractSitemapPaths(sitemapXml, siteUrl)).toHaveLength(4);
  });

  it('rejects duplicate public routes before sitemap generation', () => {
    expect(() => buildLocalizedPublicRoutes(['/projects/', '/projects'], languages))
      .toThrow(/registry contains duplicate path[\s\S]*\/projects\//u);
  });

  it('reports duplicate, missing, and stale sitemap routes', () => {
    const sitemapXml = sitemap([
      '/en/',
      '/en/',
      '/he/',
      '/en/projects/',
      '/he/retired/',
    ]);

    expect(() => assertSitemapRouteParity({
      routePaths: ['/', '/projects/'],
      languages,
      sitemapXml,
      siteUrl,
    })).toThrow([
      'Duplicate sitemap route(s):',
      '- /en/',
      'Public route(s) missing from sitemap:',
      '- /he/projects/',
      'Stale sitemap route(s) not present in the public route registry:',
      '- /he/retired/',
    ].join('\n'));
  });

  it('rejects sitemap locations from a different origin', () => {
    expect(() => extractSitemapPaths(
      '<urlset><url><loc>https://example.com/en/</loc></url></urlset>',
      siteUrl,
    )).toThrow(/unexpected origin/u);
  });
});
