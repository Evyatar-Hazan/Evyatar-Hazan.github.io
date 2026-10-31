import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  extractSitemapRoutes,
  failureReport,
  runProductionMonitor,
} from './production-route-monitor.mjs';

const sitemap = `<?xml version="1.0"?><urlset>
  <url><loc>https://evyatarhazan.com/en/</loc></url>
  <url><loc>https://evyatarhazan.com/he/about/</loc></url>
</urlset>`;

const htmlFor = (route) => `<!doctype html><html><head>
  <link rel="canonical" href="https://evyatarhazan.com${route}" />
</head><body><div id="root"></div></body></html>`;

const response = (body, { status = 200, contentType = 'text/html; charset=utf-8' } = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: new Headers({ 'content-type': contentType }),
  text: async () => body,
});

describe('FIX-100 production route monitor', () => {
  it('schedules checks and suppresses duplicate failure notifications', () => {
    const workflow = readFileSync(path.resolve('.github/workflows/production-route-monitor.yml'), 'utf8');

    expect(workflow).toContain('cron: "17 */6 * * *"');
    expect(workflow).toContain('issues: write');
    expect(workflow).toContain("existing?.body?.includes(fingerprintLine)");
    expect(workflow).toContain("state: 'closed'");
  });

  it('extracts a stable localized route set from the sitemap', () => {
    expect(extractSitemapRoutes(sitemap)).toEqual(['/en/', '/he/about/']);
  });

  it('checks every sitemap route on both production domains', async () => {
    const fetchImpl = vi.fn(async (url) => {
      const parsed = new URL(url);
      if (parsed.pathname === '/sitemap.xml') {
        return response(sitemap, { contentType: 'application/xml' });
      }
      return response(htmlFor(parsed.pathname));
    });

    const report = await runProductionMonitor({
      fetchImpl,
      attempts: 1,
      delayMs: 0,
      checkedAt: '2026-10-31T12:00:00.000Z',
    });

    expect(report).toMatchObject({ status: 'ok', routeCount: 2, checkCount: 4 });
    expect(report.checks.map(({ origin, route }) => `${origin}${route}`)).toEqual([
      'https://evyatarhazan.com/en/',
      'https://evyatarhazan.com/he/about/',
      'https://evyatar-hazan.github.io/en/',
      'https://evyatar-hazan.github.io/he/about/',
    ]);
  });

  it('retries a transient route failure before reporting success', async () => {
    let failuresRemaining = 1;
    const fetchImpl = vi.fn(async (url) => {
      const parsed = new URL(url);
      if (parsed.pathname === '/sitemap.xml') {
        return response('<urlset><url><loc>https://evyatarhazan.com/en/</loc></url></urlset>', {
          contentType: 'application/xml',
        });
      }
      if (parsed.hostname === 'evyatar-hazan.github.io' && failuresRemaining > 0) {
        failuresRemaining -= 1;
        return response('unavailable', { status: 503 });
      }
      return response(htmlFor(parsed.pathname));
    });

    await expect(runProductionMonitor({
      fetchImpl,
      attempts: 2,
      delayMs: 0,
      checkedAt: '2026-10-31T12:00:00.000Z',
    })).resolves.toMatchObject({ status: 'ok', checkCount: 2 });
  });

  it('rejects soft route breakage and creates a stable failure fingerprint', async () => {
    const fetchImpl = vi.fn(async (url) => {
      const parsed = new URL(url);
      if (parsed.pathname === '/sitemap.xml') {
        return response('<urlset><url><loc>https://evyatarhazan.com/en/</loc></url></urlset>', {
          contentType: 'application/xml',
        });
      }
      return response('<html><body>fallback page</body></html>');
    });

    let observed;
    try {
      await runProductionMonitor({
        fetchImpl,
        attempts: 1,
        delayMs: 0,
        checkedAt: '2026-10-31T12:00:00.000Z',
      });
    } catch (error) {
      observed = error;
    }

    const first = failureReport(observed, {
      origins: ['https://evyatarhazan.com', 'https://evyatar-hazan.github.io'],
      checkedAt: '2026-10-31T12:00:00.000Z',
    });
    const second = failureReport(observed, {
      origins: ['https://evyatarhazan.com', 'https://evyatar-hazan.github.io'],
      checkedAt: '2026-11-01T12:00:00.000Z',
    });

    expect(first.status).toBe('failed');
    expect(first.error).toContain('did not contain the application root');
    expect(first.error).not.toContain('?monitor=');
    expect(first.failureFingerprint).toBe(second.failureFingerprint);
  });
});
