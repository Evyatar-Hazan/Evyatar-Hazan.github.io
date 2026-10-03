import { ExternalLink } from 'lucide-react';
import type { LocalizedPathBuilder, ProjectId } from '../contracts/portfolio';
import type { PortfolioLanguage } from '../data/portfolioCapabilities';
import { getProductVisualCollection } from '../data/productVisuals';

type ProductVisualGalleryProps = {
  projectId: ProjectId;
  language: PortfolioLanguage;
  localizedPath: LocalizedPathBuilder;
  className?: string;
};

const ProductVisualGallery = ({
  projectId,
  language,
  localizedPath,
  className = '',
}: ProductVisualGalleryProps) => {
  const collection = getProductVisualCollection(projectId);

  if (!collection) return null;

  const routePath = localizedPath(language, { route: 'project', id: projectId });
  const headingId = `product-visuals-${projectId}`;

  return (
    <section
      aria-labelledby={headingId}
      className={`border-t border-neutral-200 py-12 dark:border-neutral-800 ${className}`.trim()}
      data-project-id={projectId}
      data-project-path={routePath}
    >
      <h2 id={headingId} className="text-2xl font-bold text-neutral-950 dark:text-white">
        {collection.heading[language]}
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {collection.visuals.map((visual) => (
          <figure
            key={visual.id}
            className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/60"
          >
            <div className="grid aspect-[16/10] place-items-center overflow-hidden bg-neutral-100 dark:bg-neutral-900">
              <img
                src={visual.src}
                width={visual.width}
                height={visual.height}
                alt={visual.alt[language]}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </div>
            <figcaption className="p-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              <p>{visual.caption[language]}</p>
              <a
                href={visual.provenance.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 font-bold text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-300"
              >
                {collection.sourceLabel[language]}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default ProductVisualGallery;
