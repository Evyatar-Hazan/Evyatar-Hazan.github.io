import { describe, expect, it } from 'vitest';
import { PNG } from 'pngjs';
import {
  buildVisualMatrix,
  classifyVisualDifference,
  comparePngBuffers,
  MAX_DIMENSION_DELTA,
  SIGNIFICANT_DIFF_RATIO,
} from './run-visual-regression.mjs';

const png = (width: number, height: number, color: [number, number, number, number]) => {
  const image = new PNG({ width, height });
  for (let offset = 0; offset < image.data.length; offset += 4) {
    image.data.set(color, offset);
  }
  return PNG.sync.write(image);
};

describe('FIX-002 visual regression gate', () => {
  it('covers the five smoke routes across language, direction, theme, and viewport modes', () => {
    const matrix = buildVisualMatrix();
    expect(matrix).toHaveLength(20);
    expect(new Set(matrix.map(({ path }) => path))).toEqual(new Set([
      '/', '/projects/', '/about/', '/blog/', '/contact/',
    ]));
    expect(new Set(matrix.map(({ language }) => language))).toEqual(new Set(['en', 'he']));
    expect(new Set(matrix.map(({ theme }) => theme))).toEqual(new Set(['light', 'dark']));
    expect(new Set(matrix.map(({ viewport }) => `${viewport.width}x${viewport.height}`)))
      .toEqual(new Set(['1440x900', '390x844']));
  });

  it('does not classify small pixel noise as significant', () => {
    const result = classifyVisualDifference({
      diffPixels: 99,
      totalPixels: 10_000,
      baselineWidth: 100,
      baselineHeight: 100,
      candidateWidth: 100,
      candidateHeight: 100,
    });
    expect(result.ratio).toBeLessThan(SIGNIFICANT_DIFF_RATIO);
    expect(result.significant).toBe(false);
  });

  it('classifies a meaningful pixel ratio or layout-size drift as significant', () => {
    expect(classifyVisualDifference({
      diffPixels: 101,
      totalPixels: 10_000,
      baselineWidth: 100,
      baselineHeight: 100,
      candidateWidth: 100,
      candidateHeight: 100,
    }).significant).toBe(true);
    expect(classifyVisualDifference({
      diffPixels: 0,
      totalPixels: 10_000,
      baselineWidth: 100,
      baselineHeight: 100,
      candidateWidth: 100,
      candidateHeight: 100 + MAX_DIMENSION_DELTA + 1,
    }).significant).toBe(true);
  });

  it('produces a real diff image for significant changes', () => {
    const comparison = comparePngBuffers(
      png(20, 20, [255, 255, 255, 255]),
      png(20, 20, [0, 0, 0, 255]),
    );
    expect(comparison.significant).toBe(true);
    expect(comparison.diffPixels).toBe(400);
    const diff = PNG.sync.read(comparison.diffBuffer);
    expect(diff.width).toBe(20);
    expect(diff.height).toBe(20);
  });
});
