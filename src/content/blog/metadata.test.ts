import { describe, expect, it } from 'vitest';
import { blogPostMetadata } from './metadata';

describe('blog card metadata', () => {
  it('gives every localized article a concise reader outcome', () => {
    expect(blogPostMetadata).toHaveLength(66);

    blogPostMetadata.forEach((post) => {
      expect(post.excerpt.trim().length).toBeGreaterThan(20);
      expect(post.readerOutcome.trim().length).toBeGreaterThan(20);
      expect(post.readerOutcome).not.toBe(post.excerpt);
    });

    expect(new Set(blogPostMetadata.map((post) => post.readerOutcome)).size).toBe(66);
  });

  it('keeps a Hebrew and English outcome for every article', () => {
    const languagesBySlug = new Map<string, Set<string>>();

    blogPostMetadata.forEach((post) => {
      const languages = languagesBySlug.get(post.slug) ?? new Set<string>();
      languages.add(post.language);
      languagesBySlug.set(post.slug, languages);
    });

    expect(languagesBySlug.size).toBe(33);
    languagesBySlug.forEach((languages) => {
      expect([...languages].sort()).toEqual(['en', 'he']);
    });
  });
});
