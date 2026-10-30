import { blogPostMetadataByKey } from '../content/blog/metadata';
import type {
  ArticleId,
  CapabilityId,
  ProjectId,
} from '../contracts/portfolio';
import { portfolioCapabilityGroups, type PortfolioLanguage } from './portfolioCapabilities';
import { projects } from './profile';

export type ProjectArticleRelation = {
  projectId: ProjectId;
  articleId: ArticleId;
  reason: Record<PortfolioLanguage, string>;
};

export type ProjectCapabilityRelation = {
  projectId: ProjectId;
  capabilityId: CapabilityId;
  reason: Record<PortfolioLanguage, string>;
};

export type RelatedArticleRelation = {
  articleId: ArticleId;
  reason: Record<PortfolioLanguage, string>;
};

type ArticleRelationTheme = {
  id: string;
  articleIds: readonly ArticleId[];
  reason: Record<PortfolioLanguage, string>;
};

type ArticleRelationThemeInput = {
  id: string;
  articleIds: readonly string[];
  reason?: Partial<Record<PortfolioLanguage, string>>;
};

type ProjectArticleRelationInput = {
  projectId: string;
  articleId: string;
  reason?: Partial<Record<PortfolioLanguage, string>>;
};

type ProjectCapabilityRelationInput = {
  projectId: string;
  capabilityId: string;
  reason?: Partial<Record<PortfolioLanguage, string>>;
};

type RelationCatalogs = {
  caseStudyProjectIds: ReadonlySet<string>;
  articleKeys: ReadonlySet<string>;
  capabilityIds: ReadonlySet<string>;
};

/**
 * Evidence-backed project/article connections. Array position is storage only:
 * it is not a recommendation rank or a reading route (Task 18 owns those).
 */
export const projectArticleRelations = [
  {
    projectId: 'nis_boutique',
    articleId: 'catering-whatsapp',
    reason: {
      en: 'Explains the WhatsApp-first conversion decision used throughout this case study.',
      he: 'מסביר את החלטת ההמרה מבוססת WhatsApp שמובילה את הקייס סטאדי הזה.',
    },
  },
  {
    projectId: 'nis_boutique',
    articleId: 'performance-optimizations-need-product-verification',
    reason: {
      en: 'Covers the production verification boundary behind the project’s performance work.',
      he: 'מפרט את גבול אימות הפרודקשן שמאחורי עבודת הביצועים בפרויקט.',
    },
  },
  {
    projectId: 'online_converter',
    articleId: 'monetization-needs-product-guardrails',
    reason: {
      en: 'Documents the product guardrails used before adding monetization to the converter.',
      he: 'מתעד את גבולות המוצר שנדרשו לפני הוספת מונטיזציה לממיר.',
    },
  },
  {
    projectId: 'online_converter',
    articleId: 'privacy-safe-product-analytics',
    reason: {
      en: 'Explains how analytics support decisions without weakening the local-processing promise.',
      he: 'מסביר כיצד אנליטיקה תומכת בהחלטות בלי לפגוע בהבטחת העיבוד המקומי.',
    },
  },
  {
    projectId: 'online_converter',
    articleId: 'seo-discovery-is-product-work',
    reason: {
      en: 'Details the SEO and discovery system that turns the converter registry into a product surface.',
      he: 'מפרט את מערכת ה־SEO והגילוי שהופכת את מאגר הממירים למשטח מוצר.',
    },
  },
] as const satisfies readonly ProjectArticleRelation[];

