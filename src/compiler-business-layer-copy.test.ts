import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-114 compiler business layer copy', () => {
  it('starts the English compiler flow with an outcome to advance', () => {
    expect(en.home.compiler.layers.business).toBe('Outcome to advance');
  });

  it('keeps the same outcome-led meaning in Hebrew', () => {
    expect(he.home.compiler.layers.business).toBe('תוצאה לקידום');
  });
});
