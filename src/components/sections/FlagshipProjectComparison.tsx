import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type {
  LocalizedPathBuilder,
  PortfolioSlotProps,
} from '../../contracts/portfolio';
import {
  flagshipProjectComparisonCopy,
  flagshipProjectComparisonRecords,
  type FlagshipProjectComparisonRecord,
} from '../../data/flagshipProjectComparison';

export type FlagshipProjectComparisonProps = PortfolioSlotProps & {
  buildPath: LocalizedPathBuilder;
  records?: readonly FlagshipProjectComparisonRecord[];
};

const fieldClassName =
  'min-w-0 border-t border-neutral-200 pt-3 dark:border-neutral-800 lg:border-t-0 lg:pt-0';
const mobileLabelClassName =
  'mb-1 block font-mono text-[0.6rem] font-black uppercase tracking-[0.12em] text-primary-700 dark:text-primary-400 lg:sr-only';

const FlagshipProjectComparison = ({
  language,
  buildPath,
  records = flagshipProjectComparisonRecords,
  className = '',
}: FlagshipProjectComparisonProps) => {
  const labels = flagshipProjectComparisonCopy[language];

  return (
    <section
      aria-labelledby="flagship-comparison-title"
      className={`relative mx-auto w-full max-w-[1480px] px-5 pb-14 sm:px-8 sm:pb-16 lg:px-12 ${className}`.trim()}
      data-portfolio-slot="projects.flagshipComparison"
    >
      <div className="border border-neutral-300/80 bg-white/65 p-5 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/65 md:p-7">
        <header className="grid gap-3 border-b border-neutral-300/80 pb-5 dark:border-neutral-800 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] text-primary-700 dark:text-primary-400">
              {labels.eyebrow}
            </p>
            <h3
              id="flagship-comparison-title"
              className="mt-2 text-2xl font-black tracking-tight text-neutral-950 dark:text-white sm:text-3xl"
            >
              {labels.title}
            </h3>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">
            {labels.introduction}
          </p>
        </header>

        <div
          aria-hidden="true"
          className="hidden grid-cols-[minmax(10rem,0.8fr)_repeat(4,minmax(0,1fr))_minmax(7rem,auto)] gap-5 border-b border-neutral-300/80 py-4 font-mono text-[0.58rem] font-black uppercase tracking-[0.12em] text-neutral-500 dark:border-neutral-800 lg:grid"
        >
          <span>{labels.project}</span>
          <span>{labels.audience}</span>
          <span>{labels.problem}</span>
          <span>{labels.contribution}</span>
          <span>{labels.evidence}</span>
          <span>{labels.deepLink}</span>
        </div>

        <ul aria-label={labels.title}>
          {records.map((record, index) => {
            const title = record.title[language];

            return (
              <li
                key={record.id}
                className="grid gap-4 border-b border-neutral-300/80 py-6 last:border-b-0 dark:border-neutral-800 lg:grid-cols-[minmax(10rem,0.8fr)_repeat(4,minmax(0,1fr))_minmax(7rem,auto)] lg:gap-5 lg:py-5"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 font-mono text-[0.58rem] font-black text-primary-600 dark:text-primary-400"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4 className="text-base font-black leading-snug text-neutral-950 dark:text-white">
                    {title}
                  </h4>
                </div>

                <div className={fieldClassName}>
                  <span className={mobileLabelClassName}>{labels.audience}</span>
                  <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {record.audience[language]}
                  </p>
                </div>

                <div className={fieldClassName}>
                  <span className={mobileLabelClassName}>{labels.problem}</span>
                  <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {record.problem[language]}
                  </p>
                </div>

                <div className={fieldClassName}>
                  <span className={mobileLabelClassName}>{labels.contribution}</span>
                  <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {record.contribution[language]}
                  </p>
                </div>

                <div className={fieldClassName}>
                  <span className={mobileLabelClassName}>{labels.evidence}</span>
                  <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {record.evidence[language]}
                  </p>
                </div>

                <div className={`${fieldClassName} lg:flex lg:justify-end`}>
                  <span className={mobileLabelClassName}>{labels.deepLink}</span>
                  <Link
                    to={buildPath(language, { route: 'project', id: record.id })}
                    className="inline-flex min-h-10 items-center justify-center gap-2 border border-primary-600 px-3 text-xs font-black text-primary-700 transition-colors hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-primary-300 dark:hover:bg-primary-950/40 dark:focus-visible:ring-offset-neutral-950"
                  >
                    {labels.openProject(title)}
                    <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default FlagshipProjectComparison;
