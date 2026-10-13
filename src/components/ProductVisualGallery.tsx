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
      className={`product-visual-gallery ${className}`.trim()}
      data-project-id={projectId}
      data-project-path={routePath}
    >
      <header className="product-visual-heading">
        <span aria-hidden="true">PROOF / 01</span>
        <h2 id={headingId}>{collection.heading[language]}</h2>
      </header>
      <div className="product-visual-grid" data-visual-count={collection.visuals.length}>
        {collection.visuals.map((visual) => (
          <figure key={visual.id}>
            <div className="product-visual-frame">
              <img
                src={visual.src}
                width={visual.width}
                height={visual.height}
                alt={visual.alt[language]}
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>
              <p>{visual.caption[language]}</p>
              <a
                href={visual.provenance.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
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
