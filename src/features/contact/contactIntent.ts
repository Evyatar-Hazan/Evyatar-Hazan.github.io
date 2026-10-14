import type { PortfolioLanguage } from '../../data/portfolioCapabilities';
import {
  getPortfolioProjectById,
  isPortfolioProjectId,
  type PortfolioProjectId,
} from '../../data/portfolioProjects';
import { projectArchiveIds } from '../../data/projectArchive';
import type { ServiceEngagementId } from '../../data/serviceEngagements';
import { localizedPath } from '../../routing/portfolioRoutes';

export const contactIntentIds = [
  'general',
  'new-product',
  'internal-system',
  'improve-existing',
  'project',
] as const;

export type ContactIntentId = (typeof contactIntentIds)[number];

export type ContactContext =
  | { intent: Exclude<ContactIntentId, 'project'> }
  | { intent: 'project'; projectId: PortfolioProjectId };

export const generalContactContext: ContactContext = { intent: 'general' };

export const contactContextByServiceEngagement = {
  'new-public-product': { intent: 'new-product' },
  'internal-full-stack-system': { intent: 'internal-system' },
  'improve-existing-system': { intent: 'improve-existing' },
} as const satisfies Record<ServiceEngagementId, ContactContext>;

type LocalizedContextCopy = {
  title: string;
  description: string;
  messageLabel: string;
  emailSubject: string;
};

const intentCopy = {
  en: {
    general: {
      title: 'General project inquiry',
      description: 'Start with a direct message or add a short brief when it helps.',
      messageLabel: 'Starting point (selected on the portfolio)',
      emailSubject: 'Project inquiry from the portfolio',
    },
    'new-product': {
      title: 'A new public product or site',
      description: 'A public-facing product, website, or launch path that needs a clear product and delivery foundation.',
      messageLabel: 'Starting point (selected on the portfolio)',
      emailSubject: 'New public product inquiry',
    },
    'internal-system': {
      title: 'An internal or full-stack system',
      description: 'A workflow, operational need, or team process that should become a maintainable working system.',
      messageLabel: 'Starting point (selected on the portfolio)',
      emailSubject: 'Internal system inquiry',
    },
    'improve-existing': {
      title: 'Improve an existing system',
      description: 'A live product whose experience, structure, discovery, or validation needs a focused next step.',
      messageLabel: 'Starting point (selected on the portfolio)',
      emailSubject: 'Existing product improvement inquiry',
    },
  },
  he: {
    general: {
      title: 'פנייה כללית לגבי פרויקט',
      description: 'אפשר להתחיל בהודעה ישירה, ולהוסיף תקציר קצר רק אם הוא עוזר.',
      messageLabel: 'נקודת פתיחה (נבחרה באתר)',
      emailSubject: 'פנייה לגבי פרויקט מהפורטפוליו',
    },
    'new-product': {
      title: 'מוצר או אתר ציבורי חדש',
      description: 'מוצר, אתר או מסלול השקה ציבורי שצריך בסיס מוצרי ותהליך מסירה ברור.',
      messageLabel: 'נקודת פתיחה (נבחרה באתר)',
      emailSubject: 'פנייה לגבי מוצר ציבורי חדש',
    },
    'internal-system': {
      title: 'מערכת פנימית או Full Stack',
      description: 'תהליך עבודה, צורך תפעולי או ידע צוותי שצריך להפוך למערכת עבודה ניתנת לתחזוקה.',
      messageLabel: 'נקודת פתיחה (נבחרה באתר)',
      emailSubject: 'פנייה לגבי מערכת פנימית',
    },
    'improve-existing': {
      title: 'שיפור מערכת קיימת',
      description: 'מוצר חי שחוויית השימוש, המבנה, הגילוי או הבדיקות שלו צריכים צעד הבא ממוקד.',
      messageLabel: 'נקודת פתיחה (נבחרה באתר)',
      emailSubject: 'פנייה לגבי שיפור מוצר קיים',
    },
  },
} as const satisfies Record<PortfolioLanguage, Record<Exclude<ContactIntentId, 'project'>, LocalizedContextCopy>>;

const isServiceIntent = (
  value: string | null,
): value is Exclude<ContactIntentId, 'general' | 'project'> => (
  value === 'new-product' || value === 'internal-system' || value === 'improve-existing'
);

export const parseContactContext = (search: string | URLSearchParams): ContactContext => {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search;
  const intent = params.get('intent');

  if (isServiceIntent(intent)) return { intent };

  if (intent === 'project') {
    const projectId = params.get('project');
    if (projectId && isPortfolioProjectId(projectId)) {
      return { intent: 'project', projectId };
    }
  }

  return generalContactContext;
};

export const serializeContactContext = (context: ContactContext) => {
  const params = new URLSearchParams();
  if (context.intent === 'general') return params;

  params.set('intent', context.intent);
  if (context.intent === 'project') params.set('project', context.projectId);
  return params;
};

export const sanitizeContactSearch = (search: string) => {
  const params = serializeContactContext(parseContactContext(search));
  return params.size > 0 ? `?${params.toString()}` : '';
};

export const buildContactUrl = (
  language: PortfolioLanguage,
  context: ContactContext = generalContactContext,
) => {
  const params = serializeContactContext(context);
  const search = params.size > 0 ? `?${params.toString()}` : '';
  return `${localizedPath(language, { route: 'contact' })}${search}`;
};

export const getContactContextDetails = (
  language: PortfolioLanguage,
  context: ContactContext,
): LocalizedContextCopy & { projectId?: PortfolioProjectId } => {
  if (context.intent !== 'project') return intentCopy[language][context.intent];

  const project = getPortfolioProjectById(context.projectId, language);
  if (!project) return intentCopy[language].general;

  return {
    title: project.title,
    description: project.summary,
    messageLabel: language === 'he'
      ? 'פרויקט קשור (נבחר באתר)'
      : 'Related project (selected on the portfolio)',
    emailSubject: language === 'he'
      ? `פנייה בהקשר לפרויקט ${project.title}`
      : `Project inquiry related to ${project.title}`,
    projectId: context.projectId,
  };
};

export const contactIntentOptions = (language: PortfolioLanguage) => [
  { id: 'general' as const, label: intentCopy[language].general.title },
  { id: 'new-product' as const, label: intentCopy[language]['new-product'].title },
  { id: 'internal-system' as const, label: intentCopy[language]['internal-system'].title },
  { id: 'improve-existing' as const, label: intentCopy[language]['improve-existing'].title },
  { id: 'project' as const, label: language === 'he' ? 'פרויקט מהפורטפוליו' : 'A portfolio project' },
];

export const contactProjectOptions = (language: PortfolioLanguage) => projectArchiveIds.map((id) => ({
  id,
  label: getPortfolioProjectById(id, language)?.title ?? id,
}));
