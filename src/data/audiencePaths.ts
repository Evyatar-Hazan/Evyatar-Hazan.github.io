import type { PortfolioRouteTarget } from '../contracts/portfolio';
import type { PortfolioLanguage } from './portfolioCapabilities';

export const audiencePathIds = ['product-partner', 'recruiter'] as const;

export type AudiencePathId = (typeof audiencePathIds)[number];

type LocalizedText = Record<PortfolioLanguage, string>;

type AudiencePathTarget = Extract<
  PortfolioRouteTarget,
  { route: 'contact' | 'projects' }
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
 * Two concise entrances into existing portfolio content. They establish audience
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
      en: 'I turn a real need into a web product that works.',
      he: 'אני הופך צורך אמיתי למוצר Web שעובד.',
    },
    description: {
      en: 'Bring the goal, workflow, or system that needs to move forward. Start with a direct conversation about the product need.',
      he: 'מביאים את היעד, התהליך או המערכת שצריכים להתקדם. מתחילים בשיחה ישירה על הצורך המוצרי.',
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
      en: 'Review the product thinking behind the code.',
      he: 'בוחנים את החשיבה המוצרית שמאחורי הקוד.',
    },
    description: {
      en: 'Selected case studies show the need, product decision, system, contribution, and public proof.',
      he: 'קייס סטאדיז נבחרים מציגים את הצורך, החלטת המוצר, המערכת, התרומה וההוכחה הציבורית.',
    },
    cta: {
      label: {
        en: 'Review selected work',
        he: 'לצפייה בעבודות נבחרות',
      },
      target: { route: 'projects' },
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
