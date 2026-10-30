import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-031 hero positioning', () => {
  it('leads with the visitor need and the promised outcome in English', () => {
    expect(en.home.compiler.prelude).toBe('Have a need that must move forward?');
    expect(en.home.compiler.headline).toBe(
      'Turn it into a web product that works.',
    );
  });

  it('leads with the visitor need and the promised outcome in Hebrew', () => {
    expect(he.home.compiler.prelude).toBe('יש צורך שצריך להתקדם?');
    expect(he.home.compiler.headline).toBe(
      'הופכים אותו למוצר Web שעובד.',
    );
  });
});
