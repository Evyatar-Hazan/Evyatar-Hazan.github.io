import { describe, expect, it } from 'vitest';
import type { BlogPostMeta } from '../content/blog/types';
import { getArticleStructuredData } from './articleStructuredData';

const post: BlogPostMeta = {
  slug: 'retries-should-not-duplicate-data',
  language: 'en',
  title: 'A retry should repeat intent, not duplicate data',
  excerpt: 'A visible article summary.',
  readerOutcome: 'A visible outcome.',
  date: '2026-09-06',
  updatedDate: '2026-10-03',
  readTime: '7 min read',
  tags: ['Backend', 'Data', 'Reliability'],
  depth: 'deep-dive',
  featured: false,
  editorialRank: 30,
};

describe('getArticleStructuredData', () => {
  it('uses the localized visible article metadata without unsupported claims', () => {
    expect(getArticleStructuredData(post)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.updatedDate,
      inLanguage: post.language,
      mainEntityOfPage: 'https://evyatarhazan.com/en/blog/retries-should-not-duplicate-data/',
      author: {
        '@type': 'Person',
        name: 'Evyatar Hazan',
        url: 'https://evyatarhazan.com/en/about/',
      },
      keywords: post.tags,
    });
  });

  it('uses the publication date as the modification date when no update is visible', () => {
    expect(getArticleStructuredData({ ...post, updatedDate: undefined }).dateModified).toBe(post.date);
  });
});