export const projectCapabilityRelations = [
  {
    projectId: 'nis_boutique',
    capabilityId: 'webMobile',
    reason: {
      en: 'A responsive React and Vite product surface built around a direct inquiry journey.',
      he: 'משטח מוצר רספונסיבי ב־React ו־Vite שנבנה סביב מסע פנייה ישיר.',
    },
  },
  {
    projectId: 'nis_boutique',
    capabilityId: 'methodologies',
    reason: {
      en: 'RTL, accessibility, SEO, and conversion decisions are part of the product structure.',
      he: 'החלטות RTL, נגישות, SEO והמרה הן חלק ממבנה המוצר.',
    },
  },
  {
    projectId: 'online_converter',
    capabilityId: 'webMobile',
    reason: {
      en: 'Registry-driven React interfaces keep many bilingual tools consistent and reusable.',
      he: 'ממשקי React מבוססי registry שומרים על עקביות ושימוש חוזר בין כלים דו־לשוניים רבים.',
    },
  },
  {
    projectId: 'online_converter',
    capabilityId: 'devops',
    reason: {
      en: 'CI quality gates verify routes, metadata, performance, and production behavior.',
      he: 'שערי איכות ב־CI מאמתים נתיבים, metadata, ביצועים והתנהגות בפרודקשן.',
    },
  },
  {
    projectId: 'online_converter',
    capabilityId: 'methodologies',
    reason: {
      en: 'Privacy-first processing, i18n, RTL, and SEO shape the product model.',
      he: 'עיבוד שומר פרטיות, i18n, ‏RTL ו־SEO מעצבים את מודל המוצר.',
    },
  },
  {
    projectId: 'emergency_protocol',
    capabilityId: 'webMobile',
    reason: {
      en: 'The React interface turns a static pathway into a step-by-step learning product.',
      he: 'ממשק React הופך מסלול סטטי למוצר למידה צעד־אחר־צעד.',
    },
  },
  {
    projectId: 'emergency_protocol',
    capabilityId: 'databases',
    reason: {
      en: 'D1 stores authentication and discussion data behind the public learning flow.',
      he: 'D1 שומר נתוני אימות ודיון מאחורי זרימת הלמידה הציבורית.',
    },
  },
  {
    projectId: 'emergency_protocol',
    capabilityId: 'devops',
    reason: {
      en: 'Cloudflare Pages Functions and CI form the verified delivery boundary.',
      he: 'Cloudflare Pages Functions ו־CI יוצרים את גבול המסירה המאומת.',
    },
  },
  {
    projectId: 'united_hatzalah',
    capabilityId: 'webMobile',
    reason: {
      en: 'A React public site and admin workflow share one maintainable product surface.',
      he: 'אתר ציבורי ב־React וזרימת ניהול חולקים משטח מוצר תחזוקתי אחד.',
    },
  },
  {
    projectId: 'united_hatzalah',
    capabilityId: 'databases',
    reason: {
      en: 'Prisma and Cloudinary support structured operational content and media.',
      he: 'Prisma ו־Cloudinary תומכים בתוכן תפעולי ובמדיה במבנה מסודר.',
    },
  },
] as const satisfies readonly ProjectCapabilityRelation[];

/**
 * Curated learning paths for article-to-article discovery. These are explicit
 * editorial groupings rather than tag similarity, so a broad tag such as
 * "Product" cannot create a plausible-looking but arbitrary recommendation.
 * Theme order is the recommendation rank; article order is the rank within a
 * theme. The public selector always removes the current article and caps the
 * result at three links.
 */
