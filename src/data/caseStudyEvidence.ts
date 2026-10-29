export type EvidenceLink = {
  label: {
    en: string;
    he: string;
  };
  url: string;
};

export type OutcomeClaim = {
  statement: {
    en: string;
    he: string;
  };
  support:
    | {
        kind: 'metric';
        value: string;
        label: {
          en: string;
          he: string;
        };
        source: EvidenceLink;
      }
    | {
        kind: 'source';
        value: {
          en: string;
          he: string;
        };
        label: {
          en: string;
          he: string;
        };
        source: EvidenceLink;
      }
    | {
        kind: 'boundary';
        value: {
          en: string;
          he: string;
        };
        label: {
          en: string;
          he: string;
        };
      };
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
  outcomes?: readonly OutcomeClaim[];
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

const isLocalizedTextComplete = (value: { en: string; he: string }) => (
  value.en.trim().length > 0 && value.he.trim().length > 0
);

const getEvidenceLinkErrors = (id: string, link: EvidenceLink, label: string) => {
  const errors: string[] = [];

  if (!isLocalizedTextComplete(link.label)) {
    errors.push(`${id}: ${label} requires English and Hebrew labels.`);
  }

  if (!isHttpsUrl(link.url)) {
    errors.push(`${id}: ${label} must use an https URL.`);
  }

  return errors;
};

export const getCaseStudyEvidenceErrors = (
  entries: readonly EvidenceContractEntry[],
  today = new Date(),
) => {
  const errors: string[] = [];
  const todayIso = today.toISOString().slice(0, 10);

  for (const { id, evidence, outcomes } of entries) {
    outcomes?.forEach((outcome, index) => {
      const outcomeId = `outcome ${index + 1}`;

      if (!isLocalizedTextComplete(outcome.statement)) {
        errors.push(`${id}: ${outcomeId} requires an English and Hebrew statement.`);
      }

      if (!isLocalizedTextComplete(outcome.support.label)) {
        errors.push(`${id}: ${outcomeId} requires an English and Hebrew support label.`);
      }

      if (outcome.support.kind === 'metric') {
        if (!/\d/u.test(outcome.support.value)) {
          errors.push(`${id}: ${outcomeId} metric must contain a number.`);
        }
        errors.push(...getEvidenceLinkErrors(id, outcome.support.source, `${outcomeId} source`));
      }

      if (outcome.support.kind === 'source') {
        if (!isLocalizedTextComplete(outcome.support.value)) {
          errors.push(`${id}: ${outcomeId} requires an English and Hebrew source value.`);
        }
        errors.push(...getEvidenceLinkErrors(id, outcome.support.source, `${outcomeId} source`));
      }

      if (outcome.support.kind === 'boundary' && !isLocalizedTextComplete(outcome.support.value)) {
        errors.push(`${id}: ${outcomeId} requires an English and Hebrew boundary value.`);
      }
    });

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
      errors.push(...getEvidenceLinkErrors(id, link, `evidence link ${index + 1}`));
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
