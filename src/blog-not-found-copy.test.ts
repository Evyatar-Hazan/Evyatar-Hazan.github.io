import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-187 bilingual article-not-found copy', () => {
  it('explains the possible causes and returns English readers to the library', () => {
    expect(en.blog.notFoundTitle).toBe('This article isn’t available here');
    expect(en.blog.notFoundDescription).toBe(
      'The link may be outdated, the article may have been removed, or it may not be available in this language. Browse the article library to choose another useful read.',
    );
    expect(en.blog.notFoundSeoTitle).toBe('Article unavailable | Article library');
    expect(en.blog.backToBlog).toBe('Browse the article library');
    expect(en.blog.notFoundDescription).not.toMatch(/available in another language/i);
  });

  it('explains the possible causes and returns Hebrew readers to the library', () => {
    expect(he.blog.notFoundTitle).toBe('המאמר לא זמין כאן');
    expect(he.blog.notFoundDescription).toBe(
      'ייתכן שהקישור כבר לא עדכני, שהמאמר הוסר, או שהוא אינו זמין בשפה הזו. אפשר לעיין בספריית המאמרים ולבחור קריאה שימושית אחרת.',
    );
    expect(he.blog.notFoundSeoTitle).toBe('המאמר לא זמין | ספריית המאמרים');
    expect(he.blog.backToBlog).toBe('לעיון בספריית המאמרים');
    expect(he.blog.notFoundDescription).not.toContain('קיים בשפה אחרת');
  });
});
