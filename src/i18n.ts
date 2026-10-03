import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import he from './locales/he.json';
import { getLanguageFromPath } from './routing/portfolioRoutes';

const routeLanguage = typeof window === 'undefined'
  ? null
  : getLanguageFromPath(window.location.pathname);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...(routeLanguage ? { lng: routeLanguage } : {}),
    resources: {
      en: { translation: en },
      he: { translation: he }
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'he'],
    react: {
      useSuspense: false
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'i18nextLng'
    },
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
