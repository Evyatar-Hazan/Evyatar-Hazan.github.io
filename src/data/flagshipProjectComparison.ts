import {
  homepageFeaturedProjectIds,
  type ProjectId,
} from '../contracts/portfolio';
import type { PortfolioLanguage } from './portfolioCapabilities';

type LocalizedCopy = Record<PortfolioLanguage, string>;

export type FlagshipProjectComparisonRecord = {
  id: (typeof homepageFeaturedProjectIds)[number];
  title: LocalizedCopy;
  audience: LocalizedCopy;
  problem: LocalizedCopy;
  contribution: LocalizedCopy;
  evidence: LocalizedCopy;
};

export type FlagshipProjectComparisonLabels = {
  eyebrow: string;
  title: string;
  introduction: string;
  project: string;
  audience: string;
  problem: string;
  contribution: string;
  evidence: string;
  deepLink: string;
  openProject: (projectTitle: string) => string;
};

export const flagshipProjectComparisonCopy: Record<
  PortfolioLanguage,
  FlagshipProjectComparisonLabels
> = {
  en: {
    eyebrow: 'Choose where to go deeper',
    title: 'Four projects, compared at a glance',
    introduction:
      'Start with the audience, problem, contribution, and bounded public evidence. Open a project for the full story.',
    project: 'Project',
    audience: 'Audience',
    problem: 'Problem',
    contribution: "Owner's contribution",
    evidence: 'Outcome evidence',
    deepLink: 'Deep link',
    openProject: (projectTitle) => `Open ${projectTitle} case study`,
  },
  he: {
    eyebrow: 'בוחרים איפה להעמיק',
    title: 'ארבעה פרויקטים בהשוואה מהירה',
    introduction:
      'מתחילים בקהל, בבעיה, בתרומה ובהוכחה ציבורית תחומה. פותחים פרויקט כדי לקרוא את הסיפור המלא.',
    project: 'פרויקט',
    audience: 'קהל',
    problem: 'בעיה',
    contribution: 'התרומה שלי',
    evidence: 'הוכחת תוצאה',
    deepLink: 'קישור להעמקה',
    openProject: (projectTitle) => `פתיחת הקייס סטאדי של ${projectTitle}`,
  },
};

/**
 * Comparison copy is deliberately bounded to public artifacts and approved
 * project scope. It does not turn a live URL into a measured outcome claim.
 */
export const flagshipProjectComparisonRecords = [
  {
    id: 'nis_boutique',
    title: {
      en: 'Nis Boutique Catering',
      he: 'Nis Boutique Catering',
    },
    audience: {
      en: 'Owners of service businesses who need one clear inquiry path.',
      he: 'בעלי עסקי שירות שצריכים נתיב פנייה אחד וברור.',
    },
    problem: {
      en: 'Communicate quality, build trust, and invite contact without clutter or price-list overload.',
      he: 'להציג איכות, לבנות אמון ולהוביל לפנייה בלי עומס או מחירונים.',
    },
    contribution: {
      en: 'Discovery, conversion framing, copy, RTL UX, content architecture, testing, and deployment.',
      he: 'מחקר, מסגור המרה, קופי, חוויית RTL, ארכיטקטורת תוכן, בדיקות ופריסה.',
    },
    evidence: {
      en: 'Bounded public evidence: a live custom-domain site and public source repository. No conversion metric is claimed.',
      he: 'הוכחה ציבורית תחומה: אתר חי בדומיין מותאם וריפו מקור ציבורי. אין טענה למדד המרה.',
    },
  },
  {
    id: 'online_converter',
    title: {
      en: 'Online Converter',
      he: 'ממיר נתונים מקוון',
    },
    audience: {
      en: 'Developers and technical users who need local data conversion.',
      he: 'מפתחים ומשתמשים טכניים שצריכים המרת נתונים מקומית.',
    },
    problem: {
      en: 'Make a useful converter discoverable across tools and languages without weakening privacy.',
      he: 'להפוך ממיר שימושי לנגיש דרך כלים ושפות בלי להחליש את הפרטיות.',
    },
    contribution: {
      en: 'Product and information architecture, bilingual registry, privacy boundaries, SEO, testing, and deployment gates.',
      he: 'חשיבת מוצר ומידע, registry דו־לשוני, גבולות פרטיות, SEO, בדיקות ושערי פריסה.',
    },
    evidence: {
      en: 'Bounded public evidence: a live browser product and public source repository. No traffic, revenue, or adoption result is claimed.',
      he: 'הוכחה ציבורית תחומה: מוצר דפדפן חי וריפו מקור ציבורי. אין טענה לטראפיק, הכנסה או אימוץ.',
    },
  },
  {
    id: 'emergency_protocol',
    title: {
      en: 'Emergency Protocol Diagram',
      he: 'פרוטוקול חירום אינטראקטיבי',
    },
    audience: {
      en: 'Learners exploring and discussing a BLS pathway for learning and practice.',
      he: 'לומדים שמכירים מסלול BLS ודנים בו לצורכי למידה ותרגול.',
    },
    problem: {
      en: 'Make branching protocol logic easier to learn and discuss, especially on a phone.',
      he: 'להקל על למידה ודיון בלוגיקה מסועפת, במיוחד בטלפון.',
    },
    contribution: {
      en: 'Learning-flow design, Hebrew-first responsive UI, structured protocol and community architecture, Functions, D1, testing, and deployment.',
      he: 'עיצוב זרימת למידה, ממשק רספונסיבי בעברית תחילה, ארכיטקטורת פרוטוקול וקהילה, Functions, ‏D1, בדיקות ופריסה.',
    },
    evidence: {
      en: 'Bounded public evidence: a live learning product and public source repository using Functions and D1 in production. No medical validation or emergency-use claim.',
      he: 'הוכחה ציבורית תחומה: מוצר למידה חי וריפו מקור ציבורי, עם Functions ו־D1 בפרודקשן. אין טענה לאימות רפואי או לשימוש בזמן חירום.',
    },
  },
  {
    id: 'united_hatzalah',
    title: {
      en: 'United Hatzalah Shoham Branch',
      he: 'איחוד הצלה סניף שוהם',
    },
    audience: {
      en: 'Local nonprofits and operational teams maintaining a public presence.',
      he: 'עמותות מקומיות וצוותים תפעוליים שמתחזקים נוכחות ציבורית.',
    },
    problem: {
      en: 'Keep routine public content and media updates from becoming a code deployment every time.',
      he: 'למנוע מצב שבו כל עדכון שוטף של תוכן או מדיה הופך לפריסת קוד.',
    },
    contribution: {
      en: 'Frontend, backend, data models, media uploads, and CI workflows.',
      he: 'Frontend, ‏Backend, מודלי נתונים, העלאות מדיה ותהליכי CI.',
    },
    evidence: {
      en: 'Bounded public evidence: a live branch site and public source repository. No adoption or operational-efficiency metric is claimed.',
      he: 'הוכחה ציבורית תחומה: אתר סניף חי וריפו מקור ציבורי. אין טענה למדד אימוץ או יעילות תפעולית.',
    },
  },
] as const satisfies readonly FlagshipProjectComparisonRecord[];

const comparisonIds = flagshipProjectComparisonRecords.map(({ id }) => id);

if (
  comparisonIds.length !== homepageFeaturedProjectIds.length
  || comparisonIds.some((id: ProjectId, index) => id !== homepageFeaturedProjectIds[index])
) {
  throw new Error('Flagship comparison must preserve the canonical homepage project order.');
}