export const articleRelationThemes = [
  {
    id: 'content-that-remains-discoverable',
    articleIds: [
      'initial-html-should-contain-the-article',
      'credible-portfolio',
      'seo-discovery-is-product-work',
      'small-project-architecture',
      'spa-routes-need-real-http',
    ],
    reason: {
      en: 'Continues the content-discovery path: clear structure, credible writing, and pages that remain reachable.',
      he: 'ממשיך את מסלול גילוי התוכן: מבנה ברור, כתיבה אמינה ועמודים שנשארים נגישים.',
    },
  },
  {
    id: 'trustworthy-frontend',
    articleIds: [
      'focus-tests-need-an-unfocused-baseline',
      'shared-container-is-a-layout-contract',
      'accessibility-contrast-is-product-quality',
      'one-bad-date-should-not-blank-a-screen',
      'performance-optimizations-need-product-verification',
      'google-translate-name-bug',
    ],
    reason: {
      en: 'Continues the trustworthy-frontend path through accessibility, resilient rendering, and real interface behavior.',
      he: 'ממשיך את מסלול ה־frontend האמין דרך נגישות, רינדור עמיד והתנהגות ממשק אמיתית.',
    },
  },
  {
    id: 'reliable-delivery',
    articleIds: [
      'failed-render-should-not-destroy-good-output',
      'retries-should-not-duplicate-data',
      'tests-need-honest-environments',
      'deployment-is-product',
      'monetization-needs-product-guardrails',
    ],
    reason: {
      en: 'Continues the reliable-delivery path from safe retries and honest tests to production guardrails.',
      he: 'ממשיך את מסלול המסירה האמינה מחזרות בטוחות ובדיקות כנות ועד גבולות פרודקשן.',
    },
  },
  {
    id: 'programming-foundations',
    articleIds: [
      'data-types-java-typescript-python',
      'what-variable-stores',
      'java-program-execution',
      'java-unicode-string-length',
      'binary-bitwise-java',
    ],
    reason: {
      en: 'Continues the programming-foundations path from values and representation to runtime behavior.',
      he: 'ממשיך את מסלול יסודות התכנות מערכים וייצוג ועד התנהגות בזמן ריצה.',
    },
  },
  {
    id: 'systems-under-the-app',
    articleIds: [
      'operating-system-under-apps',
      'processes-threads-concurrency',
      'boot-process-power-button',
      'hardware-input-output-devices',
      'what-the-cpu-really-does',
      'ram-vs-storage',
      'virtualization-virtual-machines',
    ],
    reason: {
      en: 'Continues the systems path through the layers that run underneath everyday application code.',
      he: 'ממשיך את מסלול המערכות דרך השכבות שפועלות מתחת לקוד אפליקטיבי יומיומי.',
    },
  },
  {
    id: 'files-data-and-access',
    articleIds: [
      'file-permissions-user-access',
      'files-folders-paths',
      'what-is-inside-a-file',
      'java-unicode-string-length',
      'binary-bitwise-java',
    ],
    reason: {
      en: 'Continues the files-and-data path from access rules and paths down to bytes and text representation.',
      he: 'ממשיך את מסלול הקבצים והנתונים מהרשאות ונתיבים ועד בתים וייצוג טקסט.',
    },
  },
  {
    id: 'product-trust-and-growth',
    articleIds: [
      'monetization-needs-product-guardrails',
      'seo-discovery-is-product-work',
      'privacy-safe-product-analytics',
      'small-project-architecture',
      'deployment-is-product',
      'credible-portfolio',
      'catering-whatsapp',
    ],
    reason: {
      en: 'Continues the product-trust path through discovery, measurement, delivery, and focused conversion decisions.',
      he: 'ממשיך את מסלול אמון המוצר דרך גילוי, מדידה, מסירה והחלטות המרה ממוקדות.',
    },
  },
] as const satisfies readonly ArticleRelationTheme[];

const canonicalCatalogs: RelationCatalogs = {
  caseStudyProjectIds: new Set(
    projects
      .filter((project) => project.caseStudy)
      .map((project) => project.id),
  ),
  articleKeys: new Set(Object.keys(blogPostMetadataByKey)),
  capabilityIds: new Set(portfolioCapabilityGroups.map(({ id }) => id)),
};

const validateReason = (
  relationKey: string,
  reason: Partial<Record<PortfolioLanguage, string>> | undefined,
) => (['en', 'he'] as const).flatMap((language) => (
  reason?.[language]?.trim()
    ? []
    : [`${relationKey}: missing ${language} editorial reason.`]
));

export const getArticleRelationThemeErrors = (
  themes: readonly ArticleRelationThemeInput[],
  articleKeys: ReadonlySet<string> = canonicalCatalogs.articleKeys,
) => {
  const errors: string[] = [];

  for (const theme of themes) {
    if (theme.articleIds.length < 2) {
      errors.push(`${theme.id}: a relation theme needs at least two articles.`);
    }

    const seenArticleIds = new Set<string>();
    for (const articleId of theme.articleIds) {
      if (seenArticleIds.has(articleId)) {
        errors.push(`${theme.id}:${articleId}: duplicate article in relation theme.`);
      }
      seenArticleIds.add(articleId);

      for (const language of ['en', 'he'] as const) {
        if (!articleKeys.has(`${articleId}:${language}`)) {
          errors.push(`${theme.id}:${articleId}: missing ${language} article metadata.`);
        }
      }
    }

    errors.push(...validateReason(theme.id, theme.reason));
  }

  return errors;
};

