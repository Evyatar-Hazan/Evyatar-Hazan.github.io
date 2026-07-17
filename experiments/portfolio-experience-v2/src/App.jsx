import { useEffect, useState } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
} from '@phosphor-icons/react';
import { NisCaseStudy } from './routes/NisCaseStudy.jsx';
import { ProjectCaseStudy } from './routes/ProjectCaseStudy.jsx';
import { BlogIndex, BlogPost } from './routes/BlogRoutes.jsx';
import { ExperienceShell } from './shell/ExperienceShell.jsx';
import { ForgeAct } from './forge/ForgeAct.jsx';
import { WorldMechanism } from './journey/WorldMechanism.jsx';
import { portfolioExperiences } from '../../../src/data/portfolioExperiences.ts';
import { profileLinks } from '../../../src/data/profile.ts';
import { getPortfolioCapabilityGroups } from '../../../src/data/portfolioCapabilities.ts';
import {
  getFlagshipPortfolioProjects,
  getRemainingPortfolioProjects,
} from '../../../src/data/portfolioProjects.ts';
import { getLatestBlogPostMetadata } from '../../../src/content/blog/metadata.ts';
import { localizedInternalPath } from './navigation.js';

const projectWorlds = {
  online_converter: {
    number: '02',
    proofLabel: { en: '124 tools / local processing', he: '124 כלים / עיבוד מקומי' },
    capture: '/assets/online-live-hero-desktop.png',
    mobileCapture: '/assets/online-live-hero-mobile.png',
    route: '/projects/online_converter/',
    next: { en: 'Next world: Complexity', he: 'העולם הבא: מורכבות' },
    theme: 'growth',
  },
  emergency_protocol: {
    number: '03',
    proofLabel: { en: 'Guided flow / live collaboration', he: 'זרימה מודרכת / שיתוף חי' },
    capture: '/assets/protocol-live-hero-desktop.png',
    mobileCapture: '/assets/protocol-live-hero-mobile.png',
    route: '/projects/emergency_protocol/',
    next: { en: 'Next: How I work', he: 'הבא: איך אני עובד' },
    theme: 'complexity',
  },
};

const getFlagshipProject = (language, projectId) => {
  const project = getFlagshipPortfolioProjects(language)
    .find((candidate) => candidate.id === projectId);
  if (!project) throw new Error(`Missing flagship portfolio project: ${projectId}`);
  return project;
};

const closingContent = {
  en: {
    aboutEyebrow: 'THE OPERATING PRINCIPLE',
    aboutTitle: 'Clarity is not the visual layer. It is the architecture.',
    aboutBody: 'I work from the real constraint outward: the action a business needs, the decision a user must understand, or the system a team must be able to maintain. Then I connect product framing, interface craft, code, content, testing and deployment into one accountable path.',
    aboutPoints: ['Find the real decision', 'Make the system legible', 'Ship proof, not promises'],
    archiveEyebrow: 'MORE WORK / SAME STANDARD',
    archiveTitle: 'The flagship stories are not the whole body of work.',
    archiveBody: 'A compact view of additional products across nonprofit operations, mobile privacy, learning systems, and maintainable content workflows.',
    archiveLive: 'Open live project',
    archiveCode: 'View source',
    capabilitiesEyebrow: 'CAPABILITIES / WORKING STACK',
    capabilitiesTitle: 'The technology follows the product decision.',
    capabilitiesBody: 'These are the tools and operating disciplines I use to move from a real constraint to a reliable product — across interface, backend, data, delivery, automation, and technical leadership.',
    labEyebrow: 'FIELD NOTES / LAB',
    labTitle: 'The work keeps teaching the next system.',
    labBody: 'Short, practical notes from production: discovery, privacy, deployment, performance and the places where product decisions become engineering decisions.',
    read: 'Read the note',
    allWriting: 'Explore all writing',
    published: 'Published',
    contactEyebrow: 'START WITH THE REAL NEED',
    contactTitle: 'Have a messy system, a business bottleneck, or a product that needs a clearer next move?',
    contactBody: 'Send the context. I will help turn it into a product path that can be designed, built, tested and trusted.',
    whatsapp: 'Start on WhatsApp',
    email: 'Send an email',
    linkedin: 'Connect on LinkedIn',
  },
  he: {
    aboutEyebrow: 'עקרון העבודה',
    aboutTitle: 'בהירות היא לא שכבת העיצוב. היא הארכיטקטורה.',
    aboutBody: 'אני מתחיל מהמגבלה האמיתית: הפעולה שהעסק צריך, ההחלטה שהמשתמש חייב להבין או המערכת שהצוות צריך לתחזק. משם אני מחבר מסגור מוצרי, ממשק, קוד, תוכן, בדיקות ופריסה למסלול אחד עם אחריות ברורה.',
    aboutPoints: ['למצוא את ההחלטה האמיתית', 'להפוך את המערכת לקריאה', 'לספק הוכחות, לא הבטחות'],
    archiveEyebrow: 'עוד עבודות / אותו סטנדרט',
    archiveTitle: 'שלושת הסיפורים המרכזיים הם לא כל גוף העבודה.',
    archiveBody: 'מבט מרוכז על מוצרים נוספים בתחומי תפעול עמותות, פרטיות במובייל, מערכות למידה וזרימות תוכן שנוח לתחזק.',
    archiveLive: 'לפתיחת הפרויקט החי',
    archiveCode: 'לצפייה בקוד',
    capabilitiesEyebrow: 'יכולות / ארגז העבודה',
    capabilitiesTitle: 'הטכנולוגיה משרתת את החלטת המוצר.',
    capabilitiesBody: 'אלה הכלים והדיסציפלינות שאיתם אני הופך מגבלה אמיתית למוצר אמין — בממשק, Backend, נתונים, Delivery, אוטומציה והובלה טכנית.',
    labEyebrow: 'רשימות שטח / מעבדה',
    labTitle: 'כל עבודה מלמדת את המערכת הבאה.',
    labBody: 'רשימות קצרות ומעשיות מפרודקשן: גילוי, פרטיות, פריסה, ביצועים והמקומות שבהם החלטות מוצר הופכות להחלטות הנדסיות.',
    read: 'לקריאת הרשימה',
    allWriting: 'לכל הכתיבה',
    published: 'פורסם',
    contactEyebrow: 'מתחילים מהצורך האמיתי',
    contactTitle: 'יש מערכת מבולגנת, צוואר בקבוק עסקי או מוצר שצריך כיוון ברור יותר לצעד הבא?',
    contactBody: 'שלחו את ההקשר. אעזור להפוך אותו למסלול מוצר שאפשר לעצב, לבנות, לבדוק ולסמוך עליו.',
    whatsapp: 'מתחילים ב־WhatsApp',
    email: 'שליחת אימייל',
    linkedin: 'חיבור ב־LinkedIn',
  },
};

