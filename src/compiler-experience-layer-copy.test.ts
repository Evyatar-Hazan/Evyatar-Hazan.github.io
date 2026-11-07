import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-115 compiler experience layer copy', () => {
  it('describes people and product use in English', () => {
    expect(en.home.compiler.layers.experience).toBe('People and how they use it');
  });

  it('keeps the same people-and-use meaning in Hebrew', () => {
    expect(he.home.compiler.layers.experience).toBe('אנשים ואופן השימוש');
  });
});
