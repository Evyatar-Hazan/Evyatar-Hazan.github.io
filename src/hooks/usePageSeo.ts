import { useEffect } from 'react';
import { absoluteUrl, normalizePath } from '../data/site';

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

const upsertLink = (rel: string, href: string) => {
  let element = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
};

export const usePageSeo = ({ title, description, path, robots = 'index, follow' }: PageSeo) => {
  useEffect(() => {
    const routePath = normalizePath(path ?? window.location.pathname);
    const pageUrl = absoluteUrl(routePath);

    document.title = title;
    upsertMeta('description', description);
    upsertMeta('robots', robots);
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);
    upsertMeta('twitter:url', pageUrl);
    upsertPropertyMeta('og:title', title);
    upsertPropertyMeta('og:description', description);
    upsertPropertyMeta('og:url', pageUrl);
    upsertLink('canonical', pageUrl);
  }, [description, path, robots, title]);
};
