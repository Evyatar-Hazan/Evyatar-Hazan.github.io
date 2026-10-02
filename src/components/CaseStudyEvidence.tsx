import { ExternalLink } from 'lucide-react';
import type { CaseStudyEvidence as CaseStudyEvidenceData } from '../data/caseStudyEvidence';

type CaseStudyEvidenceLabels = {
  sources: string;
  unknown: string;
  verifiedOn: string;
};

type CaseStudyEvidenceProps = {
  evidence: CaseStudyEvidenceData;
  labels: CaseStudyEvidenceLabels;
  language: string;
};

const formatEvidenceDate = (date: string, language: string) => (
  new Intl.DateTimeFormat(language.startsWith('he') ? 'he-IL' : 'en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00.000Z`))
);

const CaseStudyEvidence = ({ evidence, labels, language }: CaseStudyEvidenceProps) => {
  if (evidence.evidenceStatus === 'unknown') {
    return (
      <p className="mt-4 border-t border-neutral-200 pt-4 text-sm leading-relaxed text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        {labels.unknown}
      </p>
    );
  }

  return (
    <div
      aria-label={labels.sources}
      className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800"
    >
      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
        {labels.verifiedOn}{' '}
        <time dateTime={evidence.verifiedAt}>
          {formatEvidenceDate(evidence.verifiedAt, language)}
        </time>
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2" aria-label={labels.sources}>
        {evidence.evidenceLinks.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-300"
            >
              {language.startsWith('he') ? link.label.he : link.label.en}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CaseStudyEvidence;
