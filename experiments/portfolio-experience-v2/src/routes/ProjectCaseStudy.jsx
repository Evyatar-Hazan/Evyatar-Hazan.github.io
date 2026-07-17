import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  GithubLogo,
} from '@phosphor-icons/react';
import { projects } from '../../../../src/data/profile.ts';
import { getFlagshipPortfolioProjects } from '../../../../src/data/portfolioProjects.ts';
import { portfolioExperiences } from '../../../../src/data/portfolioExperiences.ts';
import { localizedInternalPath, localizedStoryPath } from '../navigation.js';
import { CaseCinemaTrack, CaseJourneyLayout } from './CaseJourneyLayout.jsx';

const routeConfig = {
  online_converter: {
    index: '02',
    domain: 'online-converter.evyatarhazan.com',
    desktopCapture: '/assets/online-live-hero-desktop.png',
    mobileCapture: '/assets/online-live-hero-mobile.png',
    proofStats: [
      ['124', { en: 'bilingual tools', he: 'כלים דו־לשוניים' }],
      ['LOCAL', { en: 'browser processing', he: 'עיבוד בדפדפן' }],
      ['2×', { en: 'static language surfaces', he: 'משטחי שפה סטטיים' }],
    ],
  },
  emergency_protocol: {
    index: '03',
    domain: 'bls-protocol.evyatarhazan.com',
    desktopCapture: '/assets/protocol-live-hero-desktop.png',
    mobileCapture: '/assets/protocol-live-hero-mobile.png',
    proofStats: [
      ['STEP', { en: 'guided learning flow', he: 'זרימת למידה מדורגת' }],
      ['D1', { en: 'production data layer', he: 'שכבת נתונים בפרודקשן' }],
      ['RTL', { en: 'Hebrew-first interface', he: 'ממשק בעברית תחילה' }],
    ],
  },
};

const labels = {
  en: {
    back: 'Back to the project chapter',
    room: 'PROJECT EVIDENCE ROOM',
    live: 'Open the live product',
    code: 'Explore the code',
    problem: 'The product need',
    audience: 'Who it serves',
    decision: 'The product decision',
    journey: 'The user journey',
    capture: 'Real production capture',
    captureCopy: 'Captured from the live product, not a presentation mockup.',
    system: 'The system decision',
    systemProof: 'How the product moves',
    publishing: 'Delivery path',
    tradeoffs: 'Tradeoffs, made explicit',
    contribution: 'My contribution',
    outcome: 'Verified outcome',
    related: 'Read the related product note',
    close: 'Continue exploring',
    fallback: 'The live product capture could not load.',
    fallbackLink: 'Open the live product instead',
  },
  he: {
    back: 'חזרה לפרק הפרויקט',
    room: 'חדר הראיות של הפרויקט',
    live: 'פתיחת המוצר החי',
    code: 'צפייה בקוד',
    problem: 'הצורך המוצרי',
    audience: 'למי זה מיועד',
    decision: 'החלטת המוצר',
    journey: 'מסע המשתמש',
    capture: 'צילום אמיתי מפרודקשן',
    captureCopy: 'נלכד מתוך המוצר החי — לא מתוך מוקאפ מצגת.',
    system: 'החלטת המערכת',
    systemProof: 'איך המוצר מתקדם',
    publishing: 'מסלול המסירה',
    tradeoffs: 'הפשרות, בצורה מפורשת',
    contribution: 'התרומה שלי',
    outcome: 'תוצאה מאומתת',
    related: 'לקריאת תובנת המוצר הקשורה',
    close: 'להמשך הסיור',
    fallback: 'צילום המוצר החי לא הצליח להיטען.',
    fallbackLink: 'פתיחת המוצר החי במקום',
  },
};

function ArrowForLanguage({ language, size = 18 }) {
  return language === 'he'
    ? <ArrowLeft size={size} weight="light" aria-hidden="true" />
    : <ArrowRight size={size} weight="light" aria-hidden="true" />;
}

function BackArrowForLanguage({ language, size = 18 }) {
  return language === 'he'
    ? <ArrowRight size={size} weight="light" aria-hidden="true" />
    : <ArrowLeft size={size} weight="light" aria-hidden="true" />;
}

