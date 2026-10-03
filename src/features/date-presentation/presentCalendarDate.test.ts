import { describe, expect, it } from 'vitest';
import { presentCalendarDate } from './presentCalendarDate';

describe('presentCalendarDate', () => {
  it('presents a valid ISO calendar date in English', () => {
    expect(presentCalendarDate('2026-09-13', { language: 'en' })).toEqual({
      status: 'valid',
      text: 'September 13, 2026',
      dateTime: '2026-09-13',
    });
  });

  it('presents the same calendar day in Hebrew', () => {
    const result = presentCalendarDate('2026-09-13', { language: 'he' });

    expect(result.status).toBe('valid');
    expect(result.dateTime).toBe('2026-09-13');
    expect(result.text).toContain('2026');
    expect(result.text).toContain('13');
  });

  it('supports a compact presentation without changing the semantic value', () => {
    const result = presentCalendarDate('2026-09-13', { language: 'en', style: 'compact' });

    expect(result).toEqual({
      status: 'valid',
      text: 'Sep 13, 2026',
      dateTime: '2026-09-13',
    });
  });

  it('accepts real leap days and rejects impossible dates', () => {
    expect(presentCalendarDate('2024-02-29', { language: 'en' }).status).toBe('valid');
    expect(presentCalendarDate('2023-02-29', { language: 'en' })).toEqual({
      status: 'invalid',
      text: '—',
      dateTime: null,
    });
    expect(presentCalendarDate('2026-04-31', { language: 'en' }).status).toBe('invalid');
  });

  it.each([
    '09/13/2026',
    '2026-9-13',
    '2026-09-13T12:00:00Z',
    ' 2026-09-13 ',
    'not-a-date',
    20260913,
    {},
  ])('rejects non-contract input without throwing: %j', (input) => {
    expect(() => presentCalendarDate(input, { language: 'en' })).not.toThrow();
    expect(presentCalendarDate(input, { language: 'en' }).status).toBe('invalid');
  });

  it('distinguishes absent input from malformed input and supports an honest fallback', () => {
    expect(presentCalendarDate('', { language: 'en', fallback: 'Date unavailable' })).toEqual({
      status: 'empty',
      text: 'Date unavailable',
      dateTime: null,
    });
    expect(presentCalendarDate(null, { language: 'en' }).status).toBe('empty');
    expect(presentCalendarDate('bad', { language: 'en' }).status).toBe('invalid');
  });

  it('keeps date-only values on the same day by formatting the UTC calendar value', () => {
    const result = presentCalendarDate('2026-01-01', { language: 'en' });

    expect(result.text).toBe('January 1, 2026');
    expect(result.dateTime).toBe('2026-01-01');
  });
});
