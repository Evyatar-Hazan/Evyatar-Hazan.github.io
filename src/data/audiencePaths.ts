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
      en: 'When a product, workflow, or system blocks progress',
      he: 'כשמוצר, תהליך או מערכת מעכבים התקדמות',
    },
    title: {
      en: 'Turn a stalled workflow into a focused product decision.',
      he: 'הופכים תהליך שנתקע להחלטת מוצר ממוקדת.',
    },
    description: {
      en: 'When a workflow or system slows the next step, the team relying on it feels the friction. A first conversation can clarify what is blocked and what a useful outcome would look like.',
      he: 'כשתהליך או מערכת מאטים את הצעד הבא, הצוות שתלוי בהם מרגיש את החיכוך. שיחה ראשונה יכולה לחדד מה נעצר ואיך תיראה תוצאה שימושית.',
    },
    cta: {
      label: {
        en: "Describe what's blocking progress",
        he: 'לתאר מה מעכב את ההתקדמות',
      },
      target: { route: 'contact' },
    },
  },
  {
    id: 'recruiter',
    priority: 'secondary',
    audience: {
      en: 'Assess product engineering fit',
      he: 'לבחון התאמה מקצועית לפיתוח מוצר',
    },
    title: {
      en: 'See how problems are framed, trade-offs weighed, and working products delivered.',
      he: 'רואים איך מגדירים בעיה, שוקלים פשרות ומביאים מוצר עובד למסירה.',
    },
    description: {
      en: 'Selected case studies separate the challenge, my contribution, key tradeoffs, and the evidence available for each project.',
      he: 'קייס סטאדיז נבחרים מפרידים בין האתגר, התרומה שלי, הפשרות המרכזיות והראיות הזמינות לכל פרויקט.',
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