const content = {
  en: {
    name: 'Evyatar Hazan',
    nav: ['Work', 'Capabilities', 'Writing', 'Contact'],
    eyebrow: 'EVYATAR HAZAN / FULL STACK DEVELOPER',
    headline: 'I turn business needs and complex systems into clear, reliable web products built to grow.',
    supporting: 'For founders, businesses and product teams: from a website built to generate inquiries, through a privacy-first tool designed to scale, to a system that makes operational logic easier to follow — I connect product thinking, user experience, and end-to-end engineering.',
    coreEyebrow: 'THE DECISION CORE',
    coreTitle: 'I find the decision the product must make clear.',
    coreBody: 'Inside every tangled system is one unresolved decision. I open the structure, find that decision, and turn it into a product path people can actually follow.',
    topologyEyebrow: 'THREE SIGNALS / ONE SYSTEM',
    topologyTitle: 'Three projects. Three different product problems.',
    topologyBody: 'A business website built for conversation, a privacy-first utility built for discovery, and a learning product that makes complex decisions easier to follow.',
    handoffEyebrow: 'PROJECT 01 / BUSINESS & CONVERSION',
    handoffBody: 'The first project turns appetite and trust into one clear action: start a WhatsApp conversation.',
    handoffNext: 'Next: the need, the decision, and the live result.',
    workCta: 'See the work in action',
    contactCta: 'Start a conversation',
    signals: [
      ['Conversion', 'Trust → WhatsApp'],
      ['Growth', '124 bilingual tools'],
      ['Complexity', 'One guided decision at a time'],
    ],
    problemLabel: 'The need',
    decisionLabel: 'The decision',
    proofLabel: 'Verified outcome',
    caseStudyCta: 'Read the case study',
    visit: 'Open the live site',
    next: 'Next world: Growth',
    scroll: 'Follow the signal',
    menu: 'Open menu',
    close: 'Close menu',
    home: 'Home',
    primaryNavigation: 'Primary navigation',
    menuHeading: 'Explore',
    languageSwitch: 'Switch to Hebrew',
    skip: 'Skip to the main content',
    canonicalSite: 'opens the current portfolio',
    externalWriting: 'opens the current portfolio in a new tab',
    signalsTitle: 'Project worlds',
    redirecting: 'Opening this route in the current portfolio…',
    continueToRoute: 'Continue to the current page',
    unavailableRoute: 'This route still belongs to the current portfolio and must be integrated before V2 becomes canonical.',
    returnHome: 'Return to the V2 home page',
  },
  he: {
    name: 'אביתר חזן',
    nav: ['עבודות', 'יכולות', 'כתיבה', 'יצירת קשר'],
    eyebrow: 'אביתר חזן / מפתח Full Stack',
    headline: 'אני הופך צרכים עסקיים ומערכות מורכבות למוצרי Web ברורים, אמינים ומוכנים לצמוח.',
    supporting: 'לבעלי עסקים, יזמים וצוותי מוצר: מאתר שמייצר פניות, דרך כלי שפועל בדפדפן ושומר על פרטיות ונבנה לצמוח, ועד מערכת שמפשטת לוגיקה תפעולית — אני מחבר חשיבה מוצרית, חוויית משתמש והנדסה מקצה לקצה.',
    coreEyebrow: 'ליבת ההחלטה',
    coreTitle: 'אני מוצא את ההחלטה שהמוצר חייב להפוך לברורה.',
    coreBody: 'בתוך כל מערכת סבוכה מסתתרת החלטה אחת שלא נפתרה. אני פותח את המבנה, מוצא את ההחלטה והופך אותה למסלול מוצר שאנשים באמת יכולים לעקוב אחריו.',
    topologyEyebrow: 'שלושה אותות / מערכת אחת',
    topologyTitle: 'שלושה פרויקטים. שלוש בעיות מוצר שונות.',
    topologyBody: 'אתר עסקי שמוביל לשיחה, כלי שומר פרטיות שנבנה לגילוי, ומוצר למידה שהופך החלטות מורכבות למסלול שאפשר לעקוב אחריו.',
    handoffEyebrow: 'פרויקט 01 / עסק והמרה',
    handoffBody: 'הפרויקט הראשון הופך תיאבון ואמון לפעולה אחת ברורה: להתחיל שיחה ב־WhatsApp.',
    handoffNext: 'הבא: הצורך, ההחלטה והתוצאה החיה.',
    workCta: 'לראות את העבודה בפעולה',
    contactCta: 'מתחילים שיחה',
    signals: [
      ['המרה', 'אמון → WhatsApp'],
      ['צמיחה', '124 כלים דו־לשוניים'],
      ['מורכבות', 'החלטה מודרכת אחת בכל פעם'],
    ],
    problemLabel: 'הצורך',
    decisionLabel: 'ההחלטה',
    proofLabel: 'תוצאה מאומתת',
    caseStudyCta: 'לקייס סטאדי',
    visit: 'לצפייה באתר החי',
    next: 'העולם הבא: צמיחה',
    scroll: 'לעקוב אחרי האות',
    menu: 'פתיחת תפריט',
    close: 'סגירת תפריט',
    home: 'ראש העמוד',
    primaryNavigation: 'ניווט ראשי',
    menuHeading: 'ניווט באתר',
    languageSwitch: 'מעבר לאנגלית',
    skip: 'דילוג לתוכן הראשי',
    canonicalSite: 'נפתח באתר הפורטפוליו הנוכחי',
    externalWriting: 'נפתח באתר הפורטפוליו הנוכחי בכרטיסייה חדשה',
    signalsTitle: 'עולמות הפרויקטים',
    redirecting: 'הנתיב נפתח באתר הפורטפוליו הנוכחי…',
    continueToRoute: 'להמשך לעמוד הנוכחי',
    unavailableRoute: 'הנתיב הזה עדיין שייך לאתר הפורטפוליו הנוכחי וחייב להתחבר לפני ש־V2 יהפוך לאתר הראשי.',
    returnHome: 'חזרה לעמוד הבית של V2',
  },
};

