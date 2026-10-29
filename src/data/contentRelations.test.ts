import { describe, expect, it } from 'vitest';
import {
  assertProjectArticleRelations,
  getProjectArticleRelationErrors,
  getProjectCapabilityRelationErrors,
  getRelatedArticleRelations,
  getRelatedCapabilityRelations,
  getRelatedProjectRelations,
  projectArticleRelations,
  projectCapabilityRelations,
} from './contentRelations';

describe('project/article relations', () => {
  it('keeps every canonical relation valid and bilingual', () => {
    expect(() => assertProjectArticleRelations(projectArticleRelations)).not.toThrow();
  });

  it('resolves every relation in both directions', () => {
    for (const relation of projectArticleRelations) {
      expect(getRelatedArticleRelations(relation.projectId)).toContain(relation);
      expect(getRelatedProjectRelations(relation.articleId)).toContain(relation);
      expect(relation.reason.en).not.toHaveLength(0);
      expect(relation.reason.he).not.toHaveLength(0);
    }
  });

  it('allows a published case study or article to have no relation', () => {
    expect(getRelatedArticleRelations('united_hatzalah')).toEqual([]);
    expect(getRelatedProjectRelations('one-bad-date-should-not-blank-a-screen')).toEqual([]);
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
      capabilityIds: new Set(['valid-capability']),
    });

    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('missing-project: related project must have a published case study'),
      expect.stringContaining('english-only: missing he article metadata'),
      expect.stringContaining('valid-project:valid-article: duplicate project/article relation'),
    ]));
  });

  it('keeps capability links explicit, canonical, and editorially justified', () => {
    expect(getProjectCapabilityRelationErrors(projectCapabilityRelations)).toEqual([]);

    for (const relation of projectCapabilityRelations) {
      expect(getRelatedCapabilityRelations(relation.projectId)).toContain(relation);
      expect(relation.reason.en).not.toHaveLength(0);
      expect(relation.reason.he).not.toHaveLength(0);
    }
  });

  it('rejects capability links without a canonical capability or a bilingual reason', () => {
    const errors = getProjectCapabilityRelationErrors([
      {
        projectId: 'valid-project',
        capabilityId: 'missing-capability',
        reason: { en: 'English reason only.' },
      },
    ], {
      caseStudyProjectIds: new Set(['valid-project']),
      articleKeys: new Set(),
      capabilityIds: new Set(['valid-capability']),
    });

    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('missing-capability: related capability must exist'),
      expect.stringContaining('valid-project:missing-capability: missing he editorial reason'),
    ]));
  });
});
