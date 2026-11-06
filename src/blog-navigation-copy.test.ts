import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-186 article navigation copy', () => {
  it('describes the article outline and adjacent-article transitions in English', () => {
    expect(en.blog.articleOutline).toBe('In this article');
    expect(en.blog.articleOutlineDesktop).toBe('Sections in this article, desktop');
    expect(en.blog.articleOutlineMobile).toBe('Sections in this article, mobile');
    expect(en.blog.moreWriting).toBe('Choose another article');
    expect(en.blog.newerPost).toBe('Newer article');
    expect(en.blog.olderPost).toBe('Earlier article');
  });

  it('keeps the same article-focused transition model in Hebrew', () => {
    expect(he.blog.articleOutline).toBe('במאמר הזה');
    expect(he.blog.articleOutlineDesktop).toBe('פרקי המאמר הזה למחשב');
    expect(he.blog.articleOutlineMobile).toBe('פרקי המאמר הזה למובייל');
    expect(he.blog.moreWriting).toBe('לבחירת מאמר נוסף');
    expect(he.blog.newerPost).toBe('למאמר חדש יותר');
    expect(he.blog.olderPost).toBe('למאמר מוקדם יותר');
  });
});
