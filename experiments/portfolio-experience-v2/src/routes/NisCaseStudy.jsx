import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  GithubLogo,
} from '@phosphor-icons/react';
import { projects } from '../../../../src/data/profile.ts';
import { portfolioExperiences } from '../../../../src/data/portfolioExperiences.ts';
import { localizedInternalPath, localizedStoryPath } from '../navigation.js';
import { CaseCinemaTrack, CaseJourneyLayout } from './CaseJourneyLayout.jsx';

const labels = {
  en: {
    back: 'Back to the project chapter',
    evidenceRoom: '01 / PROJECT EVIDENCE ROOM',
    live: 'Open the live product',
    code: 'Explore the code',
    problem: 'The business need',
    audience: 'Who it serves',
    productDecision: 'The product decision',
    journey: 'The path to conversation',
    capture: 'Real product capture',
    captureCaption: 'The live homepage keeps the offer, trust signals, and WhatsApp action in one visible journey.',
    system: 'The system decision',
    systemProof: 'Documented system proof',
    publicLayer: 'Public experience',
    publicLayerCopy: 'Fast static site / real product media / WhatsApp inquiry path',
    ownerLayer: 'Owner workspace',
    ownerLayerCopy: 'Private Content Studio / Sheets + Drive / shared schema',
    publishing: 'Controlled publishing',
    publishNote: 'Editing and production stay separate. Publishing passes through validation and a reproducible build.',
    tradeoffs: 'Tradeoffs, made explicit',
    gallery: 'The product should feel real',
    galleryCopy: 'Owned project media carries the appetite and craft. It supports the path to action; it is not decoration pretending to be proof.',
    contribution: 'My contribution',
    outcome: 'Truthful outcome',
    related: 'Read the product thinking behind WhatsApp',
    close: 'Continue exploring',
    fallback: 'The product capture could not load.',
    fallbackLink: 'Open the live product instead',
    captureAlt: 'Desktop view of the live Nis Boutique Catering homepage with the service message and WhatsApp call to action',
    saladAlt: 'Branded fresh salad cups prepared by Nis Boutique Catering',
    salmonAlt: 'Salmon skewers prepared for a Nis Boutique Catering event',
    logoAlt: 'Nis Boutique Catering brand card',
  },
  he: {
    back: 'חזרה לפרק הפרויקט',
    evidenceRoom: '01 / חדר הראיות של הפרויקט',
    live: 'פתיחת המוצר החי',
    code: 'צפייה בקוד',
    problem: 'הצורך העסקי',
    audience: 'למי זה מיועד',
    productDecision: 'החלטת המוצר',
    journey: 'המסלול לשיחה',
    capture: 'צילום אמיתי של המוצר',
    captureCaption: 'עמוד הבית החי מחבר את ההצעה, אותות האמון ופעולת ה־WhatsApp למסע אחד גלוי.',
    system: 'החלטת המערכת',
    systemProof: 'הוכחת מערכת מתועדת',
    publicLayer: 'החוויה הציבורית',
    publicLayerCopy: 'אתר סטטי ומהיר / מדיית מוצר אמיתית / נתיב פנייה ב־WhatsApp',
    ownerLayer: 'סביבת בעלת העסק',
    ownerLayerCopy: 'Content Studio פרטי / Sheets + Drive / schema משותף',
    publishing: 'פרסום מבוקר',
    publishNote: 'העריכה והפרודקשן נשארים נפרדים. הפרסום עובר דרך אימות ו־build שניתן לשחזר.',
    tradeoffs: 'הפשרות, בצורה מפורשת',
    gallery: 'המוצר צריך להרגיש אמיתי',
    galleryCopy: 'מדיה אמיתית שבבעלות הפרויקט נושאת את התיאבון ואת המלאכה. היא תומכת בנתיב לפעולה — היא לא קישוט שמתחזה להוכחה.',
    contribution: 'התרומה שלי',
    outcome: 'תוצאה שאפשר להוכיח',
    related: 'לקריאת החשיבה המוצרית מאחורי WhatsApp',
    close: 'להמשך הסיור',
    fallback: 'צילום המוצר לא הצליח להיטען.',
    fallbackLink: 'פתיחת המוצר החי במקום',
    captureAlt: 'תצוגת דסקטופ של עמוד הבית החי של Nis Boutique Catering עם הצעת השירות וכפתור WhatsApp',
    saladAlt: 'כוסות סלט ממותגות שהוכנו על ידי Nis Boutique Catering',
    salmonAlt: 'שיפודי סלמון שהוכנו לאירוע של Nis Boutique Catering',
    logoAlt: 'כרטיס המותג של Nis Boutique Catering',
  },
};

