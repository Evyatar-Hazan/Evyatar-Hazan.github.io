import { useId } from 'react';
import { Link } from 'react-router-dom';
import type {
  LocalizedPathBuilder,
  PortfolioRouteTarget,
} from '../contracts/portfolio';
import type { PortfolioLanguage } from '../data/portfolioCapabilities';

export type RelatedContentTarget = Extract<
  PortfolioRouteTarget,
  { route: 'project' | 'article' }
>;

export type RelatedContentItem = {
  target: RelatedContentTarget;
  label: string;
};

type RelatedContentLinksProps = {
  buildPath: LocalizedPathBuilder;
  heading: string;
  items: readonly RelatedContentItem[];
  language: PortfolioLanguage;
  className?: string;
};

const RelatedContentLinks = ({
  buildPath,
  className = '',
  heading,
  items,
  language,
}: RelatedContentLinksProps) => {
  const headingId = useId();

  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby={headingId}
      className={`border-t border-neutral-200 py-10 dark:border-neutral-800 ${className}`.trim()}
    >
      <h2
        id={headingId}
        className="text-xl font-bold text-neutral-950 dark:text-white"
      >
        {heading}
      </h2>
      <ul className="mt-5 flex flex-wrap gap-3">
        {items.map((item) => {
          const href = buildPath(language, item.target);
          const itemKey = `${item.target.route}:${item.target.id}`;

          return (
            <li key={itemKey}>
              <Link
                to={href}
                className="inline-flex min-h-11 items-center rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-700 transition-colors hover:border-primary-300 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-primary-700 dark:hover:text-primary-200"
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default RelatedContentLinks;
