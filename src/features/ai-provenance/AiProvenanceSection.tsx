import { ArrowUpRight, Bot, CheckCircle2, ShieldAlert, Wrench } from 'lucide-react';
import type { ComponentType } from 'react';
import type {
  LocalizedPathBuilder,
  PortfolioSlotProps,
} from '../../contracts/portfolio';
import CaseStudyEvidence from '../../components/CaseStudyEvidence';
import {
  AI_PROVENANCE_PROJECT_ID,
  AI_PROVENANCE_SLOT_ID,
  AI_PROVENANCE_TASK_ID,
  aiProvenanceCopy,
  aiProvenanceEvidence,
  aiProvenanceItems,
  type AiProvenanceItemId,
  type AiProvenanceMode,
} from './aiProvenance';

type AiProvenanceSectionProps = PortfolioSlotProps & {
  buildPath: LocalizedPathBuilder;
  mode?: AiProvenanceMode;
};

const itemIcons: Record<AiProvenanceItemId, ComponentType<{ className?: string }>> = {
  assistance: Bot,
  humanChecks: CheckCircle2,
  corrections: Wrench,
  limitations: ShieldAlert,
};

const AiProvenanceSection = ({
  buildPath,
  className = '',
  language,
  mode = 'full',
}: AiProvenanceSectionProps) => {
  const copy = aiProvenanceCopy;
  const projectPath = buildPath(language, {
    route: 'project',
    id: AI_PROVENANCE_PROJECT_ID,
  });

  return (
    <section
      aria-labelledby="ai-provenance-title"
      className={`rounded-3xl border border-neutral-200 bg-neutral-50/80 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/70 md:p-8 ${className}`.trim()}
      data-portfolio-slot={AI_PROVENANCE_SLOT_ID}
      data-project-id={AI_PROVENANCE_PROJECT_ID}
      data-task-id={AI_PROVENANCE_TASK_ID}
    >
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600 dark:text-primary-300">
          {copy.eyebrow[language]}
        </p>
        <h2
          id="ai-provenance-title"
          className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white md:text-3xl"
        >
          {copy.title[language]}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
          {copy.introduction[language]}
        </p>
      </div>

      <dl className={`mt-8 grid gap-4 ${mode === 'full' ? 'md:grid-cols-2' : ''}`}>
        {aiProvenanceItems.map((item) => {
          const Icon = itemIcons[item.id];

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-black/40"
              data-provenance-item={item.id}
            >
              <dt className="flex items-center gap-3 text-sm font-bold text-neutral-950 dark:text-white">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {item.label[language]}
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {item[mode][language]}
              </dd>
            </div>
          );
        })}
      </dl>

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-black/40">
        <CaseStudyEvidence
          evidence={aiProvenanceEvidence}
          language={language}
          labels={{
            sources: copy.evidence.sources[language],
            unknown: copy.evidence.unknown[language],
            verifiedOn: copy.evidence.verifiedOn[language],
          }}
        />

        <a
          href={projectPath}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-300"
        >
          {copy.projectLink[language]}
          <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
};

export default AiProvenanceSection;
