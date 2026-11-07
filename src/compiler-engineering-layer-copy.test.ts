import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-116 compiler engineering layer copy', () => {
  it('keeps the reliable-implementation benefit aligned in English and Hebrew', () => {
    expect(en.home.compiler.layers.engineering).toBe('Reliable implementation');
    expect(he.home.compiler.layers.engineering).toBe('מימוש אמין');
  });
});
