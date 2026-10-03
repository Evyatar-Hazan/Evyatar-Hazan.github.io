import { describe, expect, it } from 'vitest';
import type { LocalizedPathBuilder } from '../contracts/portfolio';
import {
  getProjectArchiveEntries,
  getProjectArchiveErrors,
  projectArchiveIds,
  projectArchiveMetadata,
  type ProjectArchiveMetadata,
} from './projectArchive';

const buildLocalizedPath: LocalizedPathBuilder = (language, target) => {
  if (target.route !== 'project') throw new Error('Unexpected route target');
  return `/${language}/projects/${target.id}/`;
};

const verifiedRecord: ProjectArchiveMetadata = {
  id: 'nis_boutique',
  period: { startYear: 2025, endYear: 2026 },
  verification: {
    status: 'verified',
    lifecycle: 'maintained',
    verifiedAt: '2026-10-02',
    evidenceLinks: [
      {
        label: { en: 'Public project', he: 'פרויקט ציבורי' },
        url: 'https://example.com/project',
      },
    ],
  },
};

describe('project archive data', () => {
  it('keeps a complete, stable seven-project record without inventing dates or lifecycle states', () => {
    expect(projectArchiveIds).toEqual([
      'nis_boutique',
      'online_converter',
      'emergency_protocol',
      'lev_chedva',
      'password_gen',
      'test_yourself',
      'united_hatzalah',
    ]);
    expect(projectArchiveMetadata).toHaveLength(7);
    expect(new Set(projectArchiveMetadata.map(({ id }) => id)).size).toBe(7);
    expect(projectArchiveMetadata.every(({ period }) => period === null)).toBe(true);
    expect(projectArchiveMetadata.every(({ verification }) => (
      verification.status === 'undocumented'
      && verification.lifecycle === null
      && verification.verifiedAt === null
      && verification.evidenceLinks === null
    ))).toBe(true);
    expect(getProjectArchiveErrors(projectArchiveMetadata, new Date('2026-10-03T00:00:00.000Z'))).toEqual([]);
  });

  it.each(['en', 'he'] as const)('adapts canonical public copy and localized project routes in %s', (language) => {
    const entries = getProjectArchiveEntries(language, buildLocalizedPath);

    expect(entries).toHaveLength(7);
    expect(entries[0]).toMatchObject({
      id: 'nis_boutique',
      caseStudyUrl: `/${language}/projects/nis_boutique/`,
      codeUrl: 'https://github.com/Evyatar-Hazan/nis-boutique-catering',
      liveUrl: 'https://nisboutiquecatering.com/',
    });
    expect(entries.find(({ id }) => id === 'test_yourself')).toMatchObject({
      caseStudyUrl: null,
      liveUrl: null,
    });
    entries.forEach((entry) => {
      expect(entry.title.trim()).not.toBe('');
      expect(entry.category.trim()).not.toBe('');
      expect(entry.role.trim()).not.toBe('');
    });
  });

  it('rejects lifecycle claims without dated public evidence', () => {
    const misleadingRecord = {
      ...projectArchiveMetadata[0],
      verification: {
        status: 'verified',
        lifecycle: 'active',
        verifiedAt: '2026-10-02',
        evidenceLinks: [],
      },
    } as unknown as ProjectArchiveMetadata;

    expect(getProjectArchiveErrors(
      [misleadingRecord, ...projectArchiveMetadata.slice(1)],
      new Date('2026-10-03T00:00:00.000Z'),
    )).toContain('nis_boutique: a verified lifecycle requires public evidence.');
  });

  it.each([
    ['a future date', { ...verifiedRecord, verification: { ...verifiedRecord.verification, verifiedAt: '2026-10-04' } }],
    ['a non-HTTPS source', {
      ...verifiedRecord,
      verification: {
        ...verifiedRecord.verification,
        evidenceLinks: [{ label: { en: 'Source', he: 'מקור' }, url: 'http://example.com' }],
      },
    }],
    ['a duplicate stable ID', verifiedRecord],
  ])('rejects %s', (_label, record) => {
    const records = _label === 'a duplicate stable ID'
      ? [record, record, ...projectArchiveMetadata.slice(1)]
      : [record, ...projectArchiveMetadata.slice(1)];

    expect(getProjectArchiveErrors(
      records as readonly ProjectArchiveMetadata[],
      new Date('2026-10-03T00:00:00.000Z'),
    ).length).toBeGreaterThan(0);
  });
});
