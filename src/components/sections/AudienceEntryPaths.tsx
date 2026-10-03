import type {
  LocalizedPathBuilder,
  PortfolioSlotProps,
} from '../../contracts/portfolio';
import { getAudiencePaths } from '../../data/audiencePaths';

export type AudienceEntryPathsProps = PortfolioSlotProps & {
  buildPath: LocalizedPathBuilder;
};

const sectionCopy = {
  en: {
    label: 'Choose the path that fits your visit',
    marker: 'Audience path',
  },
  he: {
    label: 'בחרו את המסלול שמתאים לביקור שלכם',
    marker: 'מסלול קהל',
  },
} as const;

const joinClassNames = (...values: Array<string | undefined>) => values.filter(Boolean).join(' ');

export const AudienceEntryPaths = ({
  language,
  buildPath,
  className,
}: AudienceEntryPathsProps) => {
  const copy = sectionCopy[language];
  const paths = getAudiencePaths(language);

  return (
    <nav
      aria-label={copy.label}
      className={joinClassNames('audience-entry-paths', className)}
    >
      <ol className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        {paths.map((path, index) => {
          const isPrimary = path.priority === 'primary';

          return (
            <li key={path.id} data-audience-priority={path.priority}>
              <article
                className={joinClassNames(
                  'flex h-full flex-col border p-4 sm:p-5',
                  isPrimary
                    ? 'border-primary-500/70 bg-primary-500/[0.06] dark:bg-primary-500/[0.09]'
                    : 'border-neutral-300/80 bg-white/45 dark:border-neutral-800 dark:bg-neutral-950/45',
                )}
              >
                <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.14em] text-primary-700 dark:text-primary-400">
                  {copy.marker} / {String(index + 1).padStart(2, '0')}
                </p>

                <p className="mt-3 text-xs font-black uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
                  {path.audience}
                </p>

                <h2 className="mt-2 text-lg font-black leading-tight tracking-[-0.025em] text-neutral-950 dark:text-white sm:text-xl">
                  {path.title}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {path.description}
                </p>

                <a
                  href={buildPath(language, path.cta.target)}
                  className="mt-5 inline-flex min-h-11 items-center justify-between gap-4 self-start text-sm font-black text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-primary-300 dark:decoration-primary-700 dark:focus-visible:ring-offset-neutral-950"
                >
                  <span>{path.cta.label}</span>
                  <span aria-hidden="true" className="font-mono rtl:-scale-x-100">→</span>
                </a>
              </article>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AudienceEntryPaths;
