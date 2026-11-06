import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-031 hero positioning', () => {
  it('leads with the visitor need and the promised outcome in English', () => {
    expect(en.home.compiler.prelude).toBe(
      "What isn't working in your site, system, or workflow?",
    );
    expect(en.home.compiler.headline).toBe(
      'Web products that drive growth.',
    );
    expect(en.home.compiler.description).toBe(
      'Whether it’s a public website, internal system, or practical tool, work starts with a clear goal and experience, then builds a product ready to deliver and maintain.',
    );
  });

  it('leads with the visitor need and the promised outcome in Hebrew', () => {
    expect(he.home.compiler.prelude).toBe(
      'מה צריך לעבוד טוב יותר באתר, במערכת או בתהליך העבודה?',
    );
    expect(he.home.compiler.headline).toBe(
      'מוצרי Web שמניעים צמיחה.',
    );
    expect(he.home.compiler.description).toBe(
      'בין שמדובר באתר ציבורי, במערכת פנימית או בכלי עבודה מעשי, העבודה מתחילה ביעד ובחוויית שימוש ברורים וממשיכה למוצר שמוכן למסירה ולתחזוקה.',
    );
  });

  it('uses a low-friction action for the primary CTA in both languages', () => {
    expect(en.home.compiler.buildCta).toBe('Describe your need');
    expect(he.home.compiler.buildCta).toBe('תארו את הצורך');
  });
});

describe('FIX-112 delivery proof', () => {
  it('connects selected public workflow evidence to a lower-risk handoff in English', () => {
    expect(en.home.proof.delivery).toEqual({
      title: 'Delivery that reduces risk',
      description: 'Selected public work shows how discovery, testing, and live deployment connect a defined outcome to evidence and a maintainable handoff.',
    });
  });

  it('keeps the same evidence boundary and visitor benefit in Hebrew', () => {
    expect(he.home.proof.delivery).toEqual({
      title: 'מסירה שמפחיתה סיכון',
      description: 'עבודות ציבוריות נבחרות מראות איך אפיון, בדיקות ופריסה חיה מחברים תוצאה מוגדרת לראיות ולהעברה נוחה לתחזוקה.',
    });
  });
});