const nisProject = projects.find((project) => project.id === 'nis_boutique');

function EvidenceImage({
  alt,
  className = '',
  fallbackCopy,
  liveUrl,
  mobileSrc,
  priority = false,
  projectName,
  src,
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`evidence-image-fallback ${className}`}>
        <p role="status">
          <span className="visually-hidden">{alt}. </span>
          {fallbackCopy.fallback}
        </p>
        <a
          href={liveUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${fallbackCopy.fallbackLink}: ${projectName}`}
        >
          {fallbackCopy.fallbackLink}
          <ArrowUpRight size={17} weight="light" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <picture className={className}>
      {mobileSrc && <source media="(max-width: 700px)" srcSet={mobileSrc} />}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        onError={() => setFailed(true)}
      />
    </picture>
  );
}

function BackArrowForLanguage({ language, size = 18 }) {
  return language === 'he'
    ? <ArrowRight size={size} weight="light" aria-hidden="true" />
    : <ArrowLeft size={size} weight="light" aria-hidden="true" />;
}

function ArrowForLanguage({ language, size = 18 }) {
  return language === 'he'
    ? <ArrowLeft size={size} weight="light" aria-hidden="true" />
    : <ArrowRight size={size} weight="light" aria-hidden="true" />;
}

export function NisCaseStudy({ language }) {
  const { onProjectBack, onProjectNavigate } = useOutletContext();
  const ui = labels[language];
  const caseStudy = nisProject?.caseStudy;
  const experience = portfolioExperiences.nis_boutique;

  useEffect(() => {
    if (!caseStudy) return undefined;
    document.title = caseStudy.seoTitle[language];
    return undefined;
  }, [caseStudy, language]);

  if (!nisProject || !caseStudy || !experience || !nisProject.liveUrl) return null;

  const projectCopy = (field) => field[language];

  const mediaStage = (
    <div className="case-cinema-media-stack">
      <figure className="case-live-proof" data-cinema-media="capture" data-journey-camera>
        <div className="proof-browser-bar" aria-hidden="true">
          <span />
          <span />
          <span />
          <strong>nisboutiquecatering.com</strong>
        </div>
        <EvidenceImage
          className="case-capture"
          src="/assets/nis-live-hero-desktop.png"
          mobileSrc="/assets/nis-live-hero-mobile.png"
          alt={ui.captureAlt}
          fallbackCopy={ui}
          liveUrl={nisProject.liveUrl}
          priority
          projectName="Nis Boutique Catering"
        />
        <figcaption>
          <span>{ui.capture}</span>
          <p>{ui.captureCaption}</p>
        </figcaption>
      </figure>

      <div
        className="case-gallery-grid case-cinema-proof-media"
        data-cinema-media="proof"
        role="group"
        aria-labelledby="case-gallery-title"
      >
        <EvidenceImage
          className="gallery-tall"
          src="/assets/nis-salad-cups.webp"
          alt={ui.saladAlt}
          fallbackCopy={ui}
          liveUrl={nisProject.liveUrl}
          projectName="Nis Boutique Catering"
        />
        <EvidenceImage
          className="gallery-tall"
          src="/assets/nis-salmon-skewers.webp"
          alt={ui.salmonAlt}
          fallbackCopy={ui}
          liveUrl={nisProject.liveUrl}
          projectName="Nis Boutique Catering"
        />
        <EvidenceImage
          className="gallery-brand"
          src="/assets/nis-logo-card.jpg"
          alt={ui.logoAlt}
          fallbackCopy={ui}
          liveUrl={nisProject.liveUrl}
          projectName="Nis Boutique Catering"
        />
      </div>
    </div>
  );

  return (
    <CaseJourneyLayout
      className="case-study-nis"
      route="nis"
      theme="conversion"
      mediaStage={mediaStage}
    >
      <CaseCinemaTrack
        act="promise"
        index="00"
        className="case-hero"
        data-journey-label={ui.evidenceRoom}
        data-journey-phase="case-intro"
        data-journey-route="nis"
        data-journey-theme="conversion"
        aria-labelledby="case-title"
      >
        <div className="case-hero-copy" data-journey-beat="promise">
          <a
            className="case-back-link"
            href={localizedStoryPath('#work', language)}
            onClick={(event) => onProjectBack(event, '#work')}
            aria-label={`${ui.back}: Nis Boutique Catering`}
          >
            <BackArrowForLanguage language={language} />
            <span>{ui.back}</span>
          </a>
          <p className="case-index">{ui.evidenceRoom}</p>
          <p className="case-category">{projectCopy(experience.category)}</p>
          <h1 id="case-title">Nis Boutique Catering</h1>
          <p className="case-lead">{projectCopy(experience.lead)}</p>
          <div className="case-hero-actions">
            <a
              className="button button-primary"
              href={nisProject.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${ui.live}: Nis Boutique Catering`}
            >
              <span>{ui.live}</span>
              <ArrowUpRight size={19} weight="light" aria-hidden="true" />
            </a>
            <a
              className="button button-secondary"
              href={nisProject.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${ui.code}: Nis Boutique Catering`}
            >
              <span>{ui.code}</span>
              <GithubLogo size={19} weight="light" aria-hidden="true" />
            </a>
          </div>
          <span className="case-cinema-beat-anchor" data-journey-beat="capture" aria-hidden="true" />
        </div>
      </CaseCinemaTrack>

      <CaseCinemaTrack
        act="need"
        index="01"
        className="case-context case-section"
        data-journey-label={`01 / ${ui.problem}`}
        data-journey-phase="case-need"
        data-journey-route="nis"
        data-journey-theme="conversion"
        aria-labelledby="case-problem-title"
      >
        <div className="case-section-heading" data-journey-beat="need">
          <span>01</span>
          <h2 id="case-problem-title">{ui.problem}</h2>
        </div>
        <div className="case-context-grid">
          <p className="case-statement">{projectCopy(experience.problem)}</p>
          <article className="case-note" data-journey-beat="audience">
            <p className="case-note-label">{ui.audience}</p>
            <p>{projectCopy(caseStudy.audience)}</p>
          </article>
        </div>
      </CaseCinemaTrack>

      <CaseCinemaTrack
        act="decision"
        index="02"
        className="case-journey case-section"
        data-journey-label={`02 / ${ui.productDecision}`}
        data-journey-phase="case-decision"
        data-journey-route="nis"
        data-journey-theme="conversion"
        aria-labelledby="case-journey-title"
      >
        <div className="case-section-heading" data-journey-beat="decision">
          <span>02</span>
          <h2 id="case-journey-title">{ui.productDecision}</h2>
        </div>
        <p className="case-statement">{projectCopy(experience.productDecision)}</p>
        <div className="journey-board" data-journey-beat="path" aria-label={ui.journey}>
          <p className="journey-title">{ui.journey}</p>
          <ol>
            {projectCopy(experience.userJourney).map((step, index) => (
              <li data-journey-beat={`path-${index + 1}`} key={step}>
                <span>0{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </CaseCinemaTrack>

      <CaseCinemaTrack
        act="system"
        index="03"
        className="case-system case-section"
        data-journey-label={`03 / ${ui.system}`}
        data-journey-phase="case-system"
        data-journey-route="nis"
        data-journey-theme="conversion"
        aria-labelledby="case-system-title"
      >
        <div className="case-section-heading" data-journey-beat="architecture">
          <span>03</span>
          <h2 id="case-system-title">{ui.system}</h2>
        </div>
        <p className="case-statement">{projectCopy(experience.systemDecision)}</p>

        <div className="system-proof" data-journey-beat="boundary" data-journey-camera>
          <p className="system-proof-label">{ui.systemProof}</p>
          <div className="system-layers">
            <article>
              <span>PUBLIC</span>
              <h3>{ui.publicLayer}</h3>
              <p>{ui.publicLayerCopy}</p>
            </article>
            <div className="system-boundary" aria-hidden="true">
              <span>VALIDATED CI</span>
            </div>
            <article>
              <span>PRIVATE</span>
              <h3>{ui.ownerLayer}</h3>
              <p>{ui.ownerLayerCopy}</p>
            </article>
          </div>
        </div>

        <div className="publish-proof" data-journey-beat="publishing">
          <div>
            <p className="case-note-label">{ui.publishing}</p>
            <p>{ui.publishNote}</p>
          </div>
          <ol>
            {projectCopy(experience.publishingFlow).map((step, index) => (
              <li data-journey-beat={`publish-${index + 1}`} key={step}>
                <span>0{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </CaseCinemaTrack>

      <CaseCinemaTrack
        act="proof-tradeoffs"
        index="04"
        className="case-tradeoffs case-section"
        data-journey-label={`04 / ${ui.tradeoffs}`}
        data-journey-phase="case-tradeoffs"
        data-journey-route="nis"
        data-journey-theme="conversion"
        aria-labelledby="case-tradeoffs-title"
      >
        <div className="case-section-heading" data-journey-beat="tradeoffs">
          <span>04</span>
          <h2 id="case-tradeoffs-title">{ui.tradeoffs}</h2>
        </div>
        <div className="tradeoff-grid">
          {projectCopy(experience.tradeoffs).map((tradeoff, index) => (
            <article data-journey-beat={`tradeoff-${index + 1}`} key={tradeoff}>
              <span>0{index + 1}</span>
              <p>{tradeoff}</p>
            </article>
          ))}
        </div>

        <div className="case-section-heading case-gallery-heading" data-journey-beat="proof">
          <span>05</span>
          <h3 id="case-gallery-title">{ui.gallery}</h3>
        </div>
        <p className="case-gallery-copy">{ui.galleryCopy}</p>
        <span className="case-cinema-beat-anchor" data-journey-beat="media" aria-hidden="true" />
      </CaseCinemaTrack>

      <CaseCinemaTrack
        act="outcome"
        index="05"
        className="case-outcome case-section"
        data-journey-label={`06 / ${ui.outcome}`}
        data-journey-phase="case-outcome"
        data-journey-route="nis"
        data-journey-theme="conversion"
        aria-labelledby="case-outcome-title"
      >
        <div className="case-section-heading" data-journey-beat="outcome">
          <span>06</span>
          <h2 id="case-outcome-title">{ui.outcome}</h2>
        </div>
        <p className="case-outcome-statement">{projectCopy(experience.outcome)}</p>
        <div className="contribution-block" data-journey-beat="contribution">
          <p className="case-note-label">{ui.contribution}</p>
          <ul>
            {projectCopy(experience.contribution).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </CaseCinemaTrack>

      <CaseCinemaTrack
        as="footer"
        act="close"
        index="06"
        className="case-footer"
        data-journey-label={ui.close}
        data-journey-phase="case-close"
        data-journey-route="nis"
        data-journey-theme="conversion"
      >
        <span data-journey-beat="complete" />
        <p>{ui.close}</p>
        <div>
          <a
            href={nisProject.liveUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${ui.live}: Nis Boutique Catering`}
          >
            {ui.live}
            <ArrowUpRight size={18} weight="light" aria-hidden="true" />
          </a>
          <a
            href={nisProject.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${ui.code}: Nis Boutique Catering`}
          >
            {ui.code}
            <GithubLogo size={18} weight="light" aria-hidden="true" />
          </a>
          <a
            id="case-related-writing-nis_boutique"
            href={localizedInternalPath(experience.relatedWritingPath, language)}
            onClick={(event) => onProjectNavigate(event, localizedInternalPath(experience.relatedWritingPath, language))}
            aria-label={`${ui.related}: Nis Boutique Catering`}
          >
            {ui.related}
            <ArrowForLanguage language={language} />
          </a>
          <a
            href={localizedStoryPath('#work', language)}
            onClick={(event) => onProjectBack(event, '#work')}
            aria-label={`${ui.back}: Nis Boutique Catering`}
          >
            {ui.back}
            <BackArrowForLanguage language={language} />
          </a>
        </div>
      </CaseCinemaTrack>
    </CaseJourneyLayout>
  );
}
