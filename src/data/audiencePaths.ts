import type { PortfolioRouteTarget } from '../contracts/portfolio';
import type { PortfolioLanguage } from './portfolioCapabilities';

export const audiencePathIds = ['product-partner', 'recruiter', 'technical-reader'] as const;

export type AudiencePathId = (typeof audiencePathIds)[number];

type LocalizedText = Record<PortfolioLanguage, string>;

type AudiencePathTarget = Extract<
  PortfolioRouteTarget,
  { route: 'blog' | 'contact' | 'projects' }
>;

export type AudiencePath = {
  id: AudiencePathId;
  priority: 'primary' | 'secondary';
  audience: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  cta: {
    label: LocalizedText;
    target: AudiencePathTarget;
  };
};

/**
 * Three concise entrances into existing portfolio content. They establish audience
 * priority without claiming employment availability or duplicating downstream
 * project, capability, or contact content.
 */
export const audiencePaths: readonly AudiencePath[] = [
  {
    id: 'product-partner',
    priority: 'primary',
    audience: {
      en: 'Business owners, founders & product teams',
      he: 'בעלי עסקים, יזמים וצוותי מוצר',
    },
    title: {
      en: 'Move a real need forward with a web product that works.',
      he: 'מקדמים צורך אמיתי בעזרת מוצר Web שעובד.',
    },
    description: {
      en: 'Bring the goal, workflow, or system that is holding the next step back. The first conversation focuses on the need and the useful outcome.',
      he: 'מביאים את היעד, התהליך או המערכת שמעכבים את הצעד הבא. השיחה הראשונה מתמקדת בצורך ובתוצאה שתהיה שימושית.',
    },
    cta: {
      label: {
        en: 'Discuss a product or system',
        he: 'לדבר על מוצר או מערכת',
      },
      target: { route: 'contact' },
    },
  },
  {
    id: 'recruiter',
    priority: 'secondary',
    audience: {
      en: 'Recruiters & technical leaders',
      he: 'מגייסים ומנהלים טכנולוגיים',
    },
    title: {
      en: 'See product thinking, engineering, and delivery in practice.',
      he: 'רואים חשיבה מוצרית, הנדסה ומסירה בפועל.',
    },
    description: {
      en: 'Selected case studies present the challenge, the solution, the contribution, and the live result in a concise format.',
      he: 'קייס סטאדיז נבחרים מציגים בקצרה את האתגר, הפתרון, התרומה והתוצאה החיה.',
    },
    cta: {
      label: {
        en: 'Review selected work',
        he: 'לצפייה בעבודות נבחרות',
      },
      target: { route: 'projects' },
    },
  },
  {
    id: 'technical-reader',
    priority: 'secondary',
    audience: {
      en: 'Technical readers & fellow builders',
      he: 'קוראים טכניים ואנשי פיתוח',
    },
    title: {
      en: 'Follow the decisions behind the finished product.',
      he: 'קוראים את ההחלטות שמאחורי המוצר המוגמר.',
    },
    description: {
      en: 'Technical notes unpack the trade-offs, tests, and delivery lessons behind the work.',
      he: 'הכתיבה הטכנית מפרקת את הפשרות, הבדיקות ולקחי המסירה שמאחורי העבודה.',
    },
    cta: {
      label: {
        en: 'Read the technical notes',
        he: 'לקריאת הכתיבה הטכנית',
      },
      target: { route: 'blog' },
    },
  },
] as const;

export const getAudiencePaths = (language: PortfolioLanguage) => (
  audiencePaths.map((path) => ({
    id: path.id,
    priority: path.priority,
    audience: path.audience[language],
    title: path.title[language],
    description: path.description[language],
    cta: {
      label: path.cta.label[language],
      target: path.cta.target,
    },
  }))
);
