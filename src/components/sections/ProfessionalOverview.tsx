import { useEffect } from 'react';
import type { LocalizedPathBuilder, PortfolioSlotProps } from '../../contracts/portfolio';
import { getPortfolioCapabilityGroups } from '../../data/portfolioCapabilities';
import { getHumanAboutContent } from '../../features/humanAbout/content';

type ProfessionalOverviewProps = PortfolioSlotProps & {
  buildPath: LocalizedPathBuilder;
};

const copy = {
  en: {
    eyebrow: 'Professional overview',
    title: 'Full-stack product work, shaped around the outcome.',
    profileLabel: 'Profile',
    valueLabel: 'How I add value',
    capabilitiesLabel: 'Selected capabilities',
    capabilitiesIntro: 'A focused mix for taking a product from interface decisions to a verified release.',
    fullProfile: 'Open the full professional profile',
    contactLabel: 'Start a project conversation',
  },
  he: {
    eyebrow: 'סקירה מקצועית',
    title: 'עבודת מוצר מקצה לקצה, ממוקדת בתוצאה.',
    profileLabel: 'פרופיל',
    valueLabel: 'הערך שאני מביא',
    capabilitiesLabel: 'יכולות נבחרות',
    capabilitiesIntro: 'שילוב ממוקד שמחבר בין החלטות ממשק לבין שחרור מאומת של המוצר.',
    fullProfile: 'לפרופיל המקצועי המלא',
    contactLabel: 'להתחיל שיחת פרויקט',
  },
} as const;

const selectedCapabilityIds = ['webMobile', 'devops', 'automation', 'aiCv'] as const;

const ProfessionalOverview = ({
  language,
  buildPath,
  className = '',
}: ProfessionalOverviewProps) => {
  const human = getHumanAboutContent(language);
  const ui = copy[language];
  const capabilities = getPortfolioCapabilityGroups(language).filter(({ id }) =>
    selectedCapabilityIds.includes(id as (typeof selectedCapabilityIds)[number]),
  );

  useEffect(() => {
    if (window.location.hash !== '#about') return;

    document.getElementById('about')?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, []);

  return (
    <section
      id="about"
      aria-labelledby="professional-overview-title"
      className={`professional-overview relative overflow-hidden border-b border-neutral-300/70 bg-[var(--effect-about-surface)] px-5 py-16 dark:border-neutral-800/70 sm:px-8 sm:py-24 lg:px-12 ${className}`.trim()}
    >
      <div className="about-system-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1480px]">
        <header className="grid gap-8 border-b border-neutral-300/80 pb-10 dark:border-neutral-800 lg:grid-cols-[minmax(0,0.85fr)_minmax(20rem,1.15fr)] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-400">
              <span className="h-px w-9 bg-primary-500" aria-hidden="true" />
              {ui.eyebrow}
            </p>
            <h2
              id="professional-overview-title"
              className="mt-5 max-w-[13ch] text-[clamp(2.65rem,5.8vw,5.75rem)] font-black leading-[0.92] tracking-[-0.06em] text-neutral-950 dark:text-white"
            >
              {ui.title}
            </h2>
          </div>
          <p className="max-w-2xl border-s-2 border-primary-500 ps-5 text-lg font-medium leading-relaxed text-neutral-700 dark:text-neutral-300 lg:justify-self-end lg:text-xl">
            {human.introduction}
          </p>
        </header>

        <div className="grid gap-10 border-b border-neutral-300/80 py-10 dark:border-neutral-800 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-14">
          <div className="space-y-8">
            <div>
              <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] text-primary-700 dark:text-primary-400">
                01 / {ui.profileLabel}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-lg">
                {human.pillars.find(({ id }) => id === 'background')?.body}
              </p>
            </div>
            <div>
              <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] text-primary-700 dark:text-primary-400">
                02 / {ui.valueLabel}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-lg">
                {human.pillars.find(({ id }) => id === 'workingStyle')?.body}
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] text-neutral-500">
                  03 / {ui.capabilitiesLabel}
                </p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {ui.capabilitiesIntro}
                </p>
              </div>
              <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.14em] text-primary-700 dark:text-primary-400" aria-hidden="true">
                NEED → SYSTEM → PROOF
              </span>
            </div>
            <ul className="mt-6 border-t border-neutral-300/80 dark:border-neutral-800">
              {capabilities.map((capability, index) => (
                <li
                  key={capability.id}
                  data-professional-capability={capability.id}
                  className="grid gap-2 border-b border-neutral-300/80 py-4 dark:border-neutral-800 sm:grid-cols-[2.25rem_minmax(10rem,0.7fr)_1.3fr] sm:items-start sm:gap-4"
                >
                  <span className="font-mono text-[0.58rem] font-black text-primary-700 dark:text-primary-400" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-black text-neutral-950 dark:text-white sm:text-base">{capability.label}</h3>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{capability.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-10 sm:flex-row lg:pt-14">
          <a
            href={buildPath(language, { route: 'about' })}
            className="mt-8 inline-flex min-h-12 items-center gap-4 border border-neutral-950 bg-neutral-950 px-5 py-3 text-sm font-black text-white transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-primary-300 dark:focus-visible:ring-offset-neutral-950"
          >
            {ui.fullProfile}
            <span aria-hidden="true" className="rtl:-scale-x-100">→</span>
          </a>
          <a
            href={buildPath(language, { route: 'contact' })}
            className="mt-3 inline-flex min-h-12 items-center gap-4 border border-neutral-400 px-5 py-3 text-sm font-black text-neutral-950 transition-colors hover:border-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:border-neutral-600 dark:text-white dark:focus-visible:ring-offset-neutral-950 sm:mt-8"
          >
            {ui.contactLabel}
            <span aria-hidden="true" className="rtl:-scale-x-100">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalOverview;
