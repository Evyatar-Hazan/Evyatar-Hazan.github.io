import { useEffect } from 'react';
import type { LocalizedPathBuilder, PortfolioSlotProps } from '../../contracts/portfolio';
import { getPortfolioCapabilityGroups } from '../../data/portfolioCapabilities';
import { getHumanAboutContent } from '../../features/humanAbout/content';
import { HomeSectionHeader } from './HomeSectionPrimitives';
import { cardSurfaceClassName } from '../cardSurface';

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
      className={`home-section home-section--overview professional-overview relative overflow-hidden ${className}`.trim()}
    >
      <div className="about-system-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="home-section__inner relative">
        <HomeSectionHeader
          index="03"
          eyebrow={ui.eyebrow}
          titleId="professional-overview-title"
          title={ui.title}
          description={<p>{human.introduction}</p>}
        />

        <div className="professional-overview__body">
          <div className={cardSurfaceClassName('raised', 'professional-overview__profile')}>
            <div>
              <p className="home-detail-label">
                01 / {ui.profileLabel}
              </p>
              <p>
                {human.pillars.find(({ id }) => id === 'background')?.body}
              </p>
            </div>
            <div>
              <p className="home-detail-label">
                02 / {ui.valueLabel}
              </p>
              <p>
                {human.pillars.find(({ id }) => id === 'workingStyle')?.body}
              </p>
            </div>
          </div>

          <div className={cardSurfaceClassName('raised', 'professional-overview__capabilities')}>
            <div className="professional-overview__capabilities-heading">
              <div>
                <p className="home-detail-label">
                  03 / {ui.capabilitiesLabel}
                </p>
                <p>
                  {ui.capabilitiesIntro}
                </p>
              </div>
              <span className="professional-overview__trace" aria-hidden="true">
                NEED → SYSTEM → PROOF
              </span>
            </div>
            <ul className="professional-overview__capability-grid">
              {capabilities.map((capability, index) => (
                <li
                  key={capability.id}
                  data-professional-capability={capability.id}
                  className="professional-overview__capability"
                >
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>{capability.label}</h3>
                  <p>{capability.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="home-actions">
          <a
            href={buildPath(language, { route: 'about' })}
            className="home-action home-action--inverse"
          >
            {ui.fullProfile}
            <span aria-hidden="true" className="rtl:-scale-x-100">→</span>
          </a>
          <a
            href={buildPath(language, { route: 'contact' })}
            className="home-action home-action--secondary"
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
