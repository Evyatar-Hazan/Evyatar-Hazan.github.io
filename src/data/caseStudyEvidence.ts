export type EvidenceLink = {
  label: {
    en: string;
    he: string;
  };
  url: string;
};

export type CaseStudyEvidence =
  | {
      evidenceStatus: 'verified';
      verifiedAt: string;
      evidenceLinks: readonly [EvidenceLink, ...EvidenceLink[]];
    }
  | {
      evidenceStatus: 'unknown';
      verifiedAt: null;
      evidenceLinks: null;
    };

export type EvidenceContractEntry = {
  id: string;
  evidence: CaseStudyEvidence;
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

export const getCaseStudyEvidenceErrors = (
  entries: readonly EvidenceContractEntry[],
  today = new Date(),
) => {
  const errors: string[] = [];
  const todayIso = today.toISOString().slice(0, 10);

  for (const { id, evidence } of entries) {
    if (evidence.evidenceStatus === 'unknown') {
      if (evidence.verifiedAt !== null || evidence.evidenceLinks !== null) {
        errors.push(`${id}: unknown evidence must use null for verifiedAt and evidenceLinks.`);
      }
      continue;
    }

    if (!isCalendarDate(evidence.verifiedAt)) {
      errors.push(`${id}: verifiedAt must be a real ISO date in YYYY-MM-DD format.`);
    } else if (evidence.verifiedAt > todayIso) {
      errors.push(`${id}: verifiedAt cannot be in the future.`);
    }

    if (evidence.evidenceLinks.length === 0) {
      errors.push(`${id}: verified evidence requires at least one public link.`);
    }

    evidence.evidenceLinks.forEach((link, index) => {
      if (!link.label.en.trim() || !link.label.he.trim()) {
        errors.push(`${id}: evidence link ${index + 1} requires English and Hebrew labels.`);
      }

      if (!isHttpsUrl(link.url)) {
        errors.push(`${id}: evidence link ${index + 1} must use an https URL.`);
      }
    });
  }

  return errors;
};

export const assertCaseStudyEvidenceContract = (
  entries: readonly EvidenceContractEntry[],
  today = new Date(),
) => {
  const errors = getCaseStudyEvidenceErrors(entries, today);

  if (errors.length > 0) {
    throw new Error(`Case study evidence contract failed:\n${errors.join('\n')}`);
  }
};
