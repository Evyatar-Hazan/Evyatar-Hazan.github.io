import { describe, expect, it } from 'vitest';
import parityManifest from './language-parity.json';
import { blogPostMetadata } from './metadata';

type ParityStatus = 'complete' | 'intentional-single-language';

const supportedLanguages = ['en', 'he'] as const;
const parityBySlug = parityManifest as Record<string, ParityStatus>;
const mdxModules = import.meta.glob('./*.mdx');

const metadataLanguagesBySlug = blogPostMetadata.reduce<Map<string, Set<string>>>((index, post) => {
  const languages = index.get(post.slug) ?? new Set<string>();
  languages.add(post.language);
  index.set(post.slug, languages);
  return index;
}, new Map());

const mdxLanguagesBySlug = Object.keys(mdxModules)
  .reduce<Map<string, Set<string>>>((index, fileName) => {
    const match = fileName.match(/^\.\/(.*)\.(en|he)\.mdx$/u);
    if (!match) return index;
    const [, slug, language] = match;
    const languages = index.get(slug) ?? new Set<string>();
    languages.add(language);
    index.set(slug, languages);
    return index;
  }, new Map());

const sortedLanguages = (languages: Set<string> | undefined) => [...(languages ?? [])].sort();

describe('FIX-070 blog language parity', () => {
  it('marks every article exactly once and does not keep stale manifest entries', () => {
    const manifestSlugs = Object.keys(parityBySlug).sort();
    const contentSlugs = [...new Set([
      ...metadataLanguagesBySlug.keys(),
      ...mdxLanguagesBySlug.keys(),
    ])].sort();

    expect(manifestSlugs).toEqual(contentSlugs);
    expect(Object.values(parityBySlug).every((status) => (
      status === 'complete' || status === 'intentional-single-language'
    ))).toBe(true);
  });

  it('requires complete articles to have matching Hebrew and English records and files', () => {
    for (const [slug, status] of Object.entries(parityBySlug)) {
      const expectedLanguages = status === 'complete' ? [...supportedLanguages] : undefined;
      const metadataLanguages = sortedLanguages(metadataLanguagesBySlug.get(slug));
      const mdxLanguages = sortedLanguages(mdxLanguagesBySlug.get(slug));

      if (expectedLanguages) {
        expect(metadataLanguages, `${slug} metadata languages`).toEqual(expectedLanguages);
        expect(mdxLanguages, `${slug} MDX languages`).toEqual(expectedLanguages);
      } else {
        expect(metadataLanguages, `${slug} intentional metadata language`).toHaveLength(1);
        expect(mdxLanguages, `${slug} intentional MDX language`).toEqual(metadataLanguages);
      }
    }
  });

  it('keeps complete pairs aligned on shared metadata', () => {
    for (const [slug, status] of Object.entries(parityBySlug)) {
      if (status !== 'complete') continue;

      const localizedMetadata = blogPostMetadata.filter((post) => post.slug === slug);
      const english = localizedMetadata.find((post) => post.language === 'en');
      const hebrew = localizedMetadata.find((post) => post.language === 'he');
      expect(english, `${slug} English metadata`).toBeDefined();
      expect(hebrew, `${slug} Hebrew metadata`).toBeDefined();
      expect(hebrew?.date, `${slug} publication date`).toBe(english?.date);
      expect(hebrew?.featured, `${slug} featured state`).toBe(english?.featured);
      expect(hebrew?.tags, `${slug} tags`).toEqual(english?.tags);
    }
  });
});
