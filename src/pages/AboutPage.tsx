import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Download,
  ExternalLink,
  FolderKanban,
  Github,
  Linkedin,
  Mail,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PersonStructuredData from '../components/PersonStructuredData';
import ServiceEngagements from '../components/sections/ServiceEngagements';
import WorkingPrinciples from '../components/sections/WorkingPrinciples';
import type { PortfolioRouteTarget } from '../contracts/portfolio';
import { profileLinks, publicCv } from '../data/profile';
import { getCapabilityProofGroups } from '../features/capability-proof/capabilityProofData';
import { getHumanAboutContent } from '../features/humanAbout/content';
import { usePageSeo } from '../hooks/usePageSeo';
import { localizedPath } from '../routing/portfolioRoutes';
import { getProfessionalTimeline } from '../data/professionalTimeline';

const pageCopy = {
  en: {
    eyebrow: 'Professional profile / evidence dossier',
    title: 'Evyatar Hazan',
    role: 'Full Stack Developer',
    bio: 'I’m Evyatar, a full-stack developer building web and mobile products from product framing through production verification. I work across React, Node.js, infrastructure, automation, accessibility, and applied AI.',
    projects: 'View project evidence',
    contact: 'Start a conversation',
    cv: 'Download CV',
    cvUpdated: 'Updated July 23, 2026',
    professionalLinks: 'Verified professional links',
    professionalLinksIntro: 'Public profiles and a direct email channel, collected in one place.',
    email: 'Email',
    evidenceBoundaryTitle: 'Evidence boundary',
    evidenceBoundary: 'The role and working preferences on this page are self-descriptions. Public projects and articles show the available evidence; no formal credential, employer history, years-of-experience total, or measured business outcome is implied unless a named source is shown.',
    evidenceProjects: 'Public projects',
    evidenceWriting: 'Technical writing',
    storyEyebrow: '01 / Professional story',
    storyTitle: 'A practical end-to-end view of product work.',
    humanNoteEyebrow: 'A human note',
    humanNoteTitle: 'Curiosity is part of the work.',
    humanNoteBody: 'I enjoy turning complexity into clarity—in an interface, a system, or a short article that captures something new I learned. That process is what keeps me curious from one project to the next.',
    capabilitiesEyebrow: '02 / Capability explorer',
    capabilitiesTitle: 'Select a field. Follow the evidence.',
    capabilitiesIntro: 'Each skill is labeled as used, learning, or exploring. Public work supports “used”; active study stays visibly separate; unsupported claims remain exploratory.',
    statusTitle: 'Knowledge status',
    statusLabels: { used: 'Used', learning: 'Learning', exploring: 'Exploring' },
    statusDescriptions: {
      used: 'Backed by public work',
      learning: 'Active structured learning',
      exploring: 'Listed without public-use evidence',
    },
    demonstrated: 'Demonstrated in public work',
    measured: 'Measured outcomes',
    noMeasured: 'No verified measured outcome is published for this capability. The references demonstrate implementation or technical reasoning only.',
    gap: 'Evidence boundary',
    project: 'Project',
    article: 'Article',
    processEyebrow: '03 / Working method',
    processTitle: 'From a real need to a result that can be checked.',
    processIntro: 'This is a delivery sequence, not an SLA or a promise about timing.',
  },
  he: {
    eyebrow: 'פרופיל מקצועי / תיק ראיות',
    title: 'אביתר חזן',
    role: 'Full Stack Developer',
    bio: 'אני אביתר, מפתח Full Stack שבונה מוצרי Web ומובייל מהגדרת המוצר ועד לאימות בפרודקשן. אני עובד עם React, Node.js, תשתיות, אוטומציה, נגישות ו־AI יישומי.',
    projects: 'לצפייה בראיות מהפרויקטים',
    contact: 'להתחיל שיחה',
    cv: 'להורדת קורות החיים',
    cvUpdated: 'עודכן ב־23 ביולי 2026',
    professionalLinks: 'קישורים מקצועיים מאומתים',
    professionalLinksIntro: 'פרופילים ציבוריים וערוץ אימייל ישיר, מרוכזים במקום אחד.',
    email: 'אימייל',
    evidenceBoundaryTitle: 'גבול הראיות',
    evidenceBoundary: 'התפקיד והעדפות העבודה בעמוד הזה הם תיאור עצמי. הפרויקטים והמאמרים הציבוריים מציגים את הראיות הזמינות; אין כאן טענה להסמכה רשמית, היסטוריית מעסיקים, מספר שנות ניסיון או תוצאה עסקית מדידה בלי מקור נקוב.',
    evidenceProjects: 'פרויקטים ציבוריים',
    evidenceWriting: 'כתיבה טכנית',
    storyEyebrow: '01 / הסיפור המקצועי',
    storyTitle: 'מבט מעשי מקצה לקצה על עבודת מוצר.',
    humanNoteEyebrow: 'הערה אישית',
    humanNoteTitle: 'סקרנות היא חלק מהעבודה.',
    humanNoteBody: 'אני נהנה להפוך מורכבות לבהירות — בממשק, במערכת או במאמר קצר שמסכם משהו חדש שלמדתי. התהליך הזה הוא מה ששומר על הסקרנות שלי מפרויקט לפרויקט.',
    capabilitiesEyebrow: '02 / מפת יכולות',
    capabilitiesTitle: 'בוחרים תחום ועוקבים אחרי הראיות.',
    capabilitiesIntro: 'כל מיומנות מסומנת כ־Used,‏ Learning או Exploring. עבודה ציבורית תומכת ב־Used, למידה פעילה נשארת נפרדת, וטענה ללא הוכחת שימוש נשארת Exploring.',
    statusTitle: 'מצב הידע',
    statusLabels: { used: 'Used', learning: 'Learning', exploring: 'Exploring' },
    statusDescriptions: {
      used: 'מגובה בעבודה ציבורית',
      learning: 'למידה מובנית פעילה',
      exploring: 'מופיע ללא ראיית שימוש ציבורית',
    },
    demonstrated: 'הודגם בעבודה ציבורית',
    measured: 'תוצאות מדידות',
    noMeasured: 'לא פורסמה תוצאה מדידה מאומתת עבור יכולת זו. ההפניות מדגימות מימוש או חשיבה טכנית בלבד.',
    gap: 'גבול הראיות',
    project: 'פרויקט',
    article: 'מאמר',
    processEyebrow: '03 / דרך העבודה',
    processTitle: 'מצורך אמיתי לתוצאה שאפשר לבדוק.',
    processIntro: 'זהו רצף מסירה מקצועי, לא SLA או הבטחה לזמן ביצוע.',
  },
} as const;

