import { describe, expect, it } from 'vitest';
import {
  approvedPortfolioTasks,
  capabilityEvidenceBaseline,
  homepageFeaturedProjectIds,
} from './portfolio';

describe('portfolio integration contracts', () => {
  it('preserves the four canonical homepage featured projects', () => {
    expect(homepageFeaturedProjectIds).toEqual([
      'nis_boutique',
      'online_converter',
      'emergency_protocol',
      'united_hatzalah',
    ]);
  });

  it('keeps every approved task id unique', () => {
    const ids = approvedPortfolioTasks.map(({ id }) => id);
    expect(new Set(ids).size).toBe(20);
  });

  it('does not imply public proof for unverified capability groups', () => {
    expect(capabilityEvidenceBaseline.aiCv).toEqual({ status: 'unavailable', publicRefs: [] });
    expect(capabilityEvidenceBaseline.automation).toEqual({ status: 'unavailable', publicRefs: [] });
  });
});