export const getProjectArticleRelationErrors = (
  relations: readonly ProjectArticleRelationInput[],
  catalogs: RelationCatalogs = canonicalCatalogs,
) => {
  const errors: string[] = [];
  const seenPairs = new Set<string>();

  for (const relation of relations) {
    const { projectId, articleId } = relation;
    const pairKey = `${projectId}:${articleId}`;

    if (seenPairs.has(pairKey)) {
      errors.push(`${pairKey}: duplicate project/article relation.`);
    }
    seenPairs.add(pairKey);
    errors.push(...validateReason(pairKey, relation.reason));

    if (!catalogs.caseStudyProjectIds.has(projectId)) {
      errors.push(`${projectId}: related project must have a published case study.`);
    }

    for (const language of ['en', 'he'] as const) {
      if (!catalogs.articleKeys.has(`${articleId}:${language}`)) {
        errors.push(`${articleId}: missing ${language} article metadata.`);
      }
    }
  }

  return errors;
};

export const getProjectCapabilityRelationErrors = (
  relations: readonly ProjectCapabilityRelationInput[],
  catalogs: RelationCatalogs = canonicalCatalogs,
) => {
  const errors: string[] = [];
  const seenPairs = new Set<string>();

  for (const relation of relations) {
    const { projectId, capabilityId } = relation;
    const pairKey = `${projectId}:${capabilityId}`;

    if (seenPairs.has(pairKey)) {
      errors.push(`${pairKey}: duplicate project/capability relation.`);
    }
    seenPairs.add(pairKey);
    errors.push(...validateReason(pairKey, relation.reason));

    if (!catalogs.caseStudyProjectIds.has(projectId)) {
      errors.push(`${projectId}: related project must have a published case study.`);
    }
    if (!catalogs.capabilityIds.has(capabilityId)) {
      errors.push(`${capabilityId}: related capability must exist in the canonical inventory.`);
    }
  }

  return errors;
};

export const assertProjectArticleRelations = (
  relations: readonly ProjectArticleRelationInput[],
  catalogs: RelationCatalogs = canonicalCatalogs,
) => {
  const errors = getProjectArticleRelationErrors(relations, catalogs);

  if (errors.length > 0) {
    throw new Error(`Project/article relation contract failed:\n${errors.join('\n')}`);
  }
};

assertProjectArticleRelations(projectArticleRelations);
const capabilityErrors = getProjectCapabilityRelationErrors(projectCapabilityRelations);
if (capabilityErrors.length > 0) {
  throw new Error(`Project/capability relation contract failed:\n${capabilityErrors.join('\n')}`);
}
const articleThemeErrors = getArticleRelationThemeErrors(articleRelationThemes);
if (articleThemeErrors.length > 0) {
  throw new Error(`Article relation theme contract failed:\n${articleThemeErrors.join('\n')}`);
}

export const getRelatedArticleRelations = (projectId: string) => (
  projectArticleRelations
    .filter((relation) => relation.projectId === projectId)
);

export const getRelatedProjectRelations = (articleId: string) => (
  projectArticleRelations
    .filter((relation) => relation.articleId === articleId)
);

export const getRelatedBlogArticleRelations = (
  articleId: string,
  limit = 3,
): RelatedArticleRelation[] => {
  const normalizedLimit = Math.max(0, limit);
  if (normalizedLimit === 0) return [];

  const seenArticleIds = new Set<string>([articleId]);
  const relations: RelatedArticleRelation[] = [];

  for (const theme of articleRelationThemes) {
    if (!(theme.articleIds as readonly ArticleId[]).includes(articleId as ArticleId)) continue;

    for (const relatedArticleId of theme.articleIds) {
      if (seenArticleIds.has(relatedArticleId)) continue;
      seenArticleIds.add(relatedArticleId);
      relations.push({
        articleId: relatedArticleId,
        reason: theme.reason,
      });

      if (relations.length >= normalizedLimit) return relations;
    }
  }

  return relations;
};

export const getRelatedCapabilityRelations = (projectId: string) => (
  projectCapabilityRelations.filter((relation) => relation.projectId === projectId)
);
