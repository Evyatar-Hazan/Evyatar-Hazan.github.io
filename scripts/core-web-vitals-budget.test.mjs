import { describe, expect, it } from 'vitest';
import { assessMeasurements, percentile, validateBudget } from './core-web-vitals-budget.mjs';

const budget = {
  schemaVersion: 1,
  approvedTask: 'FIX-093',
  percentile: 0.75,
  samplesPerRoute: 5,
  viewport: { width: 390, height: 844 },
  cpuSlowdownMultiplier: 2,
  network: { latencyMs: 40, downloadKbps: 10000, uploadKbps: 5000 },
  thresholds: { LCP: 2500, CLS: 0.1, INP: 250 },
  routeThresholds: {},
  routes: ['/en/'],
};

describe('Core Web Vitals budget', () => {
  it('uses the nearest-rank p75 so one noisy sample does not fail five runs', () => {
    expect(percentile([1100, 1200, 1300, 1400, 9000], 0.75)).toBe(1400);
  });

  it('requires an explicit FIX-093 budget with every Core Web Vital', () => {
    expect(validateBudget(budget)).toBe(budget);
    expect(() => validateBudget({ ...budget, thresholds: { LCP: 2500, CLS: 0.1 } }))
      .toThrow('thresholds.INP must be positive');
  });

  it('fails a route when its p75 exceeds any approved threshold', () => {
    const assessment = assessMeasurements(budget, [{
      route: '/en/',
      samples: [
        { LCP: 1000, CLS: 0.01, INP: 110 },
        { LCP: 1100, CLS: 0.02, INP: 120 },
        { LCP: 1200, CLS: 0.03, INP: 130 },
        { LCP: 1300, CLS: 0.04, INP: 260 },
        { LCP: 9000, CLS: 0.9, INP: 900 },
      ],
    }]);

    expect(assessment.passed).toBe(false);
    expect(assessment.routes[0].failures).toEqual([{ metric: 'INP', measured: 260, threshold: 250 }]);
  });

  it('applies a documented route baseline without weakening other routes', () => {
    const assessment = assessMeasurements({
      ...budget,
      routeThresholds: { '/en/': { CLS: 0.7 } },
    }, [{
      route: '/en/',
      samples: Array.from({ length: 5 }, () => ({ LCP: 1000, CLS: 0.65, INP: 100 })),
    }]);

    expect(assessment.passed).toBe(true);
    expect(assessment.routes[0].thresholds).toEqual({ LCP: 2500, CLS: 0.7, INP: 250 });
  });
});
