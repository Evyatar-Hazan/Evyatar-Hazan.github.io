import { describe, expect, it } from 'vitest';
import {
  assertProjectArticleRelations,
  getProjectArticleRelationErrors,
  getRelatedArticleIds,
  getRelatedProjectIds,
  projectArticleRelations,
} from './contentRelations';

describe('project/article relations', () => {
  it('keeps every canonical relation valid and bilingual', () => {
    expect(() => assertProjectArticleRelations(projectArticleRelations)).not.toThrow();
  });

  it('resolves every relation in both directions', () => {
    for (const relation of projectArticleRelations) {
      expect(getRelatedArticleIds(relation.projectId)).toContain(relation.articleId);
      expect(getRelatedProjectIds(relation.articleId)).toContain(relation.projectId);
    }
  });

  it('allows a published case study or article to have no relation', () => {
    expect(getRelatedArticleIds('united_hatzalah')).toEqual([]);
    expect(getRelatedProjectIds('one-bad-date-should-not-blank-a-screen')).toEqual([]);
  });

  it('rejects broken project ids, missing localized slugs, and duplicate pairs', () => {
    const relations = [
      { projectId: 'missing-project', articleId: 'valid-article' },
      { projectId: 'valid-project', articleId: 'english-only' },
      { projectId: 'valid-project', articleId: 'valid-article' },
      { projectId: 'valid-project', articleId: 'valid-article' },
    ];
    const errors = getProjectArticleRelationErrors(relations, {
      caseStudyProjectIds: new Set(['valid-project']),
      articleKeys: new Set([
        'valid-article:en',
        'valid-article:he',
        'english-only:en',
      ]),
    });

    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('missing-project: related project must have a published case study'),
      expect.stringContaining('english-only: missing he article metadata'),
      expect.stringContaining('valid-project:valid-article: duplicate project/article relation'),
    ]));
  });
});