function Hero({ language, onStoryNavigate }) {
  const copy = content[language];

  return (
    <section
      className="hero"
      data-forge-beat="0"
      data-cinema-track
      data-cinema-id="hero"
      data-cinema-title={language === 'he' ? 'המערכת השלמה' : 'Whole system'}
      data-cinema-theme="forge"
      id="top"
      tabIndex="-1"
      data-focus-target
      data-journey-label={language === 'he' ? 'המערכת השלמה' : 'WHOLE SYSTEM'}
      data-journey-phase="forge"
      data-journey-route="home"
      data-journey-theme="forge"
    >
      <div className="cinema-pin cinema-pin-hero">
      <div className="hero-grid-marks" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="hero-content" data-cinema-window="0,0.82">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.headline}</h1>
        <p className="hero-supporting">
          {copy.supporting}
        </p>
        <div className="hero-actions">
          <a
            className="button button-primary"
            href="#work"
            onClick={(event) => onStoryNavigate(event, '#work')}
          >
            <span>{copy.workCta}</span>
            <ArrowDown size={19} weight="light" aria-hidden="true" />
          </a>
          <a className="button button-secondary" href="#contact" onClick={(event) => onStoryNavigate(event, '#contact')}>
            <span>{copy.contactCta}</span>
            <ArrowUpRight size={19} weight="light" aria-hidden="true" />
          </a>
        </div>
      </div>

      <p className="hero-kinetic-line" data-cinema-window="0.34,0.94" aria-hidden="true">
        <span>{language === 'he' ? 'צורך' : 'NEED'}</span>
        <span>{language === 'he' ? 'אות' : 'SIGNAL'}</span>
        <span>{language === 'he' ? 'מערכת' : 'SYSTEM'}</span>
      </p>

      <a
        className="scroll-cue"
        href="#signals"
        onClick={(event) => onStoryNavigate(event, '#signals')}
      >
        <span>{copy.scroll}</span>
        <ArrowDown size={15} aria-hidden="true" />
      </a>
      </div>
    </section>
  );
}

function ForgeCoreBeat({ language }) {
  const copy = content[language];
  return (
    <section
      className="forge-core-beat"
      data-forge-beat="1"
      data-cinema-track
      data-cinema-id="thesis"
      data-cinema-title={language === 'he' ? 'ליבת ההחלטה' : 'Decision core'}
      data-cinema-theme="light"
      data-journey-label={language === 'he' ? 'ליבת ההחלטה' : 'DECISION CORE'}
      data-journey-phase="forge"
      data-journey-route="home"
      data-journey-theme="forge"
      aria-labelledby="forge-core-title"
    >
      <div className="cinema-pin cinema-pin-thesis">
      <div className="thesis-orbit" aria-hidden="true" />
      <div className="forge-beat-copy" data-cinema-window="0.04,0.94">
        <p className="eyebrow">{copy.coreEyebrow}</p>
        <h2 id="forge-core-title">{copy.coreTitle}</h2>
        <p>{copy.coreBody}</p>
      </div>
      <div className="forge-beat-coordinate" aria-hidden="true">
        <span>CORE / 01</span>
        <i />
      </div>
      <p className="thesis-watermark" aria-hidden="true" data-cinema-window="0.32,1">CLARITY</p>
      </div>
    </section>
  );
}

