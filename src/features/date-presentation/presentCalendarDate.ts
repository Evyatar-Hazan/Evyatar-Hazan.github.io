import type { PortfolioLanguage } from '../../data/portfolioCapabilities';

export type CalendarDateStyle = 'long' | 'compact';
export type CalendarDateStatus = 'valid' | 'empty' | 'invalid';

export type CalendarDatePresentation = {
  status: CalendarDateStatus;
  text: string;
  dateTime: string | null;
};

export type CalendarDatePresentationOptions = {
  language: PortfolioLanguage;
  style?: CalendarDateStyle;
  fallback?: string;
};

const ISO_CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/u;

const isLeapYear = (year: number) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const daysInMonth = (year: number, month: number) => {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
};

const isRealCalendarDate = (year: number, month: number, day: number) => (
  year >= 1
  && year <= 9999
  && month >= 1
  && month <= 12
  && day >= 1
  && day <= daysInMonth(year, month)
);

const localeByLanguage: Record<PortfolioLanguage, string> = {
  en: 'en-US',
  he: 'he-IL',
};

const formatOptionsByStyle: Record<CalendarDateStyle, Intl.DateTimeFormatOptions> = {
  long: { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
  compact: { year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC' },
};

/**
 * Presents a strict ISO calendar date without allowing invalid input or the
 * viewer's time zone to break rendering. It intentionally does not parse
 * timestamps or ambiguous locale-formatted dates.
 */
export const presentCalendarDate = (
  input: unknown,
  { language, style = 'long', fallback = '—' }: CalendarDatePresentationOptions,
): CalendarDatePresentation => {
  if (input === null || input === undefined || input === '') {
    return { status: 'empty', text: fallback, dateTime: null };
  }

  if (typeof input !== 'string') {
    return { status: 'invalid', text: fallback, dateTime: null };
  }

  const match = ISO_CALENDAR_DATE.exec(input);
  if (!match) {
    return { status: 'invalid', text: fallback, dateTime: null };
  }

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);

  if (!isRealCalendarDate(year, month, day)) {
    return { status: 'invalid', text: fallback, dateTime: null };
  }

  const instant = new Date(`${input}T00:00:00.000Z`);

  try {
    return {
      status: 'valid',
      text: new Intl.DateTimeFormat(
        localeByLanguage[language],
        formatOptionsByStyle[style],
      ).format(instant),
      dateTime: input,
    };
  } catch {
    return { status: 'invalid', text: fallback, dateTime: null };
  }
};
