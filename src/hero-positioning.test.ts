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
  });

  it('leads with the visitor need and the promised outcome in Hebrew', () => {
    expect(he.home.compiler.prelude).toBe(
      'מה צריך לעבוד טוב יותר באתר, במערכת או בתהליך העבודה?',
    );
    expect(he.home.compiler.headline).toBe(
      'מוצרי Web שמניעים צמיחה.',
    );
  });
});