function SignalMap({ language, onStoryNavigate }) {
  const copy = content[language];
  const flagshipProjects = getFlagshipPortfolioProjects(language);
  const targets = ['#work', '#online_converter', '#emergency_protocol'];

  return (
    <section
      className="signal-map reveal"
      data-forge-beat="2"
      data-cinema-track
      data-cinema-id="signals"
      data-cinema-title={language === 'he' ? 'שלושה עולמות' : 'Three worlds'}
      data-cinema-theme="forge"
      id="signals"
      tabIndex="-1"
      data-focus-target
      aria-labelledby="signals-title"
      data-motion-key="signals"
      data-journey-label={language === 'he' ? 'מפת האותות' : 'SIGNAL TOPOLOGY'}
      data-journey-phase="forge"
      data-journey-route="home"
      data-journey-theme="forge"
    >
      <div className="cinema-pin cinema-pin-signals">
      <div className="signal-map-intro" data-cinema-window="0,0.84">
        <p className="eyebrow">{copy.topologyEyebrow}</p>
        <h2 id="signals-title">{copy.topologyTitle}</h2>
        <p className="section-explainer">{copy.topologyBody}</p>
      </div>
      <div className="signal-origin" aria-hidden="true" />
      <div className="signal-network-shell" aria-hidden="true">
        <svg className="signal-network" viewBox="0 0 1200 180" preserveAspectRatio="none">
          <path d="M200 14 C200 82 484 80 600 164" />
          <path d="M600 14 C600 78 600 112 600 164" />
          <path d="M1000 14 C1000 82 716 80 600 164" />
          <circle cx="600" cy="164" r="5" />
        </svg>
      </div>
      <div className="signal-list" data-cinema-window="0.18,0.96">
        {copy.signals.map(([label, outcome], index) => (
          <a
            className={index === 0 ? 'signal-row is-active' : 'signal-row'}
            href={targets[index]}
            key={label}
            onClick={(event) => onStoryNavigate(event, targets[index])}
          >
            <span className="signal-index">0{index + 1}</span>
            <span className="signal-name">{label}</span>
            <span className="signal-project">{flagshipProjects[index].title}</span>
            <span className="signal-outcome">{outcome}</span>
            <ArrowRight size={18} weight="light" aria-hidden="true" />
          </a>
        ))}
      </div>
      <p className="signal-kinetic-label" aria-hidden="true" data-cinema-window="0.48,1">01 → 03</p>
      </div>
    </section>
  );
}

function ForgeHandoff({ language }) {
  const copy = content[language];
  const project = getFlagshipProject(language, 'nis_boutique');
  return (
    <section
      className="forge-handoff"
      data-forge-beat="3"
      data-cinema-track
      data-cinema-id="handoff"
      data-cinema-title={language === 'he' ? 'העברה למוצר' : 'Product handoff'}
      data-cinema-theme="handoff"
      data-journey-label={language === 'he' ? 'העברה למוצר' : 'PRODUCT HANDOFF'}
      data-journey-phase="forge"
      data-journey-route="home"
      data-journey-theme="forge"
      aria-labelledby="forge-handoff-title"
    >
      <div className="cinema-pin cinema-pin-handoff">
      <div data-cinema-window="0.04,0.9">
        <p className="eyebrow">{copy.handoffEyebrow}</p>
        <h2 id="forge-handoff-title">{project.title}</h2>
        <p className="section-explainer">{copy.handoffBody}</p>
        <span className="handoff-destination">{copy.handoffNext}</span>
      </div>
      <div className="handoff-portal" aria-hidden="true" data-cinema-window="0.2,1"><span /><span /><span /></div>
      </div>
    </section>
  );
}

function HomeEvidenceImage({
  alt,
  className,
  height,
  language,
  loading = 'lazy',
  recoveryHref,
  recoveryLabel,
  src,
  width,
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`home-evidence-fallback ${className || ''}`.trim()} role="status">
        <p>{language === 'he' ? 'תמונת המוצר לא הצליחה להיטען.' : 'The product image could not load.'}</p>
        <a href={recoveryHref}>{recoveryLabel}</a>
      </div>
    );
  }

  return (
    <img
      alt={alt}
      className={className}
      decoding="async"
      height={height}
      loading={loading}
      onError={() => setFailed(true)}
      src={src}
      width={width}
    />
  );
}

function HomeEvidencePicture({ alt, language, mobileSrc, recoveryHref, recoveryLabel, src }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="home-evidence-fallback" role="status">
        <p>{language === 'he' ? 'צילום המוצר לא הצליח להיטען.' : 'The product capture could not load.'}</p>
        <a href={recoveryHref}>{recoveryLabel}</a>
      </div>
    );
  }

  return (
    <picture>
      <source media="(max-width: 700px)" srcSet={mobileSrc} />
      <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
    </picture>
  );
}