const deliverySteps: Array<{
  title: { en: string; he: string };
  body: { en: string; he: string };
  target?: PortfolioRouteTarget;
}> = [
  {
    title: { en: 'Clarify the need and desired outcome', he: 'מחדדים את הצורך והתוצאה הרצויה' },
    body: { en: 'Define the audience, the current constraint, and what should become easier or more reliable.', he: 'מגדירים את הקהל, את האילוץ הנוכחי ואת מה שצריך להפוך לברור, קל או אמין יותר.' },
    target: { route: 'project', id: 'nis_boutique' },
  },
  {
    title: { en: 'Choose the product and architecture decision', he: 'בוחרים החלטת מוצר וארכיטקטורה' },
    body: { en: 'Shape the smallest coherent system that supports the actual workflow and its constraints.', he: 'מעצבים את המערכת הקוהרנטית הקטנה ביותר שתומכת בתהליך האמיתי ובמגבלותיו.' },
    target: { route: 'article', id: 'small-project-architecture' },
  },
  {
    title: { en: 'Build the system', he: 'בונים את המערכת' },
    body: { en: 'Connect interface, application logic, data, and delivery foundations without hiding their boundaries.', he: 'מחברים ממשק, לוגיקה, נתונים ותשתית מסירה בלי להסתיר את הגבולות ביניהם.' },
    target: { route: 'project', id: 'emergency_protocol' },
  },
  {
    title: { en: 'Test and verify the live result', he: 'בודקים ומאמתים את התוצאה החיה' },
    body: { en: 'Use automated checks and production readback that match the claim being made.', he: 'משתמשים בבדיקות אוטומטיות וב־readback מהמערכת החיה שמתאימים לטענה שרוצים להוכיח.' },
    target: { route: 'article', id: 'tests-need-honest-environments' },
  },
  {
    title: { en: 'Hand off and document for maintenance', he: 'מוסרים ומתעדים להמשך תחזוקה' },
    body: { en: 'Leave a result that can be understood, operated, and changed after the first release.', he: 'משאירים תוצאה שאפשר להבין, לתפעל ולשנות גם אחרי השחרור הראשון.' },
    target: { route: 'article', id: 'deployment-is-product' },
  },
];

