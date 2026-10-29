import { describe, expect, it } from 'vitest';
import {
  approvedPortfolioTasks,
  capabilityEvidenceBaseline,
  homepageFeaturedProjectIds,
  homepageSectionPurposes,
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

  it('documents one unique purpose for every homepage section', () => {
    const ids = homepageSectionPurposes.map(({ id }) => id);
    const roles = homepageSectionPurposes.map(({ role }) => role);
    const purposes = homepageSectionPurposes.map(({ purpose }) => purpose);

    expect(ids).toEqual(['home', 'projects', 'writing', 'contact']);
    expect(new Set(roles).size).toBe(roles.length);
    expect(purposes.every(Boolean)).toBe(true);
  });

  it('does not imply public proof for unverified capability groups', () => {
    expect(capabilityEvidenceBaseline.aiCv).toEqual({ status: 'unavailable', publicRefs: [] });
    expect(capabilityEvidenceBaseline.automation).toEqual({ status: 'unavailable', publicRefs: [] });
  });
});
