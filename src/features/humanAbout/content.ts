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
    en: 'For teams shaping a new product, improving an existing flow, or making a system easier to operate, this portfolio shows how interface, full-stack, automation, and accessibility decisions connect—and provides public evidence to help assess fit.',
    he: 'לצוותים שמגבשים מוצר חדש, משפרים תהליך קיים או הופכים מערכת לקלה יותר לתפעול, הפורטפוליו הזה מראה כיצד החלטות בממשק, ב־Full Stack, באוטומציה ובנגישות מתחברות — ומציג ראיות ציבוריות שעוזרות לבחון התאמה.',
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
        en: 'The public examples here connect decisions across product interfaces, backend and infrastructure, test automation, and delivery. That makes it possible to consider an interface choice together with the system that supports it and the evidence used to verify it. Areas without a public example remain marked as evidence gaps instead of proven experience.',
        he: 'הדוגמאות הציבוריות כאן מחברות החלטות בין ממשקי מוצר, Backend ותשתיות, אוטומציית בדיקות ומסירה. כך אפשר לבחון בחירת ממשק יחד עם המערכת שתומכת בה והראיות שמשמשות לאימותה. תחומים שאין להם דוגמה ציבורית נשארים מסומנים כפערי ראיות במקום כניסיון מוכח.',
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
        en: 'Clean, modular code and reusable foundations are intended to make the product easier for its owner or next team to understand, change, and maintain. Accessibility and clarity remain design goals so future work starts from a clearer foundation. These are working preferences, not a guarantee of a particular outcome.',
        he: 'קוד נקי ומודולרי ותשתיות לשימוש חוזר נועדו להקל על בעל המוצר או על הצוות הבא להבין את המוצר, לשנות אותו ולתחזק אותו. נגישות ובהירות נשארות חלק מיעדי התכנון, כדי שהמשך העבודה יתחיל מתשתית ברורה יותר. אלה העדפות עבודה, לא הבטחה לתוצאה מסוימת.',
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
        en: 'You bring the need, relevant context, constraints, and the outcome you want to reach. I take responsibility for turning them into a clear plan and connecting experience, code, infrastructure, verification, and handoff, with assumptions and evidence made visible. The intended output is a verified, maintainable implementation with a clear handoff, shaped to the agreed scope; this description does not set a fixed scope, timeline, or result for future work.',
        he: 'אתם מביאים את הצורך, ההקשר הרלוונטי, האילוצים והתוצאה שתרצו להשיג. באחריותי להפוך אותם לתוכנית ברורה ולחבר חוויה, קוד, תשתית, אימות ומסירה, תוך הצגת ההנחות והראיות. התוצר המיועד הוא מימוש מאומת ותחזוקתי עם העברה ברורה, בהתאם להיקף שסוכם; התיאור אינו קובע מראש היקף, לוח זמנים או תוצאה לעבודה עתידית.',
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