function EvidenceImage({ alt, mobileSrc, projectName, src, ui, liveUrl }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="evidence-image-fallback case-capture">
        <p role="status">
          <span className="visually-hidden">{alt}. </span>
          {ui.fallback}
        </p>
        <a
          href={liveUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${ui.fallbackLink}: ${projectName}`}
        >
          {ui.fallbackLink}
        </a>
      </div>
    );
  }

  return (
    <picture className="case-capture">
      <source media="(max-width: 700px)" srcSet={mobileSrc} />
      <img
        src={src}
        alt={alt}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </picture>
  );
}

export function ProjectCaseStudy({ language, projectId }) {
  const { onProjectBack, onProjectNavigate, onStoryNavigate } = useOutletContext();
  const config = routeConfig[projectId];
  const project = projects.find((item) => item.id === projectId);
  const flagshipProject = getFlagshipPortfolioProjects(language)
    .find((item) => item.id === projectId);
  const experience = portfolioExperiences[projectId];
  const caseStudy = project?.caseStudy;
  const ui = labels[language];
  const localize = (field) => field[language];

  useEffect(() => {
    if (caseStudy) document.title = caseStudy.seoTitle[language];
  }, [caseStudy, language]);

  if (!config || !project || !flagshipProject || !experience || !caseStudy || !project.liveUrl) return null;

  const projectTitle = flagshipProject.title;

  const captureAlt = language === 'he'
    ? `צילום מסך של המוצר החי ${projectTitle}`
    : `Live product capture of ${projectTitle}`;

  const theme = projectId === 'online_converter' ? 'growth' : 'complexity';
  const mediaStage = (
    <figure className="case-live-proof" data-cinema-media="capture" data-journey-camera>
      <div className="proof-browser-bar" aria-hidden="true"><span /><span /><span /><strong>{config.domain}</strong></div>
      <EvidenceImage
        src={config.desktopCapture}
        mobileSrc={config.mobileCapture}
        alt={captureAlt}
        ui={ui}
        liveUrl={project.liveUrl}
        projectName={projectTitle}
      />
      <figcaption><span>{ui.capture}</span><p>{ui.captureCopy}</p></figcaption>
    </figure>
  );

  return (
    <CaseJourneyLayout
      className={`case-study-${projectId}`}
      route={projectId}
      theme={theme}
      mediaStage={mediaStage}
    >
      <CaseCinemaTrack
        act="promise"
        index="00"
        className="case-hero"
        data-journey-label={`${config.index} / ${ui.room}`}
        data-journey-phase="case-intro"
        data-journey-route={projectId}
        data-journey-theme={theme}
        aria-labelledby="case-title"
      >
        <div className="case-hero-copy" data-journey-beat="promise">
          <a
            className="case-back-link"
            href={localizedStoryPath(`#${projectId}`, language)}
            onClick={(event) => onProjectBack(event, `#${projectId}`)}
            aria-label={`${ui.back}: ${projectTitle}`}
          >
            <BackArrowForLanguage language={language} />
            <span>{ui.back}</span>
          </a>
          <p className="case-index">{config.index} / {ui.room}</p>
          <p className="case-category">{localize(experience.category)}</p>
          <h1 id="case-title">{projectTitle}</h1>
          <p className="case-lead">{localize(experience.lead)}</p>
          <div className="case-hero-actions">
            <a
              className="button button-primary"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${ui.live}: ${projectTitle}`}
            >
              <span>{ui.live}</span><ArrowUpRight size={19} weight="light" aria-hidden="true" />
            </a>
            <a
              className="button button-secondary"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${ui.code}: ${projectTitle}`}
            >
              <span>{ui.code}</span><GithubLogo size={19} weight="light" aria-hidden="true" />
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
        data-journey-route={projectId}
        data-journey-theme={theme}
        aria-labelledby="case-problem-title"
      >
        <div className="case-section-heading" data-journey-beat="need"><span>01</span><h2 id="case-problem-title">{ui.problem}</h2></div>
        <div className="case-context-grid">
          <p className="case-statement">{localize(experience.problem)}</p>
          <article className="case-note" data-journey-beat="audience"><p className="case-note-label">{ui.audience}</p><p>{localize(caseStudy.audience)}</p></article>
        </div>
        <div className="proof-stat-grid">
          {config.proofStats.map(([value, label]) => (
            <article data-journey-beat={`proof-${value.toLowerCase()}`} key={value}><strong>{value}</strong><span>{localize(label)}</span></article>
          ))}
        </div>
      </CaseCinemaTrack>

      <CaseCinemaTrack
        act="decision"
        index="02"
        className="case-journey case-section"
        data-journey-label={`02 / ${ui.decision}`}
        data-journey-phase="case-decision"
        data-journey-route={projectId}
        data-journey-theme={theme}
        aria-labelledby="case-journey-title"
      >
        <div className="case-section-heading" data-journey-beat="decision"><span>02</span><h2 id="case-journey-title">{ui.decision}</h2></div>
        <p className="case-statement">{localize(experience.productDecision)}</p>
        <div className="journey-board" data-journey-beat="path" aria-label={ui.journey}>
          <p className="journey-title">{ui.journey}</p>
          <ol>{localize(experience.userJourney).map((step, index) => <li data-journey-beat={`path-${index + 1}`} key={step}><span>0{index + 1}</span><p>{step}</p></li>)}</ol>
        </div>
      </CaseCinemaTrack>

      <CaseCinemaTrack
        act="system"
        index="03"
        className="case-system case-section"
        data-journey-label={`03 / ${ui.system}`}
        data-journey-phase="case-system"
        data-journey-route={projectId}
        data-journey-theme={theme}
        aria-labelledby="case-system-title"
      >
        <div className="case-section-heading" data-journey-beat="system"><span>03</span><h2 id="case-system-title">{ui.system}</h2></div>
        <p className="case-statement">{localize(experience.systemDecision)}</p>
        <div className="system-proof" data-journey-beat="delivery" data-journey-camera>
          <p className="system-proof-label">{ui.systemProof}</p>
          <ol className="project-delivery-flow">
            {localize(experience.publishingFlow).map((step, index) => <li data-journey-beat={`delivery-${index + 1}`} key={step}><span>{index + 1}</span><p>{step}</p></li>)}
          </ol>
        </div>
      </CaseCinemaTrack>

      <CaseCinemaTrack
        act="proof-tradeoffs"
        index="04"
        className="case-tradeoffs case-section"
        data-journey-label={`04 / ${ui.tradeoffs}`}
        data-journey-phase="case-tradeoffs"
        data-journey-route={projectId}
        data-journey-theme={theme}
        aria-labelledby="case-tradeoffs-title"
      >
        <span className="case-cinema-beat-anchor" data-journey-beat="proof" aria-hidden="true" />
        <div className="case-section-heading" data-journey-beat="tradeoffs"><span>04</span><h2 id="case-tradeoffs-title">{ui.tradeoffs}</h2></div>
        <div className="tradeoff-grid">{localize(experience.tradeoffs).map((item, index) => <article data-journey-beat={`tradeoff-${index + 1}`} key={item}><span>0{index + 1}</span><p>{item}</p></article>)}</div>
      </CaseCinemaTrack>

      <CaseCinemaTrack
        act="outcome"
        index="05"
        className="case-contribution case-section"
        data-journey-label={`05 / ${ui.outcome}`}
        data-journey-phase="case-outcome"
        data-journey-route={projectId}
        data-journey-theme={theme}
        aria-labelledby="case-contribution-title"
      >
        <div className="case-section-heading" data-journey-beat="contribution"><span>05</span><h2 id="case-contribution-title">{ui.contribution}</h2></div>
        <div className="contribution-block" data-journey-beat="outcome">
          <ul>{localize(experience.contribution).map((item) => <li key={item}>{item}</li>)}</ul>
          <article><p className="case-note-label">{ui.outcome}</p><p>{localize(experience.outcome)}</p></article>
        </div>
      </CaseCinemaTrack>

      <CaseCinemaTrack
        as="footer"
        act="close"
        index="06"
        className="case-footer"
        data-journey-label={ui.close}
        data-journey-phase="case-close"
        data-journey-route={projectId}
        data-journey-theme={theme}
      >
        <span data-journey-beat="complete" />
        <p>{ui.close}</p>
        <div>
          <a
            id={`case-related-writing-${projectId}`}
            href={localizedInternalPath(experience.relatedWritingPath, language)}
            onClick={(event) => onProjectNavigate(event, localizedInternalPath(experience.relatedWritingPath, language))}
            aria-label={`${ui.related}: ${projectTitle}`}
          >
            {ui.related}<ArrowForLanguage language={language} />
          </a>
          <a
            href={localizedStoryPath('#about', language)}
            onClick={(event) => onStoryNavigate(event, '#about')}
          >
            {language === 'he' ? 'היכרות עם הדרך שלי' : 'Meet the way I work'}<ArrowForLanguage language={language} />
          </a>
        </div>
      </CaseCinemaTrack>
    </CaseJourneyLayout>
  );
}
