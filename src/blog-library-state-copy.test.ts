import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-185 blog library state copy', () => {
  it('makes every English result state clear and actionable', () => {
    expect(en.blog.library.resultsCount_one).toBe(
      '{{formattedCount}} article found. Open it or show all articles.',
    );
    expect(en.blog.library.resultsCount_other).toBe(
      '{{formattedCount}} articles found. Choose one or show all articles.',
    );
    expect(en.blog.library.totalCount).toBe(
      '{{formattedCount}} articles available. Search by need or filter by topic and depth.',
    );
    expect(en.blog.library.reset).toBe('Show all articles');
    expect(en.blog.library.emptyTitle).toBe('No articles match your search or filters');
    expect(en.blog.library.emptyDescription).toBe(
      'Try a broader phrase, choose a different topic or depth, or show all articles.',
    );
  });

  it('keeps the same actions explicit in Hebrew', () => {
    expect(he.blog.library.resultsCount_one).toBe(
      'נמצא מאמר אחד. אפשר לפתוח אותו או להציג את כל המאמרים.',
    );
    expect(he.blog.library.resultsCount_other).toBe(
      'נמצאו {{formattedCount}} מאמרים. אפשר לבחור אחד או להציג את כל המאמרים.',
    );
    expect(he.blog.library.totalCount).toBe(
      '{{formattedCount}} מאמרים זמינים. אפשר לחפש לפי צורך או לסנן לפי נושא ורמת עומק.',
    );
    expect(he.blog.library.reset).toBe('להציג את כל המאמרים');
    expect(he.blog.library.emptyTitle).toBe('לא נמצאו מאמרים בחיפוש או בסינון שבחרתם');
    expect(he.blog.library.emptyDescription).toBe(
      'נסו ביטוי רחב יותר, בחרו נושא או רמת עומק אחרים, או הציגו את כל המאמרים.',
    );
  });
});
