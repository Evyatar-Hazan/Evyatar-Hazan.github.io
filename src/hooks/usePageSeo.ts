import { useEffect } from 'react';
import { absoluteUrl } from '../data/site';
import {
  defaultPortfolioLanguage,
  getLanguageFromPath,
  localizePath,
  stripLanguagePrefix,
} from '../routing/portfolioRoutes';

type PageSeo = {
  title: string;
  description: string;
  path?: string;
  robots?: string;
};

const upsertMeta = (name: string, content: string) => {
  let element = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }

  element.content = content;
};

const upsertPropertyMeta = (property: string, content: string) => {
  let element = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }

  element.content = content;
};

const upsertLink = (rel: string, href: string, hreflang?: string) => {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let element = document.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    if (hreflang) element.hreflang = hreflang;
    document.head.appendChild(element);
  }

  element.href = href;
};

export const usePageSeo = ({ title, description, path, robots = 'index, follow' }: PageSeo) => {
  const routeLanguage = getLanguageFromPath(window.location.pathname) ?? defaultPortfolioLanguage;

  useEffect(() => {
    const contentPath = stripLanguagePrefix(path ?? window.location.pathname);
    const canonicalPath = localizePath(routeLanguage, contentPath);
    const pageUrl = absoluteUrl(canonicalPath);
    const isIndexable = !robots.toLowerCase().includes('noindex');

    document.title = title;
    upsertMeta('description', description);
    upsertMeta('robots', robots);
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);
    upsertMeta('twitter:url', pageUrl);
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:url', pageUrl);
    upsertPropertyMeta('og:locale', routeLanguage === 'he' ? 'he_IL' : 'en_US');

    if (isIndexable) {
      upsertLink('canonical', pageUrl);
      upsertLink('alternate', absoluteUrl(localizePath('en', contentPath)), 'en');
      upsertLink('alternate', absoluteUrl(localizePath('he', contentPath)), 'he');
      upsertLink('alternate', absoluteUrl(localizePath('en', contentPath)), 'x-default');
      return;
    }

    document.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]')
      .forEach((element) => element.remove());
  }, [description, path, robots, routeLanguage, title]);
};
