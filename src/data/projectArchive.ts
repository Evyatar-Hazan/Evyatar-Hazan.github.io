import enLocaleRaw from '../locales/en.json?raw';
import heLocaleRaw from '../locales/he.json?raw';
import type { LocalizedPathBuilder, ProjectId } from '../contracts/portfolio';
import type { EvidenceLink } from './caseStudyEvidence';
import type { PortfolioLanguage } from './portfolioCapabilities';
import { projectById, type Project } from './profile';

export const projectArchiveIds = [
  'nis_boutique',
  'online_converter',
  'emergency_protocol',
  'lev_chedva',
  'password_gen',
  'test_yourself',
  'united_hatzalah',
] as const satisfies readonly ProjectId[];

export type ProjectArchiveLifecycle = 'active' | 'maintained' | 'archived' | 'historical';

export type ProjectArchivePeriod = {
  startYear: number;
  endYear: number | null;
};

export type ProjectArchiveVerification =
  | {
      status: 'verified';
      lifecycle: ProjectArchiveLifecycle;
      verifiedAt: string;
      evidenceLinks: readonly [EvidenceLink, ...EvidenceLink[]];
    }
  | {
      status: 'undocumented';
      lifecycle: null;
      verifiedAt: null;
      evidenceLinks: null;
    };

export type ProjectArchiveMetadata = {
  id: ProjectId;
  period: ProjectArchivePeriod | null;
  verification: ProjectArchiveVerification;
};

/**
 * Lifecycle labels describe the public portfolio surface, not an ongoing
 * maintenance commitment. `active` means a linked public runtime returned a
 * successful response on the dated verification pass. `historical` means the
 * portfolio exposes a public source record but claims no current runtime.
 * Project years remain unknown until a dated source documents them.
 */
export const projectArchiveMetadata = [
  {
    id: 'nis_boutique',
    period: null,
    verification: {
      status: 'verified',
      lifecycle: 'active',
      verifiedAt: '2026-10-29',
      evidenceLinks: [{
        label: { en: 'Live product checked', he: 'המוצר החי נבדק' },
        url: 'https://nisboutiquecatering.com/',
      }],
    },
  },
  {
    id: 'online_converter',
    period: null,
    verification: {
      status: 'verified',
      lifecycle: 'active',
      verifiedAt: '2026-10-29',
      evidenceLinks: [{
        label: { en: 'Live product checked', he: 'המוצר החי נבדק' },
        url: 'https://online-converter.evyatarhazan.com/',
      }],
    },
  },
  {
    id: 'emergency_protocol',
    period: null,
    verification: {
      status: 'verified',
      lifecycle: 'active',
      verifiedAt: '2026-10-29',
      evidenceLinks: [{
        label: { en: 'Live learning product checked', he: 'מוצר הלמידה החי נבדק' },
        url: 'https://bls-protocol.evyatarhazan.com/',
      }],
    },
  },
  {
    id: 'lev_chedva',
    period: null,
    verification: {
      status: 'verified',
      lifecycle: 'active',
      verifiedAt: '2026-10-29',
      evidenceLinks: [{
        label: { en: 'Live project checked', he: 'הפרויקט החי נבדק' },
        url: 'https://lev-chedva.evyatarhazan.com/',
      }],
    },
  },
  {
    id: 'password_gen',
    period: null,
    verification: {
      status: 'verified',
      lifecycle: 'historical',
      verifiedAt: '2026-10-29',
      evidenceLinks: [{
        label: { en: 'Public source record', he: 'רשומת מקור ציבורית' },
        url: 'https://github.com/Evyatar-Hazan/password-generator',
      }],
    },
  },
  {
    id: 'test_yourself',
    period: null,
    verification: {
      status: 'verified',
      lifecycle: 'historical',
      verifiedAt: '2026-10-29',
      evidenceLinks: [{
        label: { en: 'Public source record', he: 'רשומת מקור ציבורית' },
        url: 'https://github.com/Evyatar-Hazan/test-yourself',
      }],
    },
  },
  {
    id: 'united_hatzalah',
    period: null,
    verification: {
      status: 'verified',
      lifecycle: 'active',
      verifiedAt: '2026-10-29',
      evidenceLinks: [{
        label: { en: 'Live project checked', he: 'הפרויקט החי נבדק' },
        url: 'https://hatzalah-shoham.evyatarhazan.com/',
      }],
    },
  },
] as const satisfies readonly ProjectArchiveMetadata[];

type ProjectLocaleCopy = {
  title: string;
  description: string;
  summary: string;
  role: string;
};

type ProjectArchiveLocale = {
  projects: {
    categories: Record<Project['category'], string>;
    items: Record<ProjectId, ProjectLocaleCopy>;
  };
};

