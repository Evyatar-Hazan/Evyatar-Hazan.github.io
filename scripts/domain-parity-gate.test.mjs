import { describe, expect, it } from 'vitest';
import {
  compareDeploymentManifests,
  extractAssetPaths,
  parseArguments,
  validateDeploymentManifest,
} from './domain-parity-gate.mjs';

const sourceSha = '0123456789abcdef0123456789abcdef01234567';
const manifest = {
  schemaVersion: 1,
  sourceSha,
  assets: [{ path: '/assets/app.js', bytes: 12, sha256: 'a'.repeat(64) }],
};

describe('FIX-009 domain parity gate', () => {
  it('accepts a well-formed manifest and rejects duplicate assets', () => {
    expect(validateDeploymentManifest(manifest, 'https://one.example')).toBe(manifest);
    expect(() => validateDeploymentManifest({
      ...manifest,
      assets: [...manifest.assets, manifest.assets[0]],
    }, 'https://one.example')).toThrow(/duplicate asset/u);
  });

  it('requires the same source SHA and deterministic asset inventory', () => {
    expect(() => compareDeploymentManifests(manifest, structuredClone(manifest))).not.toThrow();
    expect(() => compareDeploymentManifests(manifest, { ...manifest, sourceSha: 'f'.repeat(40) }))
      .toThrow(/SHA mismatch/u);
    expect(() => compareDeploymentManifests(manifest, {
      ...manifest,
      assets: [{ ...manifest.assets[0], bytes: 13 }],
    })).toThrow(/inventories differ/u);
  });

  it('extracts only first-party built assets from route HTML', () => {
    const html = '<link href="/assets/app.css"><script src="/assets/app.js"></script><script src="https://cdn.example/widget.js"></script>';
    expect(extractAssetPaths(html, 'https://portfolio.example')).toEqual([
      '/assets/app.css',
      '/assets/app.js',
    ]);
  });

  it('requires two origins and a full expected SHA', () => {
    expect(parseArguments(['--expected-sha', sourceSha])).toMatchObject({ expectedSha: sourceSha });
    expect(parseArguments([`--expected-sha=${sourceSha}`])).toMatchObject({ expectedSha: sourceSha });
    expect(() => parseArguments(['--origin', 'https://one.example']))
      .toThrow(/exactly two origins/u);
    expect(() => parseArguments([
      '--origin',
      'https://one.example',
      '--origin',
      'https://one.example',
    ])).toThrow(/two distinct origins/u);
    expect(() => parseArguments(['--expected-sha', '0123456']))
      .toThrow(/full 40-character/u);
  });
});
