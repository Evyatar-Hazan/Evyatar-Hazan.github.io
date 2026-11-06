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
      title: 'I’m not sure where to start',
      description: 'My need spans more than one path, or I want to describe it in my own words.',
      messageLabel: 'Starting point (selected on the portfolio)',
      emailSubject: 'Project inquiry from the portfolio',
    },
    'new-product': {
      title: 'I’m launching a new product or site',
      description: 'I have a new public-facing idea that needs a clear path to a launch-ready product or site.',
      messageLabel: 'Starting point (selected on the portfolio)',
      emailSubject: 'New public product inquiry',
    },
    'internal-system': {
      title: 'I need an internal or full-stack system',
      description: 'I need a maintainable system for a manual workflow, operational need, or team process.',
      messageLabel: 'Starting point (selected on the portfolio)',
      emailSubject: 'Internal system inquiry',
    },
    'improve-existing': {
      title: 'I want to improve an existing product',
      description: 'I have a live product that needs a focused improvement to its experience, structure, discoverability, or validation.',
      messageLabel: 'Starting point (selected on the portfolio)',
      emailSubject: 'Existing product improvement inquiry',
    },
  },
  he: {
    general: {
      title: 'עוד לא ברור לי מאיפה להתחיל',
      description: 'הצורך שלי משלב כמה מסלולים, או שנוח לי לתאר אותו במילים שלי.',
      messageLabel: 'נקודת פתיחה (נבחרה באתר)',
      emailSubject: 'פנייה לגבי פרויקט מהפורטפוליו',
    },
    'new-product': {
      title: 'אני רוצה להשיק מוצר או אתר חדש',
      description: 'יש לי רעיון חדש שצריך מסלול ברור למוצר או לאתר שמוכן להשקה.',
      messageLabel: 'נקודת פתיחה (נבחרה באתר)',
      emailSubject: 'פנייה לגבי מוצר ציבורי חדש',
    },
    'internal-system': {
      title: 'אני צריך מערכת פנימית או Full Stack',
      description: 'אני צריך להפוך תהליך ידני, צורך תפעולי או עבודה צוותית למערכת שאפשר לתחזק.',
      messageLabel: 'נקודת פתיחה (נבחרה באתר)',
      emailSubject: 'פנייה לגבי מערכת פנימית',
    },
    'improve-existing': {
      title: 'אני רוצה לשפר מוצר קיים',
      description: 'יש לי מוצר פעיל שצריך שיפור ממוקד בחוויה, במבנה, בגילוי או בבדיקות.',
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
