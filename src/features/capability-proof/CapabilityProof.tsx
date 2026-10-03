import { ArrowUpRight, BookOpenText, FolderKanban } from 'lucide-react';
import type {
  LocalizedPathBuilder,
  PortfolioSlotProps,
} from '../../contracts/portfolio';
import CaseStudyEvidence from '../../components/CaseStudyEvidence';
import type { PortfolioLanguage } from '../../data/portfolioCapabilities';
import {
  getCapabilityProofGroups,
  type CapabilityDemonstration,
  type CapabilityMeasuredOutcome,
} from './capabilityProofData';

type CapabilityProofProps = PortfolioSlotProps & {
  buildPath: LocalizedPathBuilder;
};

const copy = {
  en: {
    eyebrow: 'Capability evidence',
    title: 'Trace the capability to shipped work.',
    intro: 'Projects and articles demonstrate applied practice. Measured outcomes appear separately and only when public evidence has been verified.',
    demonstrated: 'Demonstrated in',
    measured: 'Measured outcomes',
    noMeasured: 'No measured outcome is published for this capability. The references above demonstrate implementation or technical reasoning only.',
    project: 'Project',
    article: 'Article',
    evidenceSources: 'Public evidence sources',
    evidenceUnknown: 'Evidence date and public sources are not yet verified.',
    verifiedOn: 'Verified on',
  },
  he: {
    eyebrow: 'ראיות ליכולות',
    title: 'מחברים כל יכולת לעבודה שבוצעה בפועל.',
    intro: 'פרויקטים ומאמרים מדגימים פרקטיקה שיושמה. תוצאות מדידות מוצגות בנפרד ורק כאשר קיימת ראיה ציבורית מאומתת.',
    demonstrated: 'הודגם דרך',
    measured: 'תוצאות מדידות',
    noMeasured: 'לא פורסמה תוצאה מדידה עבור יכולת זו. ההפניות למעלה מדגימות מימוש או חשיבה טכנית בלבד.',
    project: 'פרויקט',
    article: 'מאמר',
    evidenceSources: 'מקורות ראיה ציבוריים',
    evidenceUnknown: 'תאריך הראיה והמקורות הציבוריים עדיין לא אומתו.',
    verifiedOn: 'אומת בתאריך',
  },
} as const;

const DemonstrationLink = ({
  demonstration,
  language,
  buildPath,
}: {
  demonstration: CapabilityDemonstration;
  language: PortfolioLanguage;
  buildPath: LocalizedPathBuilder;
}) => {
  const labels = copy[language];
  const isInternal = demonstration.kind === 'article' || demonstration.hasCaseStudy;
  const href = demonstration.kind === 'article'
    ? buildPath(language, { route: 'article', id: demonstration.id })
    : demonstration.hasCaseStudy
      ? buildPath(language, { route: 'project', id: demonstration.id })
      : demonstration.githubUrl;

  return (
    <li>
      <a
        href={href}
        {...(!isInternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="group grid min-h-24 grid-cols-[auto_1fr_auto] gap-3 border-t border-neutral-200/80 py-4 text-start transition-colors hover:border-primary-400 dark:border-neutral-800 dark:hover:border-primary-600"
      >
        <span className="mt-0.5 text-primary-600 dark:text-primary-400" aria-hidden="true">
          {demonstration.kind === 'project'
            ? <FolderKanban className="h-4 w-4" />
            : <BookOpenText className="h-4 w-4" />}
        </span>
        <span>
          <span className="block font-mono text-[0.58rem] font-black uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            {demonstration.kind === 'project' ? labels.project : labels.article}
          </span>
          <span className="mt-1 block text-sm font-black leading-snug text-neutral-950 dark:text-white">
            {demonstration.title}
          </span>
          <span className="mt-1.5 line-clamp-2 block text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            {demonstration.summary}
          </span>
        </span>
        <ArrowUpRight className="mt-0.5 h-4 w-4 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
      </a>
    </li>
  );
};

const MeasuredOutcome = ({
  outcome,
  language,
}: {
  outcome: CapabilityMeasuredOutcome;
  language: PortfolioLanguage;
}) => {
  const labels = copy[language];

  return (
    <li className="border-t border-success-200/80 py-4 dark:border-success-950">
      <span className="text-sm font-black text-neutral-950 dark:text-white">{outcome.projectTitle}</span>
      <CaseStudyEvidence
        evidence={outcome.evidence}
        language={language}
        labels={{
          sources: labels.evidenceSources,
          unknown: labels.evidenceUnknown,
          verifiedOn: labels.verifiedOn,
        }}
      />
    </li>
  );
};

export const CapabilityProof = ({ language, className = '', buildPath }: CapabilityProofProps) => {
  const labels = copy[language];
  const groups = getCapabilityProofGroups(language);

  return (
    <section
      aria-labelledby="capability-proof-title"
      className={`bg-neutral-50 px-5 py-16 text-neutral-950 dark:bg-neutral-950 dark:text-white sm:px-8 lg:px-12 ${className}`.trim()}
    >
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-5 border-b border-neutral-300 pb-8 dark:border-neutral-800 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-primary-700 dark:text-primary-400">
              {labels.eyebrow} / 07
            </p>
            <h2 id="capability-proof-title" className="mt-3 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
              {labels.title}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-neutral-600 dark:text-neutral-300 sm:text-base">
            {labels.intro}
          </p>
        </header>

        <div className="divide-y divide-neutral-300 dark:divide-neutral-800">
          {groups.map((group, index) => (
            <article
              key={group.id}
              data-capability-id={group.id}
              className="grid gap-8 py-10 lg:grid-cols-[minmax(13rem,0.65fr)_minmax(18rem,1fr)_minmax(18rem,0.85fr)]"
            >
              <header>
                <p className="font-mono text-[0.62rem] font-black tracking-[0.18em] text-primary-700 dark:text-primary-400">
                  {String(index + 1).padStart(2, '0')} / 07
                </p>
                <h3 className="mt-3 text-xl font-black tracking-tight">{group.label}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{group.description}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={group.label}>
                  {group.skills.map((skill) => (
                    <li key={skill} className="border border-neutral-300 px-2 py-1 font-mono text-[0.58rem] font-bold uppercase tracking-[0.05em] text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
                      {skill}
                    </li>
                  ))}
                </ul>
              </header>

              <div>
                <h4 className="font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-300">
                  {labels.demonstrated}
                </h4>
                {group.demonstrations.length > 0 ? (
                  <ul className="mt-3 grid gap-x-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {group.demonstrations.map((demonstration) => (
                      <DemonstrationLink
                        key={`${demonstration.kind}:${demonstration.id}`}
                        demonstration={demonstration}
                        language={language}
                        buildPath={buildPath}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 border-s-2 border-warning-300 ps-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                    {group.publicEvidenceGap}
                  </p>
                )}
                {group.demonstrations.length > 0 && group.publicEvidenceGap && (
                  <p className="mt-4 border-s-2 border-warning-300 ps-4 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                    {group.publicEvidenceGap}
                  </p>
                )}
              </div>

              <div className="border-s border-neutral-300 ps-5 dark:border-neutral-800">
                <h4 className="font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-300">
                  {labels.measured}
                </h4>
                {group.measuredOutcomes.length > 0 ? (
                  <ul className="mt-3">
                    {group.measuredOutcomes.map((outcome) => (
                      <MeasuredOutcome
                        key={outcome.projectId}
                        outcome={outcome}
                        language={language}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 border-t border-neutral-200 pt-4 text-sm leading-6 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    {labels.noMeasured}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilityProof;
