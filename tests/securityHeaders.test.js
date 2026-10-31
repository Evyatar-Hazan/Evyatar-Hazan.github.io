import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { documentContentSecurityPolicy } from '../public/_worker.js';

const indexHtml = await readFile(path.join(process.cwd(), 'index.html'), 'utf8');
const metaPolicy = indexHtml.match(
  /<meta http-equiv="Content-Security-Policy"\s+content="([^"]+)"/u,
)?.[1];

describe('FIX-098 security policy', () => {
  it('keeps the static-host CSP aligned with the Cloudflare document policy', () => {
    expect(metaPolicy).toBeTruthy();
    expect(documentContentSecurityPolicy).toBe(`${metaPolicy}; frame-ancestors 'none'`);
  });

  it('permits required first-party behavior without weakening script execution', () => {
    const scriptPolicy = metaPolicy?.split('; ').find((directive) => directive.startsWith('script-src'));
    expect(scriptPolicy).toContain("script-src 'self' 'sha256-");
    expect(scriptPolicy).toContain('https://static.cloudflareinsights.com/beacon.min.js');
    expect(scriptPolicy).not.toContain("'unsafe-inline'");
    expect(metaPolicy).toContain("style-src 'self' 'unsafe-inline'");
    expect(metaPolicy).toContain("connect-src 'self' https://evyatarhazan.com https://formsubmit.co");
    expect(metaPolicy).toContain("object-src 'none'");
  });
});