function NisChapter({ language, onProjectNavigate }) {
  const copy = content[language];
  const project = getFlagshipProject(language, 'nis_boutique');
  const experience = portfolioExperiences.nis_boutique;
  const localize = (field) => field[language];

  return (
    <section
      className="nis-chapter"
      data-cinema-track
      data-cinema-id="work"
      data-cinema-title={language === 'he' ? '01 / המרה' : '01 / Conversion'}
      data-cinema-theme="conversion"
      id="work"
      tabIndex="-1"
      data-focus-target
      data-cinema-anchor="0.18"
      data-journey-label={language === 'he' ? '01 / המרה' : '01 / CONVERSION'}
      data-journey-phase="conversion"
      data-journey-route="home"
      data-journey-theme="conversion"
      aria-labelledby="nis-title"
    >
      <div className="cinema-pin cinema-pin-project cinema-pin-conversion">
      <span className="chapter-conductor" aria-hidden="true" />
      <div className="chapter-intro reveal" data-motion-key="nis-intro" data-journey-beat="arrival" data-cinema-window="0,0.4">
        <div className="chapter-number">01</div>
        <div>
          <p className="chapter-kicker">{localize(experience.category)}</p>
          <h2 id="nis-title">{project.title}</h2>
          <p className="chapter-lead">{localize(experience.lead)}</p>
        </div>
      </div>

      <div className="nis-camera-stage" data-cinema-window="0.12,0.82">
        <div className="conversion-aperture" aria-hidden="true">
          <span /><span /><span />
        </div>
        <svg className="conversion-route" viewBox="0 0 1200 720" preserveAspectRatio="none" aria-hidden="true">
          <path d="M70 360 C285 360 235 92 470 92 C705 92 590 628 848 628 C1060 628 1010 360 1140 360" />
          <circle cx="70" cy="360" r="7" />
          <circle cx="470" cy="92" r="7" />
          <circle cx="848" cy="628" r="7" />
          <circle cx="1140" cy="360" r="9" />
        </svg>
        <div className="media-stage reveal" data-motion-key="nis-media" data-journey-beat="media" data-journey-camera>
        <figure className="media-primary">
          <HomeEvidenceImage
            src="/assets/nis-salad-cups.webp"
            alt={language === 'he' ? 'כוסות סלט טריות וממותגות של ניס בוטיק קייטרינג' : 'Branded fresh salad cups prepared by Nis Boutique Catering'}
            width="1080"
            height="1920"
            language={language}
            recoveryHref="/projects/nis_boutique/"
            recoveryLabel={copy.caseStudyCta}
          />
          <figcaption>{language === 'he' ? 'ניס בוטיק קייטרינג / מדיית מוצר אמיתית' : 'Nis Boutique Catering / real product media'}</figcaption>
        </figure>
        <figure className="media-secondary media-secondary-top">
          <HomeEvidenceImage
            src="/assets/nis-salmon-skewers.webp"
            alt={language === 'he' ? 'שיפודי סלמון שהוכנו לאירוע של ניס בוטיק קייטרינג' : 'Salmon skewers prepared for a Nis Boutique Catering event'}
            width="1200"
            height="1600"
            language={language}
            recoveryHref="/projects/nis_boutique/"
            recoveryLabel={copy.caseStudyCta}
          />
        </figure>
        <figure className="media-secondary media-secondary-bottom">
          <HomeEvidenceImage
            src="/assets/nis-logo-card.jpg"
            alt={language === 'he' ? 'כרטיס המותג של ניס בוטיק קייטרינג' : 'Nis Boutique Catering brand card'}
            width="945"
            height="630"
            language={language}
            recoveryHref="/projects/nis_boutique/"
            recoveryLabel={copy.caseStudyCta}
          />
        </figure>
        </div>
      </div>

      <div className="decision-grid reveal" data-motion-key="nis-decisions" data-journey-beat="decision" data-cinema-window="0.56,0.86">
        <article>
          <span>01</span>
          <p className="decision-label">{copy.problemLabel}</p>
          <p>{localize(experience.problem)}</p>
        </article>
        <article className="is-highlighted">
          <span>02</span>
          <p className="decision-label">{copy.decisionLabel}</p>
          <p>{localize(experience.productDecision)}</p>
        </article>
        <article>
          <span>03</span>
          <p className="decision-label">{copy.proofLabel}</p>
          <p>{localize(experience.outcome)}</p>
        </article>
      </div>

      <div className="chapter-footer reveal" data-motion-key="nis-actions" data-journey-beat="proof" data-cinema-window="0.8,1">
        <div className="chapter-project-actions">
          <a
            className="project-link"
            href={localizedInternalPath('/projects/nis_boutique/', language)}
            id="nis-case-study-link"
            onClick={(event) => onProjectNavigate(event, localizedInternalPath('/projects/nis_boutique/', language))}
          >
            <span>{copy.caseStudyCta}</span>
            <ArrowRight size={22} weight="light" aria-hidden="true" />
          </a>
          <a
            className="project-live-link"
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${copy.visit}: ${project.title}`}
          >
            <span>{copy.visit}</span>
            <ArrowUpRight size={17} weight="light" aria-hidden="true" />
          </a>
        </div>
        <span className="next-world">{copy.next}</span>
      </div>
      <p className="project-giant-index" aria-hidden="true">01</p>
      </div>
    </section>
  );
}

function ProjectWorld({ language, onProjectNavigate, projectId }) {
  const world = projectWorlds[projectId];
  const project = getFlagshipProject(language, projectId);
  const experience = portfolioExperiences[projectId];
  const copy = content[language];
  const localize = (field) => field[language];

  return (
    <section
      className={`project-world project-world-${world.theme}`}
      data-cinema-track
      data-cinema-id={projectId}
      data-cinema-title={`${world.number} / ${localize(experience.category)}`}
      data-cinema-theme={world.theme}
      id={projectId}
      tabIndex="-1"
      data-focus-target
      data-cinema-anchor="0.18"
      data-journey-label={`${world.number} / ${localize(experience.category).toUpperCase()}`}
      data-journey-phase={world.theme}
      data-journey-route="home"
      data-journey-theme={world.theme}
      aria-labelledby={`${projectId}-title`}
    >
      <div className={`cinema-pin cinema-pin-project cinema-pin-${world.theme}`}>
      <WorldMechanism type={world.theme} />
      <div className="world-orbit" aria-hidden="true"><span /><span /><span /></div>
      <div className="chapter-intro reveal" data-motion-key={`${projectId}-intro`} data-journey-beat={world.theme === 'growth' ? 'registry' : 'branches'} data-cinema-window="0,0.4">
        <div className="chapter-number">{world.number}</div>
        <div>
          <p className="chapter-kicker">{localize(experience.category)}</p>
          <h2 id={`${projectId}-title`}>{project.title}</h2>
          <p className="chapter-lead">{localize(experience.lead)}</p>
        </div>
      </div>

      <figure className="world-product reveal" data-motion-key={`${projectId}-media`} data-journey-beat="product" data-journey-camera data-cinema-window="0.12,0.82">
        <div className="proof-browser-bar" aria-hidden="true"><span /><span /><span /><strong>{project.liveUrl.replace('https://', '').replace('/', '')}</strong></div>
        <HomeEvidencePicture
          src={world.capture}
          mobileSrc={world.mobileCapture}
          alt={language === 'he' ? `צילום מסך מהמוצר החי ${project.title}` : `${project.title} live product`}
          language={language}
          recoveryHref={world.route}
          recoveryLabel={copy.caseStudyCta}
        />
        <figcaption>
          <span>{language === 'he' ? 'חי / מאומת' : 'LIVE / VERIFIED'}</span>
          <strong>{project.title}</strong>
          <p>{localize(world.proofLabel)}</p>
        </figcaption>
      </figure>

      <div className="decision-grid reveal" data-motion-key={`${projectId}-decisions`} data-journey-beat="decision" data-cinema-window="0.56,0.86">
        <article><span>01</span><p className="decision-label">{copy.problemLabel}</p><p>{localize(experience.problem)}</p></article>
        <article className="is-highlighted"><span>02</span><p className="decision-label">{copy.decisionLabel}</p><p>{localize(experience.productDecision)}</p></article>
        <article><span>03</span><p className="decision-label">{copy.proofLabel}</p><p>{localize(experience.outcome)}</p></article>
      </div>

      <div className="chapter-footer reveal" data-motion-key={`${projectId}-actions`} data-journey-beat="proof" data-cinema-window="0.8,1">
        <div className="chapter-project-actions">
          <a
            className="project-link"
            id={`${projectId}-case-study-link`}
            href={localizedInternalPath(world.route, language)}
            onClick={(event) => onProjectNavigate(event, localizedInternalPath(world.route, language))}
          >
            <span>{copy.caseStudyCta}</span><ArrowRight size={22} weight="light" aria-hidden="true" />
          </a>
          <a
            className="project-live-link"
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${copy.visit}: ${project.title}`}
          >
            <span>{copy.visit}</span><ArrowUpRight size={17} weight="light" aria-hidden="true" />
          </a>
        </div>
        <span className="next-world">{localize(world.next)}</span>
      </div>
      <p className="project-giant-index" aria-hidden="true">{world.number}</p>
      </div>
    </section>
  );
}

