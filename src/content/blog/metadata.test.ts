import { describe, expect, it } from 'vitest';
import { blogPostMetadata } from './metadata';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/u;

describe('blog date metadata', () => {
  it('keeps publication and optional update dates explicit and chronological', () => {
    blogPostMetadata.forEach((post) => {
      expect(post.date, `${post.slug}:${post.language} publication date`).toMatch(ISO_DATE);

      if ('updatedDate' in post && post.updatedDate) {
        expect(post.updatedDate, `${post.slug}:${post.language} update date`).toMatch(ISO_DATE);
        expect(Date.parse(post.updatedDate)).toBeGreaterThan(Date.parse(post.date));
      }
    });
  });
});

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
