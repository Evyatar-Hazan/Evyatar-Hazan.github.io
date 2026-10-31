import { describe, expect, it } from 'vitest';
import {
  formatLocaleIndex,
  formatLocaleNumber,
  resolvePortfolioLocale,
} from './formatLocale';

describe('locale presentation', () => {
  it('maps supported languages and regional variants to the intended locale', () => {
    expect(resolvePortfolioLocale('en')).toBe('en-US');
    expect(resolvePortfolioLocale('he')).toBe('he-IL');
    expect(resolvePortfolioLocale('he-IL')).toBe('he-IL');
  });

  it('formats numbers using the active locale', () => {
    expect(formatLocaleNumber(1234.5, 'en')).toBe('1,234.5');
    expect(formatLocaleNumber(1234.5, 'he')).toBe(
      new Intl.NumberFormat('he-IL').format(1234.5),
    );
  });

  it('formats editorial indices without bypassing the locale formatter', () => {
    expect(formatLocaleIndex(3, 'en')).toBe('03');
    expect(formatLocaleIndex(3, 'he')).toBe(
      new Intl.NumberFormat('he-IL', {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 0,
        useGrouping: false,
      }).format(3),
    );
  });

  it('returns an honest fallback for non-finite values', () => {
    expect(formatLocaleNumber(Number.NaN, 'en')).toBe('—');
    expect(formatLocaleNumber(Number.POSITIVE_INFINITY, 'he', {}, 'לא זמין')).toBe('לא זמין');
  });
});
