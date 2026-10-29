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
  reason: string;
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
      data-related-content="reasoned-links"
    >
      <h2
        id={headingId}
        className="text-xl font-bold text-neutral-950 dark:text-white"
      >
        {heading}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const href = buildPath(language, item.target);
          const itemKey = `${item.target.route}:${item.target.id}`;

          return (
            <li
              key={itemKey}
              className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950"
              data-related-reason={item.reason}
            >
              <Link
                to={href}
                className="inline-flex min-h-11 items-center text-sm font-bold text-neutral-900 underline decoration-primary-400 decoration-2 underline-offset-4 transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:text-white dark:hover:text-primary-200"
              >
                {item.label}
              </Link>
              <p className="mt-2 max-w-prose text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {item.reason}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default RelatedContentLinks;