const localeCopy: Record<PortfolioLanguage, ProjectArchiveLocale> = {
  en: JSON.parse(enLocaleRaw) as ProjectArchiveLocale,
  he: JSON.parse(heLocaleRaw) as ProjectArchiveLocale,
};

export type ProjectArchiveEntry = ProjectArchiveMetadata & {
  featured: boolean;
  title: string;
  description: string;
  summary: string;
  role: string;
  categoryId: Project['category'];
  category: string;
  tags: readonly string[];
  codeUrl: string;
  liveUrl: string | null;
  caseStudyUrl: string | null;
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isCalendarDate = (value: string) => {
  if (!ISO_DATE_PATTERN.test(value)) return false;

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

const isHttpsUrl = (value: string) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

export const getProjectArchiveErrors = (
  records: readonly ProjectArchiveMetadata[],
  today = new Date(),
) => {
  const errors: string[] = [];
  const todayIso = today.toISOString().slice(0, 10);
  const currentYear = today.getUTCFullYear();
  const seenIds = new Set<ProjectId>();

  for (const record of records) {
    if (seenIds.has(record.id)) {
      errors.push(`${record.id}: archive project IDs must be unique.`);
    }
    seenIds.add(record.id);

    if (record.period) {
      const { startYear, endYear } = record.period;
      if (!Number.isInteger(startYear) || startYear < 1990 || startYear > currentYear) {
        errors.push(`${record.id}: startYear must be a documented year no later than ${currentYear}.`);
      }
      if (endYear !== null && (!Number.isInteger(endYear) || endYear < startYear || endYear > currentYear)) {
        errors.push(`${record.id}: endYear must be null or a documented year between startYear and ${currentYear}.`);
      }
      if (
        endYear === null
        && record.verification.status === 'verified'
        && !['active', 'maintained'].includes(record.verification.lifecycle)
      ) {
        errors.push(`${record.id}: an open-ended period requires an active or maintained lifecycle.`);
      }
    }

    if (record.verification.status === 'undocumented') {
      if (
        record.verification.lifecycle !== null
        || record.verification.verifiedAt !== null
        || record.verification.evidenceLinks !== null
      ) {
        errors.push(`${record.id}: undocumented verification must keep lifecycle, date, and evidence null.`);
      }
      continue;
    }

    if (!isCalendarDate(record.verification.verifiedAt)) {
      errors.push(`${record.id}: verifiedAt must be a real ISO date in YYYY-MM-DD format.`);
    } else if (record.verification.verifiedAt > todayIso) {
      errors.push(`${record.id}: verifiedAt cannot be in the future.`);
    }

    if (record.verification.evidenceLinks.length === 0) {
      errors.push(`${record.id}: a verified lifecycle requires public evidence.`);
    }

    record.verification.evidenceLinks.forEach((link, index) => {
      if (!link.label.en.trim() || !link.label.he.trim()) {
        errors.push(`${record.id}: evidence link ${index + 1} requires bilingual labels.`);
      }
      if (!isHttpsUrl(link.url)) {
        errors.push(`${record.id}: evidence link ${index + 1} must use https.`);
      }
    });
  }

  const missingIds = projectArchiveIds.filter((id) => !seenIds.has(id));
  if (missingIds.length > 0) {
    errors.push(`Archive metadata is missing: ${missingIds.join(', ')}.`);
  }

  return errors;
};

export const assertProjectArchiveContract = (
  records: readonly ProjectArchiveMetadata[] = projectArchiveMetadata,
  today = new Date(),
) => {
  const errors = getProjectArchiveErrors(records, today);

  if (errors.length > 0) {
    throw new Error(`Project archive contract failed:\n${errors.join('\n')}`);
  }
};

assertProjectArchiveContract();

export const getProjectArchiveEntries = (
  language: PortfolioLanguage,
  buildLocalizedPath: LocalizedPathBuilder,
): ProjectArchiveEntry[] => projectArchiveMetadata.map((metadata) => {
  const project = projectById.get(metadata.id);
  const copy = localeCopy[language].projects.items[metadata.id];

  if (!project || !copy) {
    throw new Error(`Missing canonical archive project: ${metadata.id}`);
  }

  return {
    ...metadata,
    featured: project.featured,
    title: copy.title,
    description: copy.description,
    summary: copy.summary,
    role: copy.role,
    categoryId: project.category,
    category: localeCopy[language].projects.categories[project.category],
    tags: [...project.tags],
    codeUrl: project.githubUrl,
    liveUrl: project.liveUrl ?? null,
    caseStudyUrl: project.caseStudy
      ? buildLocalizedPath(language, { route: 'project', id: metadata.id })
      : null,
  };
});
