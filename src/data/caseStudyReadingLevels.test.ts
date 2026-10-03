import { describe, expect, it } from 'vitest';
import {
  caseStudyReadingLabels,
  caseStudyReadingProjectIds,
  caseStudyVerificationByProject,
  getCaseStudyRelatedTarget,
  isCaseStudyReadingProjectId,
} from './caseStudyReadingLevels';

describe('case study reading levels data', () => {
  it('covers every published case study without inventing verification details', () => {
    expect(caseStudyReadingProjectIds).toEqual([
      'nis_boutique',
      'online_converter',
      'emergency_protocol',
      'united_hatzalah',
    ]);

    caseStudyReadingProjectIds.forEach((projectId) => {
      expect(caseStudyVerificationByProject[projectId]).toEqual({ status: 'undocumented' });
    });
  });

  it('uses stable article IDs and falls back to the localized blog route', () => {
    expect(getCaseStudyRelatedTarget('nis_boutique')).toEqual({
      route: 'article',
      id: 'catering-whatsapp',
    });
    expect(getCaseStudyRelatedTarget('online_converter')).toEqual({
      route: 'article',
      id: 'seo-discovery-is-product-work',
    });
    expect(getCaseStudyRelatedTarget('emergency_protocol')).toEqual({
      route: 'article',
      id: 'small-project-architecture',
    });
    expect(getCaseStudyRelatedTarget('united_hatzalah')).toEqual({ route: 'blog' });
  });

  it('narrows only stable IDs that have published case-study content', () => {
    expect(isCaseStudyReadingProjectId('online_converter')).toBe(true);
    expect(isCaseStudyReadingProjectId('password_gen')).toBe(false);
    expect(isCaseStudyReadingProjectId('missing')).toBe(false);
  });

  it('keeps every reading-level label bilingual', () => {
    expect(Object.keys(caseStudyReadingLabels.en)).toEqual(Object.keys(caseStudyReadingLabels.he));
    Object.values(caseStudyReadingLabels).forEach((labels) => {
      Object.values(labels).forEach((label) => expect(label.trim()).not.toBe(''));
    });
  });
});
