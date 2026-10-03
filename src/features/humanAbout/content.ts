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
    en: 'I’m Evyatar, a software developer working across web and mobile products, full-stack systems, automation, accessibility, and applied AI.',
    he: 'אני אביתר, מפתח תוכנה שעובד על מוצרי Web ומובייל, מערכות Full Stack, אוטומציה, נגישות ויישומי AI.',
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
        en: 'My background connects product interfaces, backend and infrastructure work, cross-platform test automation, and computer-vision tooling.',
        he: 'הרקע שלי מחבר בין ממשקי מוצר, עבודת Backend ותשתיות, אוטומציית בדיקות חוצת פלטפורמות וכלי ראייה ממוחשבת.',
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
        en: 'I prefer clean, modular code and reusable foundations. Accessibility, clarity, and maintainability are part of the build from the start.',
        he: 'אני מעדיף קוד נקי ומודולרי ותשתיות לשימוש חוזר. נגישות, בהירות ותחזוקתיות הן חלק מהבנייה מההתחלה.',
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
        en: 'Work starts by clarifying the need and the desired outcome. From there, I connect experience, code, and infrastructure, validate the live result, and document the system for continued maintenance.',
        he: 'העבודה מתחילה בחידוד הצורך והתוצאה הרצויה. משם אני מחבר חוויה, קוד ותשתית, מאמת את התוצאה החיה ומתעד את המערכת להמשך תחזוקה.',
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
