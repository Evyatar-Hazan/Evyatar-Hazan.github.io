import type { PortfolioSlotProps } from '../../contracts/portfolio';
import { getHumanAboutContent } from './content';

const HumanAboutSection = ({ language, className = '' }: PortfolioSlotProps) => {
  const content = getHumanAboutContent(language);

  return (
    <section
      aria-labelledby="human-about-title"
      data-portfolio-slot="home.humanAbout"
      className={`border-y border-neutral-200/80 py-12 dark:border-neutral-800 sm:py-16 ${className}`.trim()}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:gap-12">
        <header>
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-400">
            {content.eyebrow}
          </p>
          <h2
            id="human-about-title"
            className="mt-3 max-w-[18ch] text-3xl font-black leading-tight tracking-[-0.035em] text-neutral-950 dark:text-white sm:text-4xl"
          >
            {content.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-lg">
            {content.introduction}
          </p>
        </header>

        <div className="grid gap-px border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 md:grid-cols-3">
          {content.pillars.map((pillar, index) => (
            <article
              key={pillar.id}
              data-human-about-pillar={pillar.id}
              className="bg-neutral-50 p-5 dark:bg-neutral-950 sm:p-6"
            >
              <p
                aria-hidden="true"
                className="font-mono text-[0.62rem] font-black tracking-[0.16em] text-primary-700 dark:text-primary-400"
              >
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-5 text-lg font-black text-neutral-950 dark:text-white">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {pillar.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HumanAboutSection;
