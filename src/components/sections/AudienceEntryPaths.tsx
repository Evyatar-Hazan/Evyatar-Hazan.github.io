import type {
  LocalizedPathBuilder,
  PortfolioSlotProps,
} from '../../contracts/portfolio';
import { getAudiencePaths } from '../../data/audiencePaths';
import { cardSurfaceClassName } from '../cardSurface';

export type AudienceEntryPathsProps = PortfolioSlotProps & {
  buildPath: LocalizedPathBuilder;
};

const sectionCopy = {
  en: {
    eyebrow: 'Start with your goal',
    title: 'What do you need to move forward?',
    description: 'Choose the route that matches your need. Each one opens a focused part of the portfolio.',
    marker: 'Start here',
  },
  he: {
    eyebrow: 'מתחילים בצורך שלכם',
    title: 'מה צריך להתקדם?',
    description: 'בחרו את המסלול שמתאים לצורך שלכם. כל אחד מוביל לחלק ממוקד באתר.',
    marker: 'מתחילים כאן',
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
      aria-labelledby="audience-entry-paths-title"
      className={joinClassNames('audience-entry-paths', className)}
    >
      <header className="audience-entry-paths__header">
        <p className="home-section-label">{copy.eyebrow}</p>
        <h2 id="audience-entry-paths-title">{copy.title}</h2>
        <p>{copy.description}</p>
      </header>

      <ol className="grid gap-3 lg:grid-cols-3">
        {paths.map((path, index) => {
          const isPrimary = path.priority === 'primary';

          return (
            <li key={path.id} data-audience-priority={path.priority}>
              <article
                className={cardSurfaceClassName(
                  'interactive',
                  joinClassNames(
                  'flex h-full flex-col p-4 sm:p-5',
                  isPrimary
                    ? 'audience-entry-card--priority'
                    : undefined,
                  ),
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
