import { blogPostMetadataByKey } from '../content/blog/metadata';
import type {
  ArticleId,
  ProjectId,
} from '../contracts/portfolio';
import { projects } from './profile';

export type ProjectArticleRelation = {
  projectId: ProjectId;
  articleId: ArticleId;
};

type ProjectArticleRelationInput = {
  projectId: string;
  articleId: string;
};

type RelationCatalogs = {
  caseStudyProjectIds: ReadonlySet<string>;
  articleKeys: ReadonlySet<string>;
};

/**
 * Evidence-backed project/article connections. Array position is storage only:
 * it is not a recommendation rank or a reading route (Task 18 owns those).
 */
export const projectArticleRelations = [
  { projectId: 'nis_boutique', articleId: 'catering-whatsapp' },
  { projectId: 'nis_boutique', articleId: 'performance-optimizations-need-product-verification' },
  { projectId: 'nis_boutique', articleId: 'credible-portfolio' },
  { projectId: 'online_converter', articleId: 'monetization-needs-product-guardrails' },
  { projectId: 'online_converter', articleId: 'privacy-safe-product-analytics' },
  { projectId: 'online_converter', articleId: 'seo-discovery-is-product-work' },
  { projectId: 'online_converter', articleId: 'credible-portfolio' },
  { projectId: 'emergency_protocol', articleId: 'credible-portfolio' },
] as const satisfies readonly ProjectArticleRelation[];

const canonicalCatalogs: RelationCatalogs = {
  caseStudyProjectIds: new Set(
    projects
      .filter((project) => project.caseStudy)
      .map((project) => project.id),
  ),
  articleKeys: new Set(Object.keys(blogPostMetadataByKey)),
};

export const getProjectArticleRelationErrors = (
  relations: readonly ProjectArticleRelationInput[],
  catalogs: RelationCatalogs = canonicalCatalogs,
) => {
  const errors: string[] = [];
  const seenPairs = new Set<string>();

  for (const { projectId, articleId } of relations) {
    const pairKey = `${projectId}:${articleId}`;

    if (seenPairs.has(pairKey)) {
      errors.push(`${pairKey}: duplicate project/article relation.`);
    }
    seenPairs.add(pairKey);

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

export const getRelatedArticleIds = (projectId: string): readonly ArticleId[] => (
  projectArticleRelations
    .filter((relation) => relation.projectId === projectId)
    .map((relation) => relation.articleId)
);

export const getRelatedProjectIds = (articleId: string): readonly ProjectId[] => (
  projectArticleRelations
    .filter((relation) => relation.articleId === articleId)
    .map((relation) => relation.projectId)
);
