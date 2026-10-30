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