const AboutPage = () => {
  const { i18n } = useTranslation();
  const language = i18n.language === 'he' ? 'he' : 'en';
  const copy = pageCopy[language];
  const human = getHumanAboutContent(language);
  const timeline = getProfessionalTimeline(language);
  const groups = getCapabilityProofGroups(language);
  const location = useLocation();
  const navigate = useNavigate();
  const requestedCapability = new URLSearchParams(location.search).get('capability');
  const activeGroup = groups.find(({ id }) => id === requestedCapability) ?? groups[0];
  const ArrowIcon = language === 'he' ? ArrowLeft : ArrowRight;

  usePageSeo({
    title: language === 'he' ? 'אודות אביתר חזן | פרופיל מקצועי' : 'About Evyatar Hazan | Professional Profile',
    description: language === 'he'
      ? 'פרופיל מקצועי של אביתר חזן שמפריד בין תיאור עצמי והעדפות עבודה לבין ראיות ציבוריות מפרויקטים ומאמרים, עם גבולות מפורשים לפערי מידע.'
      : 'A professional profile for Evyatar Hazan that separates self-description and working preferences from public project and article evidence, with explicit boundaries for information gaps.',
    path: '/about/',
  });

  const selectCapability = (capability: string) => {
    const params = new URLSearchParams(location.search);
    params.set('capability', capability);
    navigate({ pathname: location.pathname, search: `?${params.toString()}`, hash: location.hash });
  };

  return (
    <main id="main-content" tabIndex={-1} className="about-dossier overflow-x-clip bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-white">
      <PersonStructuredData language={language} />

      <section className="relative overflow-hidden border-b border-neutral-300/80 pb-16 pt-28 dark:border-neutral-800 sm:pb-24 sm:pt-36">
        <div className="about-system-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="content-container relative grid gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:items-end">
          <div>
            <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.2em] text-primary-700 dark:text-primary-400">{copy.eyebrow}</p>
            <h1 tabIndex={-1} className="mt-6 max-w-[11ch] text-[clamp(4rem,10vw,9rem)] font-black leading-[0.82] tracking-[-0.075em]">{copy.title}</h1>
            <p className="mt-6 font-mono text-sm font-black uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">{copy.role}</p>
          </div>
          <div className="border-s-2 border-primary-500 ps-6">
            <p data-professional-bio className="max-w-2xl text-xl font-semibold leading-relaxed text-neutral-700 dark:text-neutral-200 sm:text-2xl">{copy.bio}</p>
            <nav aria-label={copy.professionalLinks} data-professional-links className="mt-8">
              <p className="font-mono text-[0.66rem] font-black uppercase tracking-[0.16em] text-primary-700 dark:text-primary-400">{copy.professionalLinks}</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">{copy.professionalLinksIntro}</p>
              <ul className="mt-4 flex flex-wrap gap-3">
                <li><a data-professional-link="github" href={profileLinks.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 border border-neutral-300 px-4 py-2 text-sm font-black hover:border-primary-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 dark:border-neutral-700"><Github aria-hidden="true" className="h-4 w-4" />GitHub</a></li>
                <li><a data-professional-link="linkedin" href={profileLinks.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 border border-neutral-300 px-4 py-2 text-sm font-black hover:border-primary-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 dark:border-neutral-700"><Linkedin aria-hidden="true" className="h-4 w-4" />LinkedIn</a></li>
                <li><a data-professional-link="email" href={profileLinks.email} className="inline-flex min-h-11 items-center gap-2 border border-neutral-300 px-4 py-2 text-sm font-black hover:border-primary-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 dark:border-neutral-700"><Mail aria-hidden="true" className="h-4 w-4" />{copy.email}</a></li>
              </ul>
            </nav>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link to={localizedPath(language, { route: 'projects' })} className="inline-flex min-h-12 items-center justify-between gap-4 bg-neutral-950 px-5 py-3 text-sm font-black text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 dark:bg-surface-raised dark:text-content-primary">{copy.projects}<ArrowIcon aria-hidden="true" className="h-4 w-4" /></Link>
              <Link to={localizedPath(language, { route: 'contact' })} className="inline-flex min-h-12 items-center justify-between gap-4 border border-neutral-950 px-5 py-3 text-sm font-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 dark:border-content-primary">{copy.contact}<ArrowIcon aria-hidden="true" className="h-4 w-4" /></Link>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <a
                href={profileLinks.cv}
                download={publicCv.downloadName}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-black text-primary-700 underline decoration-2 underline-offset-4 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-500 dark:text-primary-300 dark:hover:text-primary-100"
              >
                <Download aria-hidden="true" className="h-4 w-4" />
                {copy.cv}
              </a>
              <time dateTime={publicCv.updatedAt} className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
                {copy.cvUpdated}
              </time>
            </div>
            <aside data-about-evidence-boundary className="mt-6 border-t border-neutral-300 pt-5 dark:border-neutral-700">
              <h2 className="font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">{copy.evidenceBoundaryTitle}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">{copy.evidenceBoundary}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-black">
                <Link className="inline-flex min-h-11 items-center underline decoration-primary-500/40 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500" to={localizedPath(language, { route: 'projects' })}>{copy.evidenceProjects}</Link>
                <Link className="inline-flex min-h-11 items-center underline decoration-primary-500/40 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500" to={localizedPath(language, { route: 'blog' })}>{copy.evidenceWriting}</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section aria-labelledby="about-story-title" className="section-space relative">
        <div className="content-container">
          <header className="grid gap-6 border-b border-neutral-300/80 pb-10 dark:border-neutral-800 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div><p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary-700 dark:text-primary-400">{copy.storyEyebrow}</p><h2 id="about-story-title" className="mt-5 max-w-[13ch] text-[clamp(2.6rem,6vw,5.8rem)] font-black leading-[0.92] tracking-[-0.055em]">{copy.storyTitle}</h2></div>
            <p className="max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300 lg:justify-self-end">{human.introduction}</p>
          </header>
          <div className="grid divide-y divide-neutral-300/80 dark:divide-neutral-800 lg:grid-cols-3 lg:divide-x lg:divide-y-0 rtl:lg:divide-x-reverse">
            {human.pillars.map((pillar, index) => <article key={pillar.id} className="py-8 lg:px-8 lg:py-12 lg:first:ps-0"><p className="font-mono text-xs font-black text-primary-700 dark:text-primary-400">0{index + 1}</p><h3 className="mt-4 text-2xl font-black">{pillar.title}</h3><p className="mt-4 text-base leading-8 text-neutral-600 dark:text-neutral-400">{pillar.body}</p></article>)}
          </div>
          <div className="border-t border-neutral-300/80 pt-10 dark:border-neutral-800 lg:pt-14">
            <header className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary-700 dark:text-primary-400">{timeline.eyebrow}</p>
                <h3 id="professional-timeline-title" className="mt-4 max-w-[18ch] text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">{timeline.title}</h3>
              </div>
              <p className="max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-400 lg:justify-self-end">{timeline.introduction}</p>
            </header>
            <ol aria-labelledby="professional-timeline-title" className="mt-9 grid gap-0" data-professional-timeline>
              {timeline.entries.map((entry, index) => (
                <li key={entry.id} data-timeline-entry={entry.id} className="relative grid gap-3 border-s-2 border-neutral-300 py-7 ps-7 dark:border-neutral-700 sm:grid-cols-[8rem_minmax(12rem,0.75fr)_minmax(0,1.25fr)] sm:items-start sm:gap-6 sm:ps-9">
                  <span aria-hidden="true" className="absolute -start-[0.48rem] top-8 h-3.5 w-3.5 rounded-full border-[3px] border-neutral-50 bg-primary-600 ring-1 ring-primary-600 dark:border-neutral-950 dark:bg-primary-400 dark:ring-primary-400" />
                  <p className="font-mono text-sm font-black text-primary-700 dark:text-primary-400"><span className="sr-only">{language === 'he' ? `שלב ${index + 1}: ` : `Stage ${index + 1}: `}</span>{entry.period}</p>
                  <h4 className="text-xl font-black leading-snug">{entry.role}</h4>
                  <p className="max-w-3xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">{entry.impact}</p>
                </li>
              ))}
            </ol>
          </div>
          <aside aria-labelledby="human-note-title" className="mt-10 grid gap-4 border-t border-neutral-300/80 pt-8 dark:border-neutral-800 sm:grid-cols-[minmax(8rem,0.28fr)_minmax(0,1fr)] sm:items-start sm:gap-8">
            <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary-700 dark:text-primary-400">{copy.humanNoteEyebrow}</p>
            <div className="max-w-3xl">
              <h3 id="human-note-title" className="text-2xl font-black tracking-tight sm:text-3xl">{copy.humanNoteTitle}</h3>
              <p className="mt-3 text-base leading-8 text-neutral-600 dark:text-neutral-300">{copy.humanNoteBody}</p>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="capability-explorer-title" className="section-space border-y border-neutral-300/80 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="content-container">
          <header className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div><p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary-700 dark:text-primary-400">{copy.capabilitiesEyebrow}</p><h2 id="capability-explorer-title" className="mt-5 max-w-[14ch] text-[clamp(2.6rem,6vw,5.8rem)] font-black leading-[0.92] tracking-[-0.055em]">{copy.capabilitiesTitle}</h2></div>
            <p className="max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-300 lg:justify-self-end">{copy.capabilitiesIntro}</p>
          </header>
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(15rem,0.34fr)_minmax(0,1fr)]">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1" aria-label={copy.capabilitiesTitle}>
              {groups.map((group, index) => <button key={group.id} type="button" aria-pressed={activeGroup.id === group.id} aria-controls="capability-panel" onClick={() => selectCapability(group.id)} className="group flex min-h-12 items-center justify-between gap-4 border border-neutral-300 px-4 py-3 text-start text-sm font-black transition-colors hover:border-primary-500 aria-pressed:border-primary-600 aria-pressed:bg-primary-50 aria-pressed:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:border-neutral-700 dark:aria-pressed:bg-primary-950 dark:aria-pressed:text-primary-100"><span><span className="me-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">{String(index + 1).padStart(2, '0')}</span>{group.label}</span><span aria-hidden="true">→</span></button>)}
            </div>
            <article id="capability-panel" aria-live="polite" data-capability-id={activeGroup.id} className="border border-neutral-300 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-950 sm:p-8">
              <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr]">
                <header>
                  <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-primary-700 dark:text-primary-400">Capability / {activeGroup.id}</p>
                  <h3 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{activeGroup.label}</h3>
                  <p className="mt-4 text-base leading-7 text-neutral-600 dark:text-neutral-400">{activeGroup.description}</p>
                  <div className="mt-6 border-y border-neutral-300 py-4 dark:border-neutral-700">
                    <h4 className="font-mono text-[0.62rem] font-black uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">{copy.statusTitle}</h4>
                    <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                      {(['used', 'learning', 'exploring'] as const).map((status) => <div key={status} className="grid grid-cols-[auto_1fr] items-start gap-2"><dt className="font-mono font-black uppercase text-primary-700 dark:text-primary-300">{copy.statusLabels[status]}</dt><dd className="text-neutral-500 dark:text-neutral-400">{copy.statusDescriptions[status]}</dd></div>)}
                    </dl>
                  </div>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2" aria-label={activeGroup.label}>
                    {activeGroup.skillStatuses.map((skill) => <li key={skill.name} data-skill-status={skill.status} className="flex min-h-11 items-center justify-between gap-3 border border-neutral-300 px-3 py-2 dark:border-neutral-700"><span className="font-mono text-[0.68rem] font-bold uppercase">{skill.name}</span><span className="shrink-0 border border-current px-2 py-1 font-mono text-[0.56rem] font-black uppercase tracking-[0.08em] text-primary-700 dark:text-primary-300">{copy.statusLabels[skill.status]}</span></li>)}
                  </ul>
                </header>
                <div className="grid gap-7 md:grid-cols-2">
                  <div><h4 className="font-mono text-xs font-black uppercase tracking-[0.16em]">{copy.demonstrated}</h4>{activeGroup.demonstrations.length ? <ul data-evidence-demonstrations className="mt-3 divide-y divide-neutral-300 dark:divide-neutral-800">{activeGroup.demonstrations.map((item) => { const internal = item.kind === 'article' || item.hasCaseStudy; const href = item.kind === 'article' ? localizedPath(language, { route: 'article', id: item.id }) : item.hasCaseStudy ? localizedPath(language, { route: 'project', id: item.id }) : item.githubUrl; return <li key={`${item.kind}:${item.id}`}><a href={href} {...(!internal ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="grid min-h-12 grid-cols-[auto_1fr_auto] gap-3 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">{item.kind === 'project' ? <FolderKanban aria-hidden="true" className="mt-1 h-4 w-4 text-primary-600" /> : <BookOpenText aria-hidden="true" className="mt-1 h-4 w-4 text-primary-600" />}<span><span className="block font-mono text-[0.6rem] font-black uppercase text-neutral-500">{item.kind === 'project' ? copy.project : copy.article}</span><span className="mt-1 block text-sm font-black">{item.title}</span></span>{!internal && <ExternalLink aria-hidden="true" className="h-4 w-4" />}</a></li>; })}</ul> : null}{activeGroup.publicEvidenceGap && <div data-evidence-gap className="mt-5 border-s-2 border-warning-300 ps-4"><h4 className="font-mono text-[0.62rem] font-black uppercase tracking-[0.14em] text-warning-700 dark:text-warning-300">{copy.gap}</h4><p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{activeGroup.publicEvidenceGap}</p></div>}</div>
                  <div className="border-s border-neutral-300 ps-5 dark:border-neutral-800"><h4 className="font-mono text-xs font-black uppercase tracking-[0.16em]">{copy.measured}</h4>{activeGroup.measuredOutcomes.length ? <ul className="mt-3">{activeGroup.measuredOutcomes.map((outcome) => <li key={outcome.projectId} className="border-t border-neutral-300 py-4 dark:border-neutral-800"><strong>{outcome.projectTitle}</strong></li>)}</ul> : <p className="mt-3 border-t border-neutral-300 pt-4 text-sm leading-6 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">{copy.noMeasured}</p>}</div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section aria-labelledby="delivery-process-title" className="section-space relative">
        <div className="content-container"><header className="grid gap-6 border-b border-neutral-300/80 pb-10 dark:border-neutral-800 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary-700 dark:text-primary-400">{copy.processEyebrow}</p><h2 id="delivery-process-title" className="mt-5 max-w-[14ch] text-[clamp(2.6rem,6vw,5.8rem)] font-black leading-[0.92] tracking-[-0.055em]">{copy.processTitle}</h2></div><p className="text-base leading-8 text-neutral-600 dark:text-neutral-400 lg:justify-self-end">{copy.processIntro}</p></header>
          <ol className="divide-y divide-neutral-300/80 dark:divide-neutral-800">{deliverySteps.map((step, index) => <li key={step.title.en} className="grid gap-4 py-7 sm:grid-cols-[4rem_minmax(12rem,0.8fr)_minmax(0,1.2fr)_auto] sm:items-center"><span className="font-mono text-3xl font-black text-primary-600 dark:text-primary-400">{String(index + 1).padStart(2, '0')}</span><h3 className="text-xl font-black">{step.title[language]}</h3><p className="text-sm leading-7 text-neutral-600 dark:text-neutral-400">{step.body[language]}</p>{step.target && <Link aria-label={`${step.title[language]} — ${language === 'he' ? 'לצפייה בדוגמה' : 'View example'}`} to={localizedPath(language, step.target)} className="inline-flex min-h-11 items-center gap-2 text-sm font-black text-primary-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:text-primary-300">{language === 'he' ? 'דוגמה' : 'Example'}<ArrowIcon aria-hidden="true" className="h-4 w-4" /></Link>}</li>)}</ol>
        </div>
      </section>

      <WorkingPrinciples language={language} localizedPath={localizedPath} />
      <ServiceEngagements language={language} buildPath={localizedPath} />
    </main>
  );
};

export default AboutPage;
