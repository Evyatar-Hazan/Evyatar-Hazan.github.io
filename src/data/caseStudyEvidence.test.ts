import { describe, expect, it } from 'vitest';
import { projects } from './profile';
import {
  assertCaseStudyEvidenceContract,
  getCaseStudyEvidenceErrors,
  type CaseStudyEvidence,
  type EvidenceContractEntry,
} from './caseStudyEvidence';

const verifiedFixture: CaseStudyEvidence = {
  evidenceStatus: 'verified',
  verifiedAt: '2026-10-02',
  evidenceLinks: [
    {
      label: { en: 'Live product', he: 'המוצר החי' },
      url: 'https://example.com/product',
    },
    {
      label: { en: 'Source code', he: 'קוד מקור' },
      url: 'https://github.com/example/product',
    },
  ],
};

const errorsFor = (evidence: CaseStudyEvidence) => getCaseStudyEvidenceErrors(
  [{ id: 'fixture', evidence }],
  new Date('2026-10-02T12:00:00.000Z'),
);

describe('case study evidence contract', () => {
  it('accepts a dated fixture with bilingual labels and public https sources', () => {
    expect(() => assertCaseStudyEvidenceContract(
      [{ id: 'fixture', evidence: verifiedFixture }],
      new Date('2026-10-02T12:00:00.000Z'),
    )).not.toThrow();
  });

  it.each([
    ['a non-ISO date', { ...verifiedFixture, verifiedAt: '02/10/2026' }, 'real ISO date'],
    ['an impossible date', { ...verifiedFixture, verifiedAt: '2026-02-30' }, 'real ISO date'],
    ['a future date', { ...verifiedFixture, verifiedAt: '2026-10-03' }, 'cannot be in the future'],
    ['an empty source list', { ...verifiedFixture, evidenceLinks: [] }, 'at least one public link'],
    [
      'a non-https source',
      {
        ...verifiedFixture,
        evidenceLinks: [{ label: { en: 'Source', he: 'מקור' }, url: 'http://example.com' }],
      },
      'must use an https URL',
    ],
    [
      'a missing English label',
      {
        ...verifiedFixture,
        evidenceLinks: [{ label: { en: ' ', he: 'מקור' }, url: 'https://example.com' }],
      },
      'requires English and Hebrew labels',
    ],
    [
      'a missing Hebrew label',
      {
        ...verifiedFixture,
        evidenceLinks: [{ label: { en: 'Source', he: '' }, url: 'https://example.com' }],
      },
      'requires English and Hebrew labels',
    ],
  ])('rejects %s', (_name, evidence, expectedError) => {
    expect(errorsFor(evidence as CaseStudyEvidence)).toContainEqual(expect.stringContaining(expectedError));
  });

  it('rejects unknown evidence that carries a synthetic date or links', () => {
    const inconsistentUnknown = {
      evidenceStatus: 'unknown',
      verifiedAt: '2026-10-02',
      evidenceLinks: verifiedFixture.evidenceLinks,
    } as unknown as CaseStudyEvidence;

    expect(errorsFor(inconsistentUnknown)).toContainEqual(
      expect.stringContaining('unknown evidence must use null'),
    );
  });

  it('keeps the audited case studies explicitly unknown until Task 42 copy is approved', () => {
    const auditedIds = ['nis_boutique', 'online_converter', 'emergency_protocol'];
    const auditedEntries: EvidenceContractEntry[] = projects
      .filter((project) => auditedIds.includes(project.id))
      .flatMap((project) => (
        project.caseStudy ? [{ id: project.id, evidence: project.caseStudy }] : []
      ));

    expect(auditedEntries).toHaveLength(3);
    auditedEntries.forEach(({ evidence }) => {
      expect(evidence).toMatchObject({
        evidenceStatus: 'unknown',
        verifiedAt: null,
        evidenceLinks: null,
      });
    });
  });
});
