import type { TFunction } from 'i18next';
import { getBlogPostMetadata } from '../content/blog/metadata';
import type { PortfolioRouteTarget } from '../contracts/portfolio';
import { getProjectById } from '../data/profile';
import type { PortfolioLanguage } from '../data/portfolioCapabilities';
import { localizedPath, stripLanguagePrefix } from '../routing/portfolioRoutes';

export type PortfolioNavigationId =
  | 'home'
  | 'projects'
  | 'about'
  | 'blog'
  | 'contact'
  | 'lab'
  | 'privacy';

export type PortfolioNavigationItem = {
  id: PortfolioNavigationId;
  translationKey: string;
  group: 'primary' | 'secondary';
  destination:
    | { kind: 'route'; target: PortfolioRouteTarget }
    | { kind: 'home-section'; section: 'about' };
  active: (contentPath: string, hash: string) => boolean;
};

const isExactRoute = (contentPath: string, route: string) => (
  contentPath === route || contentPath === `${route}/`
);

export const portfolioNavigation = [
  {
    id: 'home',
    translationKey: 'nav.Home',
    group: 'primary',
    destination: { kind: 'route', target: { route: 'home' } },
    active: (contentPath, hash) => contentPath === '/' && (!hash || hash === '#home'),
  },
  {
    id: 'projects',
    translationKey: 'nav.Projects',
    group: 'primary',
    destination: { kind: 'route', target: { route: 'projects' } },
    active: (contentPath) => contentPath.startsWith('/projects'),
  },
  {
    id: 'about',
    translationKey: 'nav.About',
    group: 'primary',
    destination: { kind: 'route', target: { route: 'about' } },
    active: (contentPath) => isExactRoute(contentPath, '/about'),
  },
  {
    id: 'blog',
    translationKey: 'nav.Blog',
    group: 'primary',
    destination: { kind: 'route', target: { route: 'blog' } },
    active: (contentPath) => contentPath.startsWith('/blog'),
  },
  {
    id: 'contact',
    translationKey: 'nav.Contact',
    group: 'primary',
    destination: { kind: 'route', target: { route: 'contact' } },
    active: (contentPath) => isExactRoute(contentPath, '/contact'),
  },
  {
    id: 'lab',
    translationKey: 'nav.Lab',
    group: 'secondary',
    destination: { kind: 'route', target: { route: 'lab' } },
    active: (contentPath) => isExactRoute(contentPath, '/lab'),
  },
  {
    id: 'privacy',
    translationKey: 'nav.Privacy',
    group: 'secondary',
    destination: { kind: 'route', target: { route: 'privacy' } },
    active: (contentPath) => isExactRoute(contentPath, '/privacy'),
  },
] as const satisfies readonly PortfolioNavigationItem[];

export const primaryNavigation = portfolioNavigation.filter((item) => item.group === 'primary');
export const secondaryNavigation = portfolioNavigation.filter((item) => item.group === 'secondary');

export const navigationHref = (
  item: PortfolioNavigationItem,
  language: PortfolioLanguage,
) => {
  if (item.destination.kind === 'home-section') {
    return `${localizedPath(language, { route: 'home' })}#${item.destination.section}`;
  }

  return localizedPath(language, item.destination.target);
};

export const activeNavigationId = (pathname: string, hash: string) => {
  const contentPath = stripLanguagePrefix(pathname);
  return portfolioNavigation.find((item) => item.active(contentPath, hash))?.id ?? null;
};

export type PortfolioRouteContext = {
  category: string;
  detail: string;
};

const routeSegments = (pathname: string) => stripLanguagePrefix(pathname).split('/').filter(Boolean);

export const getPortfolioRouteContext = (
  pathname: string,
  language: PortfolioLanguage,
  t: TFunction,
): PortfolioRouteContext | null => {
  const [section, id] = routeSegments(pathname);

  if (section === 'projects' && id) {
    const project = getProjectById(id);
    return {
      category: t('shell.context.project'),
      detail: project ? t(`projects.items.${id}.title`) : t('shell.context.caseStudy'),
    };
  }

  if (section === 'projects') {
    return { category: t('shell.context.project'), detail: t('shell.context.library') };
  }

  if (section === 'blog' && id) {
    const article = getBlogPostMetadata(id, language);
    return {
      category: t('shell.context.writing'),
      detail: article?.title ?? t('shell.context.article'),
    };
  }

  if (section === 'blog') {
    return { category: t('shell.context.writing'), detail: t('shell.context.library') };
  }

  if (section === 'lab') {
    return { category: t('shell.context.system'), detail: t('nav.Lab') };
  }

  if (section === 'privacy') {
    return { category: t('shell.context.system'), detail: t('nav.Privacy') };
  }

  if (section === 'contact') {
    return { category: t('shell.context.contact'), detail: t('shell.context.brief') };
  }

  if (section === 'about') {
    return { category: t('shell.context.profile'), detail: t('nav.About') };
  }

  return null;
};
