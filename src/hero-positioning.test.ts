import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-031 hero positioning', () => {
  it('leads with the visitor need and the promised outcome in English', () => {
    expect(en.home.compiler.prelude).toBe(
      'What needs to work better in your website, system, or workflow?',
    );
    expect(en.home.compiler.headline).toBe(
      'Turn it into a web product that works.',
    );
  });

  it('leads with the visitor need and the promised outcome in Hebrew', () => {
    expect(he.home.compiler.prelude).toBe(
      'מה צריך לעבוד טוב יותר באתר, במערכת או בתהליך העבודה?',
    );
    expect(he.home.compiler.headline).toBe(
      'הופכים אותו למוצר Web שעובד.',
    );
  });
});
