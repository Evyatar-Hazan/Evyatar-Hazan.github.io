import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type {
  LocalizedPathBuilder,
  PortfolioSlotProps,
} from '../../contracts/portfolio';
import {
  routeTargetForPrincipleRef,
  workingPrinciples,
  workingPrinciplesCopy,
  type WorkingPrincipleEvidence,
} from '../../data/workingPrinciples';

type WorkingPrinciplesProps = PortfolioSlotProps & {
  localizedPath: LocalizedPathBuilder;
};

const localized = <Value extends { en: string; he: string }>(
  value: Value,
  language: PortfolioSlotProps['language'],
) => value[language];

type EvidenceBlockProps = {
  evidence: WorkingPrincipleEvidence;
  label: string;
  language: PortfolioSlotProps['language'];
  localizedPath: LocalizedPathBuilder;
  tone: 'example' | 'exception';
};

const EvidenceBlock = ({
  evidence,
  label,
  language,
  localizedPath,
  tone,
}: EvidenceBlockProps) => {
  const ArrowIcon = language === 'he' ? ArrowLeft : ArrowRight;

  return (
    <div
      className={`border-s-2 ps-4 sm:ps-5 ${
        tone === 'example'
          ? 'border-primary-500'
          : 'border-neutral-300 dark:border-neutral-700'
      }`}
    >
      <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
      <p className="mt-2 max-w-[58ch] text-sm leading-7 text-neutral-700 dark:text-neutral-300 sm:text-base">
        {localized(evidence.copy, language)}
      </p>
      <Link
        to={localizedPath(language, routeTargetForPrincipleRef(evidence.ref))}
        className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-black text-primary-700 underline decoration-primary-500/40 underline-offset-4 transition-colors hover:text-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-50 dark:text-primary-300 dark:focus-visible:ring-offset-neutral-950"
      >
        {localized(evidence.linkLabel, language)}
        <ArrowIcon aria-hidden="true" className="h-4 w-4" />
      </Link>
    </div>
  );
};

const WorkingPrinciples = ({
  language,
  localizedPath,
  className = '',
}: WorkingPrinciplesProps) => (
  <section
    id="working-principles"
    aria-labelledby="working-principles-title"
    className={`relative overflow-hidden border-y border-neutral-200/80 bg-neutral-50 px-5 py-20 dark:border-neutral-800/80 dark:bg-neutral-950 sm:px-8 sm:py-28 lg:px-12 ${className}`.trim()}
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--color-neutral-300)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-300)_1px,transparent_1px)] [background-size:3.5rem_3.5rem] [mask-image:linear-gradient(to_bottom,black,transparent_78%)] dark:opacity-15"
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -end-4 top-8 font-mono text-[8rem] font-black leading-none tracking-[-0.1em] text-neutral-900/[0.035] dark:text-white/[0.045] sm:end-8 sm:text-[13rem]"
    >
      04
    </span>

    <div className="relative mx-auto max-w-[1480px]">
      <header className="grid gap-8 border-b border-neutral-300/80 pb-10 dark:border-neutral-800 md:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] md:items-end md:gap-12">
        <div>
          <p className="flex items-center gap-3 font-mono text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary-700 dark:text-primary-400">
            <span aria-hidden="true" className="h-px w-10 bg-primary-500" />
            {localized(workingPrinciplesCopy.eyebrow, language)}
          </p>
          <h2
            id="working-principles-title"
            className="mt-5 max-w-[15ch] text-[clamp(2.5rem,6vw,5.8rem)] font-black leading-[0.92] tracking-[-0.055em] text-neutral-950 dark:text-white"
          >
            {localized(workingPrinciplesCopy.title, language)}
          </h2>
        </div>
        <p className="max-w-[58ch] border-s-2 border-primary-500 ps-5 text-base leading-8 text-neutral-700 dark:text-neutral-300 sm:text-lg">
          {localized(workingPrinciplesCopy.introduction, language)}
        </p>
      </header>

      <ol className="divide-y divide-neutral-300/80 dark:divide-neutral-800">
        {workingPrinciples.map((principle, index) => (
          <li key={principle.id} data-principle-id={principle.id}>
            <article className="grid gap-7 py-10 sm:py-12 lg:grid-cols-[6rem_minmax(15rem,0.72fr)_minmax(0,1.28fr)] lg:gap-10 lg:py-16">
              <div className="flex items-center justify-between gap-4 lg:block">
                <span className="font-mono text-4xl font-black tracking-[-0.06em] text-primary-600 dark:text-primary-400 sm:text-5xl">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-neutral-300 dark:bg-neutral-800 lg:mt-5 lg:block lg:w-full" />
              </div>

              <div>
                <h3 className="max-w-[18ch] text-2xl font-black leading-tight tracking-[-0.025em] text-neutral-950 dark:text-white sm:text-3xl">
                  {localized(principle.title, language)}
                </h3>
                <p className="mt-4 max-w-[48ch] text-base leading-8 text-neutral-600 dark:text-neutral-400">
                  {localized(principle.position, language)}
                </p>
              </div>

              <div className="grid gap-7 md:grid-cols-2 md:gap-6 lg:gap-8">
                <EvidenceBlock
                  evidence={principle.example}
                  label={localized(workingPrinciplesCopy.exampleLabel, language)}
                  language={language}
                  localizedPath={localizedPath}
                  tone="example"
                />
                <EvidenceBlock
                  evidence={principle.exception}
                  label={localized(workingPrinciplesCopy.exceptionLabel, language)}
                  language={language}
                  localizedPath={localizedPath}
                  tone="exception"
                />
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export type { WorkingPrinciplesProps };
export default WorkingPrinciples;
