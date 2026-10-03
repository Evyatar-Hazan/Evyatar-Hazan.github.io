import { describe, expect, it } from 'vitest';
import { flagshipPortfolioProjectIds } from './portfolioProjects';
import {
  PRODUCT_VISUAL_MAX_BYTES,
  PRODUCT_VISUAL_ROUTE_MAX_BYTES,
  getProductVisualCollection,
  productVisualsByProject,
} from './productVisuals';

describe('public product visual contract', () => {
  it('provides exactly two approved public visuals for every flagship case study', () => {
    expect(Object.keys(productVisualsByProject)).toEqual([...flagshipPortfolioProjectIds]);

    flagshipPortfolioProjectIds.forEach((projectId) => {
      expect(getProductVisualCollection(projectId)?.visuals).toHaveLength(2);
    });
  });

  it('leaves the fourth featured story intact without inventing public product visuals', () => {
    expect(getProductVisualCollection('united_hatzalah')).toBeNull();
  });

  it('keeps every visual local, meaningful, traceable, and inside the route budget', () => {
    Object.values(productVisualsByProject).forEach((collection) => {
      const ids = new Set<string>();
      let routeBytes = 0;

      collection.visuals.forEach((visual) => {
        expect(visual.id.trim().length).toBeGreaterThan(8);
        expect(ids.has(visual.id)).toBe(false);
        ids.add(visual.id);

        expect(visual.src).toMatch(/^\/(?!\/)/);
        expect(visual.alt.en.trim().length).toBeGreaterThan(24);
        expect(visual.alt.he.trim().length).toBeGreaterThan(20);
        expect(visual.caption.en.trim()).not.toBe(visual.alt.en.trim());
        expect(visual.caption.he.trim()).not.toBe(visual.alt.he.trim());
        expect(visual.provenance).toMatchObject({
          kind: 'public-product-capture',
          reviewedAt: '2026-10-03',
        });
        expect(new URL(visual.provenance.sourceUrl).protocol).toBe('https:');

        expect(visual.byteSize).toBeLessThanOrEqual(PRODUCT_VISUAL_MAX_BYTES);
        routeBytes += visual.byteSize;
      });

      expect(routeBytes).toBeLessThanOrEqual(PRODUCT_VISUAL_ROUTE_MAX_BYTES);
    });
  });
});
