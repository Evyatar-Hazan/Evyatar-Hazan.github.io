import type { PortfolioLanguage } from './portfolioCapabilities';

export const signatureInteractionStepIds = ['business', 'ui', 'api', 'data'] as const;

export type SignatureInteractionStepId = (typeof signatureInteractionStepIds)[number];

type SignatureInteractionStep = {
  id: SignatureInteractionStepId;
  label: string;
  summary: string;
  detail: string;
};

type SignatureInteractionCopy = {
  eyebrow: string;
  title: string;
  introduction: string;
  disclosure: string;
  steps: readonly SignatureInteractionStep[];
  outcomeLabel: string;
  outcome: string;
  controls: {
    next: string;
    restart: string;
    explore: string;
    stepAnnouncement: string;
  };
};

const signatureInteractionCopy = {
  en: {
    eyebrow: 'Optional system trace',
    title: 'Follow one need through the product.',
    introduction:
      'Select any layer, or trace the sequence, to see how a business need becomes a clear interface backed by a maintainable system.',
    disclosure: 'Synthetic illustration only. It sends nothing and stores nothing.',
    steps: [
      {
        id: 'business',
        label: 'Business need',
        summary: 'Turn incoming requests into clear next actions.',
        detail: 'Start with the decision the team needs to make, not with a technology choice.',
      },
      {
        id: 'ui',
        label: 'UI',
        summary: 'Make intent, ownership, and status visible.',
        detail: 'The interface gives people a readable path and keeps the next action close at hand.',
      },
      {
        id: 'api',
        label: 'API',
        summary: 'Validate intent and coordinate each transition.',
        detail: 'The application boundary translates the visible action into one predictable system operation.',
      },
      {
        id: 'data',
        label: 'Data',
        summary: 'Keep the current state and a minimal decision history.',
        detail: 'The data model preserves only what the product needs to stay understandable and maintainable.',
      },
    ],
    outcomeLabel: 'Product outcome',
    outcome: 'A clearer next action, with a system path the team can still understand.',
    controls: {
      next: 'Trace next layer',
      restart: 'Trace again',
      explore: 'Explore project evidence',
      stepAnnouncement: 'Selected layer',
    },
  },
  he: {
    eyebrow: 'מסלול מערכת אופציונלי',
    title: 'עקבו אחרי צורך אחד לאורך המוצר.',
    introduction:
      'בחרו שכבה או עברו לפי הסדר כדי לראות כיצד צורך עסקי הופך לממשק ברור שמגובה במערכת שאפשר לתחזק.',
    disclosure: 'המחשה סינתטית בלבד. היא לא שולחת ולא שומרת דבר.',
    steps: [
      {
        id: 'business',
        label: 'צורך עסקי',
        summary: 'להפוך בקשות נכנסות לפעולות המשך ברורות.',
        detail: 'מתחילים בהחלטה שהצוות צריך לקבל, ולא בבחירת טכנולוגיה.',
      },
      {
        id: 'ui',
        label: 'ממשק',
        summary: 'להציג כוונה, אחריות וסטטוס בצורה ברורה.',
        detail: 'הממשק נותן לאנשים מסלול קריא ומשאיר את הפעולה הבאה בהישג יד.',
      },
      {
        id: 'api',
        label: 'API',
        summary: 'לאמת את הכוונה ולתאם כל מעבר.',
        detail: 'גבול האפליקציה מתרגם את הפעולה הגלויה לפעולת מערכת אחת וצפויה.',
      },
      {
        id: 'data',
        label: 'נתונים',
        summary: 'לשמור מצב נוכחי והיסטוריית החלטות מצומצמת.',
        detail: 'מודל הנתונים שומר רק את מה שהמוצר צריך כדי להישאר מובן וניתן לתחזוקה.',
      },
    ],
    outcomeLabel: 'תוצאת מוצר',
    outcome: 'פעולת המשך ברורה יותר, עם מסלול מערכת שהצוות עדיין יכול להבין.',
    controls: {
      next: 'לשכבה הבאה',
      restart: 'להתחיל שוב',
      explore: 'לצפייה בראיות מהפרויקטים',
      stepAnnouncement: 'השכבה שנבחרה',
    },
  },
} as const satisfies Record<PortfolioLanguage, SignatureInteractionCopy>;

export const getSignatureInteractionCopy = (language: PortfolioLanguage) => (
  signatureInteractionCopy[language]
);
