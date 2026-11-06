import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-117 compiler completion copy', () => {
  it('ends the English story with a clear review state', () => {
    expect(en.home.compiler.ready).toBe('Review-ready');
  });

  it('keeps the same visitor-facing meaning in Hebrew', () => {
    expect(he.home.compiler.ready).toBe('מוכן לבדיקה');
  });
});
