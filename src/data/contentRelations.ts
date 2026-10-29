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

export const getRelatedArticleRelations = (projectId: string) => (
  projectArticleRelations
    .filter((relation) => relation.projectId === projectId)
);

export const getRelatedProjectRelations = (articleId: string) => (
  projectArticleRelations
    .filter((relation) => relation.articleId === articleId)
);

export const getRelatedCapabilityRelations = (projectId: string) => (
  projectCapabilityRelations.filter((relation) => relation.projectId === projectId)
);
