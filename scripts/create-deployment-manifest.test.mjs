import { describe, expect, it } from 'vitest';
import {
  createDeploymentManifest,
  normalizeSourceSha,
} from './create-deployment-manifest.mjs';

describe('FIX-009 deployment manifest', () => {
  const sourceSha = '0123456789abcdef0123456789abcdef01234567';

  it('requires a full Git SHA', () => {
    expect(normalizeSourceSha(sourceSha.toUpperCase())).toBe(sourceSha);
    expect(() => normalizeSourceSha('0123456')).toThrow(/full 40-character Git SHA/u);
  });

  it('sorts public assets into a deterministic manifest', () => {
    expect(createDeploymentManifest({
      sourceSha,
      assets: [
        { assetPath: 'project.webp', bytes: 20, hash: 'b'.repeat(64) },
        { assetPath: '/assets/app.js', bytes: 10, hash: 'a'.repeat(64) },
      ],
    })).toEqual({
      schemaVersion: 1,
      sourceSha,
      assets: [
        { path: '/assets/app.js', bytes: 10, sha256: 'a'.repeat(64) },
        { path: '/project.webp', bytes: 20, sha256: 'b'.repeat(64) },
      ],
    });
  });
});
