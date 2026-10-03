import { useId } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPostMetadata } from '../../content/blog/metadata';
import type {
  LocalizedPathBuilder,
  PortfolioRouteTarget,
  PortfolioSlotProps,
  ProjectId,
} from '../../contracts/portfolio';
import { getFlagshipPortfolioProjects } from '../../data/portfolioProjects';
import { curatedReadingRoutes, type ReadingRouteContentRef } from './curatedReadingRoutes';

export type CuratedReadingRoutesProps = PortfolioSlotProps & {
  buildPath: LocalizedPathBuilder;
};

const uiCopy = {
  en: {
    eyebrow: 'Guided reading',
    heading: 'Choose a deliberate route through the work',
    intro: 'Three hand-curated sequences connect practical articles and public project evidence. They are fixed editorial paths, not personalized recommendations.',
    start: 'Start here', finish: 'Finish here', step: 'Step', article: 'Article', project: 'Project', open: 'Open',
  },
  he: {
    eyebrow: 'קריאה מונחית',
    heading: 'בחרו מסלול מכוון דרך העבודות',
    intro: 'שלושה רצפים שנבחרו ידנית מחברים בין מאמרים מעשיים לבין הוכחות מפרויקטים ציבוריים. אלה מסלולי עריכה קבועים, לא המלצות אישיות.',
    start: 'מתחילים כאן', finish: 'מסיימים כאן', step: 'שלב', article: 'מאמר', project: 'פרויקט', open: 'לפתיחה',
  },
} as const;

const targetForRef = (ref: ReadingRouteContentRef): PortfolioRouteTarget => (
  ref.kind === 'article'
    ? { route: 'article', id: ref.id }
    : { route: 'project', id: ref.id }
);

const ReadingRoutesSection = ({ buildPath, className = '', language }: CuratedReadingRoutesProps) => {
  const headingId = useId();
  const copy = uiCopy[language];
  const projectTitleById = new Map<ProjectId, string>(
    getFlagshipPortfolioProjects(language).map(
      (project): [ProjectId, string] => [project.id, project.title],
    ),
  );

  const titleForRef = (ref: ReadingRouteContentRef) => {
    if (ref.kind === 'article') return getBlogPostMetadata(ref.id, language)?.title ?? ref.id;
    return projectTitleById.get(ref.id) ?? ref.id;
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`border-y border-neutral-200 py-12 dark:border-neutral-800 ${className}`.trim()}
      data-portfolio-slot="blog.curatedRoutes"
    >
      <header className="max-w-3xl">
        <p className="font-mono text-xs font-extrabold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300">{copy.eyebrow}</p>
        <h2 id={headingId} className="mt-3 text-3xl font-black tracking-tight text-neutral-950 dark:text-white md:text-5xl">{copy.heading}</h2>
        <p className="mt-4 text-base leading-7 text-neutral-600 dark:text-neutral-300">{copy.intro}</p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {curatedReadingRoutes.map((route) => (
          <article
            key={route.id}
            className="border border-neutral-200 bg-white/70 p-5 dark:border-neutral-800 dark:bg-neutral-950/50"
            data-reading-route={route.id}
          >
            <h3 className="text-xl font-black text-neutral-950 dark:text-white">{route.title[language]}</h3>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{route.rationale[language]}</p>
            <ol className="mt-6 grid gap-4">
              {route.items.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === route.items.length - 1;
                const href = buildPath(language, targetForRef(item.ref));

                return (
                  <li key={`${item.ref.kind}:${item.ref.id}`} className="border-s-2 border-neutral-200 ps-4 dark:border-neutral-700">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-neutral-500">
                      <span>{copy.step} {index + 1}/{route.items.length}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.ref.kind === 'article' ? copy.article : copy.project}</span>
                      {(isFirst || isLast) && (
                        <strong className="text-primary-700 dark:text-primary-300">{isFirst ? copy.start : copy.finish}</strong>
                      )}
                    </div>
                    <Link
                      to={href}
                      className="mt-2 inline-flex min-h-11 items-center text-base font-black leading-6 text-neutral-950 underline decoration-primary-400 decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 dark:text-white"
                    >
                      {titleForRef(item.ref)}
                      <span className="sr-only"> — {copy.open}</span>
                    </Link>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{item.rationale[language]}</p>
                  </li>
                );
              })}
            </ol>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ReadingRoutesSection;
