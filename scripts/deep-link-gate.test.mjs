import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  extractPublicRoutes,
  routeToHtmlFile,
  verifyDeepLinks,
} from './deep-link-gate.mjs';

const sitemap = (locations) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset>${locations.map((location) => `<url><loc>${location}</loc></url>`).join('')}</urlset>`;

const createBuild = async (routes) => {
  const distDir = await mkdtemp(path.join(os.tmpdir(), 'fix-007-deep-links-'));
  await writeFile(path.join(distDir, 'sitemap.xml'), sitemap(
    routes.map((route) => `https://evyatarhazan.com${route}`),
  ));

  for (const route of routes) {
    const target = routeToHtmlFile(distDir, route);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, '<!doctype html><div id="root"></div>');
  }

  return distDir;
};

describe('FIX-007 post-build deep-link gate', () => {
  it('extracts every unique public pathname from the sitemap', () => {
    expect(extractPublicRoutes(sitemap([
      'https://evyatarhazan.com/en/',
      'https://evyatarhazan.com/he/projects/',
      'https://evyatarhazan.com/en/',
    ]))).toEqual(['/en/', '/he/projects/']);
  });

  it('maps routes only to their generated index documents', () => {
    expect(routeToHtmlFile('/tmp/dist', '/he/blog/a-post/'))
      .toBe(path.resolve('/tmp/dist/he/blog/a-post/index.html'));
    expect(() => routeToHtmlFile('/tmp/dist', '/%2e%2e%2fsecret/'))
      .toThrow(/escapes the build directory/u);
  });

  it('returns success only when every sitemap route has a direct HTTP 200 document', async () => {
    const distDir = await createBuild(['/en/', '/he/projects/']);
    await expect(verifyDeepLinks({ distDir })).resolves.toEqual({ routeCount: 2 });
  });

  it('fails when the sitemap advertises a route without generated HTML', async () => {
    const distDir = await createBuild(['/en/']);
    await writeFile(
      path.join(distDir, 'sitemap.xml'),
      sitemap(['https://evyatarhazan.com/en/', 'https://evyatarhazan.com/he/missing/']),
    );

    await expect(verifyDeepLinks({ distDir }))
      .rejects.toThrow('/he/missing/ -> he/missing/index.html');
  });
});
