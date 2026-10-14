import { describe, expect, it } from 'vitest';
import {
  assertSafeOutputDir,
  buildCaptureMatrix,
  extractLocalizedRoutes,
  routeSlug,
} from './capture-visual-baseline.mjs';

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset>
  <url><loc>https://evyatarhazan.com/en/</loc></url>
  <url><loc>https://evyatarhazan.com/he/</loc></url>
  <url><loc>https://evyatarhazan.com/en/projects/</loc></url>
  <url><loc>https://evyatarhazan.com/he/projects/</loc></url>
</urlset>`;

describe('FIX-001 visual baseline matrix', () => {
  it('requires a Hebrew and English variant for every canonical route', () => {
    const result = extractLocalizedRoutes(sitemap);
    expect(result.routeCount).toBe(2);
    expect(result.localizedRoutes).toEqual(['/en/', '/en/projects/', '/he/', '/he/projects/']);
    expect(() => extractLocalizedRoutes(sitemap.replace('<url><loc>https://evyatarhazan.com/he/projects/</loc></url>', '')))
      .toThrow(/missing localized variants: he/u);
  });

  it('covers every route in both themes and both required viewports', () => {
    const { localizedRoutes } = extractLocalizedRoutes(sitemap);
    const matrix = buildCaptureMatrix({
      localizedRoutes,
      baseUrl: 'https://example.com/',
      outputDir: '/tmp/fix-001',
    });

    expect(matrix).toHaveLength(16);
    expect(new Set(matrix.map(({ theme }) => theme))).toEqual(new Set(['light', 'dark']));
    expect(new Set(matrix.map(({ viewport }) => `${viewport.width}x${viewport.height}`)))
      .toEqual(new Set(['1440x900', '390x844']));
    expect(matrix.every(({ fullPage }) => fullPage)).toBe(true);
  });

  it('creates stable route directories without language duplication', () => {
    expect(routeSlug('/en/')).toBe('home');
    expect(routeSlug('/he/blog/a-post/')).toBe('blog--a-post');
  });

  it('limits recursive output replacement to a named Playwright artifact directory', () => {
    expect(() => assertSafeOutputDir('/repo', '/repo/output/playwright/fix-001')).not.toThrow();
    expect(() => assertSafeOutputDir('/repo', '/repo/output/playwright')).toThrow(/named child/u);
    expect(() => assertSafeOutputDir('/repo', '/repo')).toThrow(/named child/u);
    expect(() => assertSafeOutputDir('/repo', '/tmp/fix-001')).toThrow(/named child/u);
  });
});
