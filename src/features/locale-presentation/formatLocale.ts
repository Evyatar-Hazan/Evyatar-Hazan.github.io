export type PortfolioLocaleLanguage = 'en' | 'he';

export const resolvePortfolioLocale = (language: string): string => (
  language.toLowerCase().startsWith('he') ? 'he-IL' : 'en-US'
);

export const formatLocaleNumber = (
  value: number,
  language: string,
  options: Intl.NumberFormatOptions = {},
  fallback = '—',
): string => {
  if (!Number.isFinite(value)) return fallback;

  try {
    return new Intl.NumberFormat(resolvePortfolioLocale(language), options).format(value);
  } catch {
    return fallback;
  }
};

export const formatLocaleIndex = (value: number, language: string): string => (
  formatLocaleNumber(value, language, {
    minimumIntegerDigits: 2,
    maximumFractionDigits: 0,
    useGrouping: false,
  })
);