function MoreWorkSection({ language }) {
  const copy = closingContent[language];
  const projects = getRemainingPortfolioProjects(language);

  return (
    <section
      className="more-work-world"
      data-cinema-track
      data-cinema-id="more_work"
      data-cinema-title={language === 'he' ? '04 / עוד עבודות' : '04 / More work'}
      data-cinema-theme="archive"
      id="more-work"
      tabIndex="-1"
      data-focus-target
      data-journey-label={language === 'he' ? '04 / עוד עבודות' : '04 / MORE WORK'}
      data-journey-phase="archive"
      data-journey-route="home"
      data-journey-theme="archive"
      aria-labelledby="more-work-title"
    >
      <div className="cinema-pin cinema-pin-more-work">
        <div className="archive-heading" data-cinema-window="0.02,0.88">
          <div>
            <p className="eyebrow">{copy.archiveEyebrow}</p>
            <h2 id="more-work-title">{copy.archiveTitle}</h2>
          </div>
          <p>{copy.archiveBody}</p>
        </div>
        <div className="archive-grid" data-cinema-window="0.2,0.98">
          {projects.map((project, index) => (
            <article key={project.id} style={{ '--archive-index': index }} data-journey-beat={`project-${index + 1}`}>
              <div className="archive-card-meta"><span>0{index + 4}</span><span>{project.status}</span></div>
              <h3>{project.title}</h3>
              <p>{project.summary || project.description}</p>
              <ul aria-label={language === 'he' ? 'טכנולוגיות' : 'Technologies'}>
                {project.tags.slice(0, 5).map((tag) => <li key={tag}><bdi dir="ltr">{tag}</bdi></li>)}
              </ul>
              <div className="archive-card-actions">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`${copy.archiveLive}: ${project.title}`}>
                    {copy.archiveLive}<ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )}
                <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${copy.archiveCode}: ${project.title}`}>
                  {copy.archiveCode}<ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="archive-watermark" aria-hidden="true">04—07</p>
      </div>
    </section>
  );
}

function AboutSection({ language }) {
  const copy = closingContent[language];
  return (
    <section
      className="about-world"
      data-cinema-track
      data-cinema-id="about"
      data-cinema-title={language === 'he' ? '05 / שיטה' : '05 / Method'}
      data-cinema-theme="method"
      id="about"
      tabIndex="-1"
      data-focus-target
      data-journey-label={language === 'he' ? '05 / שיטה' : '05 / METHOD'}
      data-journey-phase="about"
      data-journey-route="home"
      data-journey-theme="method"
      aria-labelledby="about-title"
    >
      <div className="cinema-pin cinema-pin-about">
      <div className="method-spine" aria-hidden="true"><span /><span /><span /><i /></div>
      <div className="about-copy reveal" data-motion-key="about-copy" data-journey-beat="constraint" data-cinema-window="0.04,0.9">
        <p className="eyebrow">{copy.aboutEyebrow}</p>
        <h2 id="about-title">{copy.aboutTitle}</h2>
        <p>{copy.aboutBody}</p>
      </div>
      <ol className="about-principles reveal" data-motion-key="about-principles" data-cinema-window="0.28,0.96">
        {copy.aboutPoints.map((point, index) => <li data-journey-beat={`principle-${index + 1}`} key={point}><span>0{index + 1}</span><strong>{point}</strong></li>)}
      </ol>
      <p className="method-watermark" aria-hidden="true" data-cinema-window="0.2,1">01 · 02 · 03</p>
      </div>
    </section>
  );
}

function CapabilitiesSection({ language }) {
  const copy = closingContent[language];
  const groups = getPortfolioCapabilityGroups(language);

  return (
    <section
      className="capabilities-world"
      data-cinema-track
      data-cinema-id="capabilities"
      data-cinema-title={language === 'he' ? '06 / יכולות' : '06 / Capabilities'}
      data-cinema-theme="capabilities"
      id="capabilities"
      tabIndex="-1"
      data-focus-target
      data-cinema-anchor="0.38"
      data-journey-label={language === 'he' ? '06 / יכולות' : '06 / CAPABILITIES'}
      data-journey-phase="capabilities"
      data-journey-route="home"
      data-journey-theme="capabilities"
      aria-labelledby="capabilities-title"
    >
      <div className="cinema-pin cinema-pin-capabilities">
        <div className="capabilities-heading" data-cinema-window="0.02,0.84">
          <div>
            <p className="eyebrow">{copy.capabilitiesEyebrow}</p>
            <h2 id="capabilities-title">{copy.capabilitiesTitle}</h2>
          </div>
          <p>{copy.capabilitiesBody}</p>
        </div>
        <div className="capabilities-grid" data-cinema-window="0.18,0.98">
          {groups.map((group, index) => (
            <article key={group.id} style={{ '--capability-index': index }} data-journey-beat={`capability-${index + 1}`}>
              <span>0{index + 1}</span>
              <h3>{group.label}</h3>
              <p>{group.description}</p>
              <ul aria-label={group.label}>
                {group.skills.map((skill) => <li key={skill}><bdi dir="ltr">{skill}</bdi></li>)}
              </ul>
            </article>
          ))}
        </div>
        <div className="capabilities-axis" aria-hidden="true"><i /><i /><i /></div>
      </div>
    </section>
  );
}

function LabSection({ language, onProjectNavigate }) {
  const copy = closingContent[language];
  const notes = getLatestBlogPostMetadata(language, 3);
  return (
    <section
      className="lab-world"
      data-cinema-track
      data-cinema-id="lab"
      data-cinema-title={language === 'he' ? '07 / כתיבה' : '07 / Writing'}
      data-cinema-theme="light"
      id="lab"
      tabIndex="-1"
      data-focus-target
      data-cinema-anchor="0.5"
      data-journey-label={language === 'he' ? '07 / רשימות שטח' : '07 / FIELD NOTES'}
      data-journey-phase="lab"
      data-journey-route="home"
      data-journey-theme="lab"
      aria-labelledby="lab-title"
    >
      <div className="cinema-pin cinema-pin-lab">
      <svg className="lab-telemetry" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 110 C180 110 205 36 390 36 C585 36 595 184 800 184 C1000 184 1010 110 1200 110" />
        <circle cx="390" cy="36" r="7" /><circle cx="800" cy="184" r="7" /><circle cx="1190" cy="110" r="7" />
      </svg>
      <div className="lab-heading reveal" data-motion-key="lab-heading" data-journey-beat="telemetry" data-cinema-window="0,0.78">
        <p className="eyebrow">{copy.labEyebrow}</p><h2 id="lab-title">{copy.labTitle}</h2><p>{copy.labBody}</p>
      </div>
      <div className="lab-grid reveal" data-motion-key="lab-grid" data-cinema-window="0.32,0.96">
        {notes.map((note, index) => {
          const destination = localizedInternalPath(`/blog/${note.slug}/`, language);
          return (
            <a
              id={`home-writing-${note.slug}`}
              href={destination}
              data-journey-beat={`note-${index + 1}`}
              key={note.slug}
              onClick={(event) => onProjectNavigate(event, destination)}
              aria-label={`${copy.read}: ${note.title}`}
            >
              <span>0{index + 1} / {note.tags.slice(0, 2).join(' / ')}</span>
              <h3>{note.title}</h3>
              <p className="lab-note-meta">{copy.published} {note.date} · {note.readTime}</p>
              <p>{copy.read}</p><ArrowRight size={19} weight="light" aria-hidden="true" />
            </a>
          );
        })}
      </div>
      <a
        id="home-writing-all"
        className="lab-all-link"
        href={localizedInternalPath('/blog/', language)}
        data-cinema-window="0.7,1"
        onClick={(event) => onProjectNavigate(event, localizedInternalPath('/blog/', language))}
      >
        {copy.allWriting}<ArrowRight size={18} weight="light" aria-hidden="true" />
      </a>
      </div>
    </section>
  );
}

function ContactSection({ language }) {
  const copy = closingContent[language];
  const emailAddress = profileLinks.email.replace(/^mailto:/, '');
  const emailSubject = language === 'he' ? 'שיחה על פרויקט חדש' : 'A conversation about a new project';
  const emailBody = language === 'he'
    ? 'היי אביתר, ראיתי את האתר שלך ורציתי לדבר על פרויקט.'
    : 'Hi Evyatar, I saw your site and wanted to talk about a project.';
  const emailHref = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  return (
    <section
      className="contact-world"
      data-cinema-track
      data-cinema-id="contact"
      data-cinema-title={language === 'he' ? '08 / התכנסות' : '08 / Convergence'}
      data-cinema-theme="contact"
      id="contact"
      tabIndex="-1"
      data-focus-target
      data-cinema-anchor="0.58"
      data-journey-label={language === 'he' ? '08 / התכנסות' : '08 / CONVERGENCE'}
      data-journey-phase="contact"
      data-journey-route="home"
      data-journey-theme="contact"
      aria-labelledby="contact-title"
    >
      <div className="cinema-pin cinema-pin-contact">
      <div className="contact-signal" aria-hidden="true"><span /><span /><span /></div>
      <div className="contact-copy reveal" data-motion-key="contact-copy" data-journey-beat="incoming" data-cinema-window="0.04,1">
        <p className="eyebrow">{copy.contactEyebrow}</p><h2 id="contact-title">{copy.contactTitle}</h2><p>{copy.contactBody}</p>
      </div>
      <div className="contact-actions reveal" data-motion-key="contact-actions" data-journey-beat="ready" data-cinema-window="0.32,1">
        <a className="button button-primary" href={`${profileLinks.whatsapp}?text=${encodeURIComponent(language === 'he' ? 'היי אביתר, ראיתי את האתר שלך ורציתי לדבר על פרויקט.' : 'Hi Evyatar, I saw your site and wanted to talk about a project.')}`} target="_blank" rel="noreferrer">{copy.whatsapp}<ArrowUpRight size={19} weight="light" aria-hidden="true" /></a>
        <a className="button button-secondary" href={emailHref}>{copy.email}<ArrowUpRight size={19} weight="light" aria-hidden="true" /></a>
        <a className="contact-linkedin" href={profileLinks.linkedin} target="_blank" rel="noreferrer">{copy.linkedin}<ArrowUpRight size={17} weight="light" aria-hidden="true" /></a>
      </div>
      <p className="contact-watermark" aria-hidden="true">LET'S BUILD</p>
      </div>
    </section>
  );
}

function HomeExperience({ language }) {
  const { onProjectNavigate, onStoryNavigate } = useOutletContext();

  useEffect(() => {
    document.title = language === 'he'
      ? 'אביתר חזן — מוצר, חוויה והנדסה'
      : 'Evyatar Hazan — Product, Experience & Engineering';
  }, [language]);

  return (
    <main id="main-content" className="route-main" tabIndex="-1" data-focus-target>
      <ForgeAct language={language}>
        <Hero language={language} onStoryNavigate={onStoryNavigate} />
        <ForgeCoreBeat language={language} />
        <SignalMap language={language} onStoryNavigate={onStoryNavigate} />
        <ForgeHandoff language={language} />
      </ForgeAct>
      <NisChapter language={language} onProjectNavigate={onProjectNavigate} />
      <ProjectWorld language={language} onProjectNavigate={onProjectNavigate} projectId="online_converter" />
      <ProjectWorld language={language} onProjectNavigate={onProjectNavigate} projectId="emergency_protocol" />
      <MoreWorkSection language={language} />
      <AboutSection language={language} />
      <CapabilitiesSection language={language} />
      <LabSection language={language} onProjectNavigate={onProjectNavigate} />
      <ContactSection language={language} />
    </main>
  );
}

function LegacyRouteBridge({ language }) {
  const location = useLocation();
  const copy = content[language];
  const destinationUrl = new URL(`https://evyatarhazan.com${location.pathname}${location.search}${location.hash}`);
  destinationUrl.searchParams.set('lang', language);
  const destination = destinationUrl.toString();
  const isCanonicalOrigin = window.location.origin === 'https://evyatarhazan.com';

  useEffect(() => {
    if (!isCanonicalOrigin) window.location.replace(destination);
  }, [destination, isCanonicalOrigin]);

  return (
    <main id="main-content" className="legacy-route-bridge" tabIndex="-1" data-focus-target>
      <p>{isCanonicalOrigin ? copy.unavailableRoute : copy.redirecting}</p>
      <a href={isCanonicalOrigin ? '/' : destination}>
        {isCanonicalOrigin ? copy.returnHome : copy.continueToRoute}
      </a>
    </main>
  );
}

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(() => {
    const queryLanguage = new URLSearchParams(window.location.search).get('lang');
    if (queryLanguage === 'en' || queryLanguage === 'he') return queryLanguage;
    try {
      const saved = window.localStorage.getItem('portfolio-language')
        || window.localStorage.getItem('i18nextLng');
      const normalized = saved?.slice(0, 2);
      if (normalized === 'en' || normalized === 'he') return normalized;
    } catch {
      // Storage can be unavailable in privacy-restricted contexts.
    }
    return window.navigator.language.toLowerCase().startsWith('he') ? 'he' : 'en';
  });
  const copy = content[language];

  useEffect(() => {
    try {
      window.localStorage.setItem('portfolio-language', language);
      window.localStorage.setItem('i18nextLng', language);
    } catch {
      // Language still works for the current visit when storage is unavailable.
    }
  }, [language]);

  const handleLanguageChange = () => {
    const nextLanguage = language === 'en' ? 'he' : 'en';
    const nextDestination = localizedInternalPath(
      `${location.pathname}${location.search}${location.hash}`,
      nextLanguage,
      location.search,
    );
    navigate(nextDestination, { replace: true, state: location.state });
    setLanguage(nextLanguage);
  };

  return (
    <Routes>
      <Route
        element={(
          <ExperienceShell
            language={language}
            copy={copy}
            onLanguageChange={handleLanguageChange}
          />
        )}
      >
        <Route index element={<HomeExperience language={language} />} />
        <Route path="projects/nis_boutique" element={<NisCaseStudy language={language} />} />
        <Route path="projects/online_converter" element={<ProjectCaseStudy language={language} projectId="online_converter" />} />
        <Route path="projects/emergency_protocol" element={<ProjectCaseStudy language={language} projectId="emergency_protocol" />} />
        <Route path="blog" element={<BlogIndex language={language} />} />
        <Route path="blog/:slug" element={<BlogPost language={language} />} />
        <Route path="*" element={<LegacyRouteBridge language={language} />} />
      </Route>
    </Routes>
  );
}
