import { describe, expect, it } from 'vitest';
import {
  getServiceEngagements,
  serviceEngagementIds,
  serviceEngagements,
} from './serviceEngagements';

const flattenStrings = (value: unknown): string[] => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(flattenStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(flattenStrings);
  return [];
};

describe('service engagement content', () => {
  it('keeps exactly the three approved engagement types in stable order', () => {
    expect(serviceEngagements.map(({ id }) => id)).toEqual(serviceEngagementIds);
    expect(serviceEngagements).toHaveLength(3);
  });

  it.each(['en', 'he'] as const)('provides complete audience, deliverables, proof, and CTA content in %s', (language) => {
    const localized = getServiceEngagements(language);

    localized.forEach((engagement) => {
      expect(engagement.title.trim()).not.toBe('');
      expect(engagement.audience.trim()).not.toBe('');
      expect(engagement.deliverables.length).toBeGreaterThanOrEqual(3);
      engagement.deliverables.forEach((deliverable) => expect(deliverable.trim()).not.toBe(''));
      expect(engagement.proof.summary.trim()).not.toBe('');
      expect(engagement.proof.label.trim()).not.toBe('');
      expect(engagement.cta.label.trim()).not.toBe('');
      expect(engagement.cta.target).toEqual({ route: 'contact' });
    });
  });

  it('grounds each engagement in the approved relevant project proof', () => {
    expect(serviceEngagements.map(({ proof }) => proof.projectId)).toEqual([
      'nis_boutique',
      'emergency_protocol',
      'online_converter',
    ]);
  });

  it('does not introduce prices, guarantees, timelines, or customer commitments', () => {
    const copy = flattenStrings(serviceEngagements).join(' ').toLocaleLowerCase();
    const forbiddenClaims = [
      /\bprice(?:s|d|ing)?\b/,
      /\bcost(?:s)?\b/,
      /\bguarantee(?:d|s)?\b/,
      /\bwithin \d+ (?:day|week|month)s?\b/,
      /\bwe (?:will|commit|promise)\b/,
      /מחיר/,
      /מובטח/,
      /התחייבות/,
      /תוך \d+ (?:ימים|שבועות|חודשים)/,
    ];

    forbiddenClaims.forEach((claim) => expect(copy).not.toMatch(claim));
  });
});
