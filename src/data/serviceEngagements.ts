import type { ProjectId, PortfolioRouteTarget } from '../contracts/portfolio';
import type { PortfolioLanguage } from './portfolioCapabilities';

export const serviceEngagementIds = [
  'new-public-product',
  'internal-full-stack-system',
  'improve-existing-system',
] as const;

export type ServiceEngagementId = (typeof serviceEngagementIds)[number];

type LocalizedText = Record<PortfolioLanguage, string>;

export type ServiceEngagement = {
  id: ServiceEngagementId;
  title: LocalizedText;
  audience: LocalizedText;
  deliverables: Record<PortfolioLanguage, readonly [string, ...string[]]>;
  proof: {
    projectId: ProjectId;
    summary: LocalizedText;
    label: LocalizedText;
  };
  cta: {
    label: LocalizedText;
    target: Extract<PortfolioRouteTarget, { route: 'contact' }>;
  };
};

/**
 * Three factual starting points for portfolio conversations. The records describe
 * common work shapes and point to existing public proof; they are not packages,
 * delivery promises, or commercial terms.
 */
export const serviceEngagements: readonly ServiceEngagement[] = [
  {
    id: 'new-public-product',
    title: {
      en: 'A new public product or site',
      he: 'מוצר או אתר ציבורי חדש',
    },
    audience: {
      en: 'Business owners and founders preparing a first public-facing site or web product.',
      he: 'בעלי עסקים ויזמים שמכינים אתר או מוצר Web ציבורי ראשון.',
    },
    deliverables: {
      en: [
        'Problem, audience, and content framing',
        'Responsive product interface',
        'Launch setup with practical SEO and validation',
      ],
      he: [
        'מיקוד הבעיה, הקהל והתוכן',
        'ממשק מוצר רספונסיבי',
        'הכנה להשקה עם SEO פרקטי ובדיקות',
      ],
    },
    proof: {
      projectId: 'nis_boutique',
      summary: {
        en: 'Nis Boutique Catering is a live RTL business site shaped around trust, practical SEO, and a clear WhatsApp inquiry path.',
        he: 'Nis Boutique Catering הוא אתר עסקי חי ב־RTL, שנבנה סביב אמון, SEO פרקטי ונתיב ברור לפנייה ב־WhatsApp.',
      },
      label: {
        en: 'See the public-site case study',
        he: 'לקייס הסטאדי של האתר הציבורי',
      },
    },
    cta: {
      label: {
        en: 'Discuss a new public product',
        he: 'לדבר על מוצר ציבורי חדש',
      },
      target: { route: 'contact' },
    },
  },
  {
    id: 'internal-full-stack-system',
    title: {
      en: 'An internal or full-stack system',
      he: 'מערכת פנימית או Full Stack',
    },
    audience: {
      en: 'Teams turning operational knowledge or a complex workflow into a maintainable working system.',
      he: 'צוותים שהופכים ידע תפעולי או תהליך מורכב למערכת עבודה שניתן לתחזק.',
    },
    deliverables: {
      en: [
        'Workflow and responsibility mapping',
        'Product interface with API and data foundations',
        'Authentication, validation, and deployment where relevant',
      ],
      he: [
        'מיפוי התהליך וגבולות האחריות',
        'ממשק מוצר עם תשתית API ונתונים',
        'אימות, בדיקות ופריסה כאשר הם רלוונטיים',
      ],
    },
    proof: {
      projectId: 'emergency_protocol',
      summary: {
        en: 'Emergency Protocol turns complex protocol material into an interactive full-stack workspace with users, authentication, and discussion flows.',
        he: 'Emergency Protocol הופך תוכן פרוטוקול מורכב למרחב עבודה אינטראקטיבי ב־Full Stack עם משתמשים, אימות וזרימות דיון.',
      },
      label: {
        en: 'See the full-stack case study',
        he: 'לקייס הסטאדי של מערכת ה־Full Stack',
      },
    },
    cta: {
      label: {
        en: 'Discuss a team system',
        he: 'לדבר על מערכת לצוות',
      },
      target: { route: 'contact' },
    },
  },
  {
    id: 'improve-existing-system',
    title: {
      en: 'Improve an existing system',
      he: 'שיפור מערכת קיימת',
    },
    audience: {
      en: 'Teams with a live product whose experience, structure, discovery, or validation is limiting the next step.',
      he: 'צוותים עם מוצר חי שחוויית השימוש, המבנה, הגילוי או הבדיקות שלו מגבילים את הצעד הבא.',
    },
    deliverables: {
      en: [
        'Focused product and technical review',
        'Prioritized UX, architecture, or discovery improvements',
        'Regression checks and release evidence',
      ],
      he: [
        'סקירת מוצר וטכנולוגיה ממוקדת',
        'תיעדוף שיפורי UX, ארכיטקטורה או גילוי',
        'בדיקות רגרסיה וראיות לשחרור',
      ],
    },
    proof: {
      projectId: 'online_converter',
      summary: {
        en: 'Online Converter grew from a small browser utility into a bilingual, registry-driven product with structured metadata and quality gates.',
        he: 'Online Converter התפתח מכלי דפדפן קטן למוצר דו־לשוני מבוסס registry, עם metadata מסודר ושערי איכות.',
      },
      label: {
        en: 'See the product-improvement case study',
        he: 'לקייס הסטאדי של שיפור המוצר',
      },
    },
    cta: {
      label: {
        en: 'Discuss an existing system',
        he: 'לדבר על מערכת קיימת',
      },
      target: { route: 'contact' },
    },
  },
] as const;

export const getServiceEngagements = (language: PortfolioLanguage) => (
  serviceEngagements.map((engagement) => ({
    id: engagement.id,
    title: engagement.title[language],
    audience: engagement.audience[language],
    deliverables: engagement.deliverables[language],
    proof: {
      projectId: engagement.proof.projectId,
      summary: engagement.proof.summary[language],
      label: engagement.proof.label[language],
    },
    cta: {
      label: engagement.cta.label[language],
      target: engagement.cta.target,
    },
  }))
);
