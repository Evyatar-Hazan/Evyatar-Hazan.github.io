import type { PortfolioLanguage } from '../../data/portfolioCapabilities';

export type HumanAboutPillarId = 'background' | 'workingStyle' | 'collaboration';

export type HumanAboutSourceId =
  | 'verifiedProfessionalBackground'
  | 'verifiedWorkingPreferences'
  | 'canonicalDeliveryProcess';

type LocalizedCopy = Record<PortfolioLanguage, string>;

type HumanAboutPillar = {
  id: HumanAboutPillarId;
  sourceId: HumanAboutSourceId;
  title: LocalizedCopy;
  body: LocalizedCopy;
};

const humanAboutCopy = {
  eyebrow: {
    en: 'The person behind the work',
    he: 'האדם שמאחורי העבודה',
  },
  title: {
    en: 'Full-stack thinking, with a practical way of working.',
    he: 'חשיבה מקצה לקצה, בדרך עבודה מעשית.',
  },
  introduction: {
    en: 'I’m Evyatar, a software developer. This public portfolio focuses on web and mobile products, full-stack systems, automation, accessibility, and the evidence available for each area.',
    he: 'אני אביתר, מפתח תוכנה. הפורטפוליו הציבורי הזה מתמקד במוצרי Web ומובייל, מערכות Full Stack, אוטומציה, נגישות ובראיות הזמינות לכל תחום.',
  },
  pillars: [
    {
      id: 'background',
      sourceId: 'verifiedProfessionalBackground',
      title: {
        en: 'Background',
        he: 'רקע מקצועי',
      },
      body: {
        en: 'The public examples here cover product interfaces, backend and infrastructure work, test automation, and delivery. Areas without a public example are marked as evidence gaps instead of being presented as proven experience.',
        he: 'הדוגמאות הציבוריות כאן מכסות ממשקי מוצר, עבודת Backend ותשתיות, אוטומציית בדיקות ומסירה. תחומים שאין להם דוגמה ציבורית מסומנים כפערי ראיות במקום להיות מוצגים כניסיון מוכח.',
      },
    },
    {
      id: 'workingStyle',
      sourceId: 'verifiedWorkingPreferences',
      title: {
        en: 'Working style',
        he: 'סגנון עבודה',
      },
      body: {
        en: 'I aim for clean, modular code and reusable foundations, with accessibility, clarity, and maintainability treated as design goals. These are working preferences, not a guarantee of a particular outcome.',
        he: 'אני שואף לקוד נקי ומודולרי ולתשתיות לשימוש חוזר, ומתייחס לנגישות, בהירות ותחזוקתיות כיעדי תכנון. אלה העדפות עבודה, לא הבטחה לתוצאה מסוימת.',
      },
    },
    {
      id: 'collaboration',
      sourceId: 'canonicalDeliveryProcess',
      title: {
        en: 'Working together',
        he: 'איך עובדים יחד',
      },
      body: {
        en: 'The documented method starts by clarifying the need and desired outcome, then connects experience, code, infrastructure, verification, and handoff. The examples show the method in practice; they do not promise scope, timing, or results for future work.',
        he: 'דרך העבודה המתועדת מתחילה בחידוד הצורך והתוצאה הרצויה, ואז מחברת חוויה, קוד, תשתית, אימות ומסירה. הדוגמאות מראות את השיטה בפועל; הן אינן מבטיחות היקף, זמן או תוצאה בעבודה עתידית.',
      },
    },
  ] satisfies readonly HumanAboutPillar[],
};

export const humanAboutSourceIds = [
  'verifiedProfessionalBackground',
  'verifiedWorkingPreferences',
  'canonicalDeliveryProcess',
] as const satisfies readonly HumanAboutSourceId[];

export const getHumanAboutContent = (language: PortfolioLanguage) => ({
  eyebrow: humanAboutCopy.eyebrow[language],
  title: humanAboutCopy.title[language],
  introduction: humanAboutCopy.introduction[language],
  pillars: humanAboutCopy.pillars.map((pillar) => ({
    id: pillar.id,
    sourceId: pillar.sourceId,
    title: pillar.title[language],
    body: pillar.body[language],
  })),
});
