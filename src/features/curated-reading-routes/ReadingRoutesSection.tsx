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
import { cardSurfaceClassName } from '../../components/cardSurface';
import { curatedReadingRoutes, type ReadingRouteContentRef } from './curatedReadingRoutes';
import { formatLocaleNumber } from '../locale-presentation/formatLocale';

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
      className={`reading-routes-section ${className}`.trim()}
      data-portfolio-slot="blog.curatedRoutes"
    >
      <header className="reading-routes-header">
        <div>
          <p>{copy.eyebrow}</p>
          <h2 id={headingId}>{copy.heading}</h2>
        </div>
        <p>{copy.intro}</p>
      </header>

      <div className="reading-routes-grid">
        {curatedReadingRoutes.map((route) => (
          <article
            key={route.id}
            className={cardSurfaceClassName('interactive', 'reading-route-card')}
            data-reading-route={route.id}
          >
            <div className="reading-route-card-heading">
              <h3>{route.title[language]}</h3>
              <p>{route.rationale[language]}</p>
            </div>
            <ol>
              {route.items.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === route.items.length - 1;
                const href = buildPath(language, targetForRef(item.ref));

                return (
                  <li key={`${item.ref.kind}:${item.ref.id}`}>
                    <div className="reading-route-step-meta">
                      <span>{copy.step} {formatLocaleNumber(index + 1, language)}/{formatLocaleNumber(route.items.length, language)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.ref.kind === 'article' ? copy.article : copy.project}</span>
                      {(isFirst || isLast) && (
                        <strong>{isFirst ? copy.start : copy.finish}</strong>
                      )}
                    </div>
                    <Link
                      to={href}
                    >
                      {titleForRef(item.ref)}
                      <span className="sr-only"> — {copy.open}</span>
                    </Link>
                    <p className="reading-route-step-rationale">{item.rationale[language]}</p>
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
