import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-031 hero positioning', () => {
  it('states who Evyatar is and what he builds for whom in two English lines', () => {
    expect(en.home.compiler.prelude).toBe('Evyatar Hazan, Full Stack Developer');
    expect(en.home.compiler.headline).toBe(
      'Digital products for businesses and teams',
    );
  });

  it('states who Evyatar is and what he builds for whom in two Hebrew lines', () => {
    expect(he.home.compiler.prelude).toBe('אביתר חזן, מפתח Full Stack');
    expect(he.home.compiler.headline).toBe(
      'מוצרים דיגיטליים לעסקים ולצוותים',
    );
  });
});
