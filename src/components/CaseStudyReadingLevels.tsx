import { ArrowLeft, ChevronDown, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LocalizedPathBuilder } from '../contracts/portfolio';
import {
  caseStudyReadingLabels,
  caseStudyVerificationByProject,
  getCaseStudyRelatedTarget,
  type CaseStudyReadingProjectId,
  type CaseStudyVerification,
} from '../data/caseStudyReadingLevels';
import type { ProjectCaseStudy } from '../data/profile';
import type { PortfolioLanguage } from '../data/portfolioCapabilities';
import CaseStudyEvidence from './CaseStudyEvidence';

export type CaseStudyReadingLevelsProps = {
  language: PortfolioLanguage;
  projectId: CaseStudyReadingProjectId;
  buildLocalizedPath: LocalizedPathBuilder;
  caseStudy: ProjectCaseStudy;
  problem: string;
  solution: string;
  impact: string;
  role: string;
  githubUrl: string;
  liveUrl?: string;
  verification?: CaseStudyVerification;
  className?: string;
};

const linkClassName = 'inline-flex min-h-11 items-center justify-center gap-2 border border-neutral-300 bg-white px-4 py-2.5 text-sm font-bold text-neutral-800 transition-[border-color,color,background-color] hover:border-primary-500 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:text-primary-300 dark:focus-visible:ring-offset-black';

const pick = <Value,>(value: Record<PortfolioLanguage, Value>, language: PortfolioLanguage) => (
  value[language]
);

const CaseStudyReadingLevels = ({
  language,
  projectId,
  buildLocalizedPath,
  caseStudy,
  problem,
  solution,
  impact,
  role,
  githubUrl,
  liveUrl,
  verification = caseStudyVerificationByProject[projectId],
  className = '',
}: CaseStudyReadingLevelsProps) => {
  const labels = caseStudyReadingLabels[language];
  const overview = pick(caseStudy.overview, language);
  const decisions = pick(caseStudy.decisions, language);
  const outcomes = pick(caseStudy.outcomes, language);
  const verificationItems = verification.status === 'documented'
    && caseStudy.evidenceStatus === 'verified'
    ? pick(verification.items, language)
    : null;
  const headingId = `case-reading-${projectId}`;
  const detailId = `case-reading-${projectId}-details`;
  const projectsPath = buildLocalizedPath(language, { route: 'projects' });
  const relatedWritingPath = buildLocalizedPath(
    language,
    getCaseStudyRelatedTarget(projectId),
  );

  const summaryItems = [
    { label: labels.challenge, value: problem },
    { label: labels.approach, value: solution },
    { label: labels.outcome, value: impact },
    { label: labels.contribution, value: role },
  ];

  return (
    <section
      aria-labelledby={headingId}
      className={`border-y border-neutral-200 py-10 dark:border-neutral-800 ${className}`.trim()}
      data-case-reading-levels={projectId}
    >
      <header className="max-w-3xl">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary-600 dark:text-primary-300">
          {labels.eyebrow}
        </p>
        <h2 id={headingId} className="mt-3 text-3xl font-black tracking-tight text-neutral-950 dark:text-white">
          {labels.summaryTitle}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          {labels.summaryDescription}
        </p>
      </header>

      <dl className="mt-8 grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 sm:grid-cols-2 dark:border-neutral-800 dark:bg-neutral-800">
        {summaryItems.map((item) => (
          <div key={item.label} className="bg-white p-5 dark:bg-black">
            <dt className="text-xs font-black uppercase tracking-[0.16em] text-primary-600 dark:text-primary-300">
              {item.label}
            </dt>
            <dd className="mt-3 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950/60">
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-neutral-950 dark:text-white">
            {labels.audience}
          </h3>
          <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
            {pick(caseStudy.audience, language)}
          </p>
        </section>

        <section className="border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950/60">
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-neutral-950 dark:text-white">
            {labels.proof}
          </h3>
          <p className="mt-3 leading-relaxed text-neutral-700 dark:text-neutral-300">
            {pick(caseStudy.proof, language)}
          </p>
          <CaseStudyEvidence
            evidence={caseStudy}
            language={language}
            labels={{
              sources: labels.evidenceSources,
              unknown: labels.evidenceUnknown,
              verifiedOn: labels.evidenceVerifiedOn,
            }}
          />
        </section>
      </div>

      <nav aria-label={labels.actions} className="mt-6 flex flex-wrap gap-3">
        <Link to={projectsPath} className={linkClassName}>
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          {labels.backToProjects}
        </Link>
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          <Github className="h-4 w-4" aria-hidden="true" />
          {labels.sourceCode}
        </a>
        {liveUrl && (
          <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            {labels.liveProduct}
          </a>
        )}
        <Link to={relatedWritingPath} className={linkClassName}>
          {labels.relatedWriting}
        </Link>
      </nav>

      <details className="group mt-8 border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-black">
        <summary
          aria-controls={detailId}
          className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 [&::-webkit-details-marker]:hidden"
        >
          <span>
            <span className="block text-base font-black text-neutral-950 group-open:hidden dark:text-white">
              {labels.openFull}
            </span>
            <span className="hidden text-base font-black text-neutral-950 group-open:block dark:text-white">
              {labels.closeFull}
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {labels.fullDescription}
            </span>
          </span>
          <ChevronDown
            className="h-5 w-5 shrink-0 text-primary-600 transition-transform duration-200 group-open:rotate-180 dark:text-primary-300"
            aria-hidden="true"
          />
        </summary>

        <div id={detailId} className="border-t border-neutral-200 px-5 py-7 dark:border-neutral-800">
          <section aria-labelledby={`${detailId}-context`}>
            <h3 id={`${detailId}-context`} className="text-xl font-black text-neutral-950 dark:text-white">
              {labels.context}
            </h3>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
              {overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </section>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <section aria-labelledby={`${detailId}-decisions`}>
              <h3 id={`${detailId}-decisions`} className="text-xl font-black text-neutral-950 dark:text-white">
                {labels.decisions}
              </h3>
              <ul className="mt-4 list-disc space-y-3 ps-5 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {decisions.map((decision) => <li key={decision}>{decision}</li>)}
              </ul>
            </section>

            <section aria-labelledby={`${detailId}-outcomes`}>
              <h3 id={`${detailId}-outcomes`} className="text-xl font-black text-neutral-950 dark:text-white">
                {labels.outcomes}
              </h3>
              <ul className="mt-4 list-disc space-y-3 ps-5 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
              </ul>
            </section>
          </div>

          <section
            aria-labelledby={`${detailId}-verification`}
            className="mt-8 border-s-4 border-primary-500 bg-primary-50/60 p-5 dark:bg-primary-950/20"
          >
            <h3 id={`${detailId}-verification`} className="text-xl font-black text-neutral-950 dark:text-white">
              {labels.verification}
            </h3>
            {verificationItems ? (
              <ul className="mt-4 list-disc space-y-3 ps-5 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {verificationItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : (
              <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                {labels.verificationUndocumented}
              </p>
            )}
          </section>
        </div>
      </details>
    </section>
  );
};

export default CaseStudyReadingLevels;
