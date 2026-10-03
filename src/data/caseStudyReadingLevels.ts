import type {
  ArticleId,
  PortfolioRouteTarget,
  ProjectId,
} from '../contracts/portfolio';
import type { LocalizedList } from './profile';
import type { PortfolioLanguage } from './portfolioCapabilities';

export const caseStudyReadingProjectIds = [
  'nis_boutique',
  'online_converter',
  'emergency_protocol',
  'united_hatzalah',
] as const satisfies readonly ProjectId[];

export type CaseStudyReadingProjectId = (typeof caseStudyReadingProjectIds)[number];

export const isCaseStudyReadingProjectId = (
  value: string,
): value is CaseStudyReadingProjectId => (
  caseStudyReadingProjectIds.includes(value as CaseStudyReadingProjectId)
);

export type CaseStudyVerification =
  | {
      status: 'documented';
      items: LocalizedList;
    }
  | {
      status: 'undocumented';
    };

type ReadingLevelLabels = {
  eyebrow: string;
  summaryTitle: string;
  summaryDescription: string;
  challenge: string;
  approach: string;
  outcome: string;
  contribution: string;
  audience: string;
  proof: string;
  evidenceSources: string;
  evidenceUnknown: string;
  evidenceVerifiedOn: string;
  openFull: string;
  closeFull: string;
  fullDescription: string;
  context: string;
  decisions: string;
  outcomes: string;
  verification: string;
  verificationUndocumented: string;
  actions: string;
  backToProjects: string;
  sourceCode: string;
  liveProduct: string;
  relatedWriting: string;
};

export const caseStudyReadingLabels: Record<PortfolioLanguage, ReadingLevelLabels> = {
  en: {
    eyebrow: 'Choose your depth',
    summaryTitle: '30-second overview',
    summaryDescription: 'The essential problem, approach, outcome, and proof stay available at a glance.',
    challenge: 'Problem',
    approach: 'Approach',
    outcome: 'Outcome',
    contribution: 'Contribution',
    audience: 'Built for',
    proof: 'Evidence',
    evidenceSources: 'Public evidence sources',
    evidenceUnknown: 'Evidence date and public sources are not yet verified.',
    evidenceVerifiedOn: 'Verified on',
    openFull: 'Read engineering details',
    closeFull: 'Close engineering details',
    fullDescription: 'Product and system decisions, project outcomes, and test or verification notes.',
    context: 'Full context',
    decisions: 'Engineering decisions',
    outcomes: 'Project outcomes',
    verification: 'Tests and verification',
    verificationUndocumented: 'Public test and verification details are not documented yet.',
    actions: 'Case study actions',
    backToProjects: 'Back to projects',
    sourceCode: 'Source code',
    liveProduct: 'Live product',
    relatedWriting: 'Related writing',
  },
  he: {
    eyebrow: 'בחירת עומק קריאה',
    summaryTitle: 'תקציר של 30 שניות',
    summaryDescription: 'הבעיה, הגישה, התוצאה והראיות המרכזיות נשארות זמינות במבט אחד.',
    challenge: 'הבעיה',
    approach: 'הגישה',
    outcome: 'התוצאה',
    contribution: 'התרומה',
    audience: 'למי נבנה',
    proof: 'ראיות',
    evidenceSources: 'מקורות ראיה ציבוריים',
    evidenceUnknown: 'תאריך הראיה והמקורות הציבוריים עדיין לא אומתו.',
    evidenceVerifiedOn: 'אומת בתאריך',
    openFull: 'לקריאת הפרטים ההנדסיים',
    closeFull: 'סגירת הפרטים ההנדסיים',
    fullDescription: 'החלטות מוצר ומערכת, תוצאות הפרויקט והערות על בדיקות או אימות.',
    context: 'ההקשר המלא',
    decisions: 'החלטות הנדסיות',
    outcomes: 'תוצאות הפרויקט',
    verification: 'בדיקות ואימות',
    verificationUndocumented: 'פרטי בדיקות ואימות ציבוריים עדיין לא תועדו.',
    actions: 'פעולות בקייס סטאדי',
    backToProjects: 'חזרה לפרויקטים',
    sourceCode: 'קוד מקור',
    liveProduct: 'המוצר החי',
    relatedWriting: 'כתיבה קשורה',
  },
};

export const caseStudyVerificationByProject = {
  nis_boutique: { status: 'undocumented' },
  online_converter: { status: 'undocumented' },
  emergency_protocol: { status: 'undocumented' },
  united_hatzalah: { status: 'undocumented' },
} as const satisfies Record<CaseStudyReadingProjectId, CaseStudyVerification>;

export const relatedCaseStudyArticleIds: Partial<Record<CaseStudyReadingProjectId, ArticleId>> = {
  nis_boutique: 'catering-whatsapp',
  online_converter: 'seo-discovery-is-product-work',
  emergency_protocol: 'small-project-architecture',
};

export const getCaseStudyRelatedTarget = (
  projectId: CaseStudyReadingProjectId,
): PortfolioRouteTarget => {
  const articleId = relatedCaseStudyArticleIds[projectId];

  return articleId
    ? { route: 'article', id: articleId }
    : { route: 'blog' };
};
