import type {
  LocalizedPathBuilder,
  PortfolioRouteTarget,
} from '../contracts/portfolio';
import type { PortfolioLanguage } from '../data/portfolioCapabilities';

export const portfolioLanguages = ['en', 'he'] as const satisfies readonly PortfolioLanguage[];
export const defaultPortfolioLanguage: PortfolioLanguage = 'en';

export const isPortfolioLanguage = (value: string | undefined): value is PortfolioLanguage =>
  portfolioLanguages.includes(value as PortfolioLanguage);

export const getLanguageFromPath = (pathname: string): PortfolioLanguage | null => {
  const segment = pathname.split('/').filter(Boolean)[0];
  return isPortfolioLanguage(segment) ? segment : null;
};

export const stripLanguagePrefix = (pathname: string) => {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const language = getLanguageFromPath(normalized);

  if (!language) return normalized || '/';

  const path = normalized.slice(language.length + 1);
  return path ? (path.startsWith('/') ? path : `/${path}`) : '/';
};

export const normalizePath = (pathname: string) => {
  const [path = '/', suffix = ''] = pathname.split(/(?=[?#])/u, 2);
  const normalizedPath = !path || path === '/'
    ? '/'
    : `${path.replace(/\/+$/u, '')}/`;

  return `${normalizedPath}${suffix}`;
};

const targetPath = (target: PortfolioRouteTarget) => {
  switch (target.route) {
    case 'home':
      return '/';
    case 'projects':
      return '/#projects';
    case 'project':
      return `/projects/${target.id}/`;
    case 'blog':
      return '/blog/';
    case 'article':
      return `/blog/${target.id}/`;
    case 'lab':
      return '/lab/';
    case 'contact':
      return '/contact/';
    case 'privacy':
      return '/privacy/';
  }
};

export const localizedPath: LocalizedPathBuilder = (language, target) => {
  const path = targetPath(target);
  const [pathname, hash = ''] = path.split('#');
  return `/${language}${normalizePath(pathname)}${hash ? `#${hash}` : ''}`;
};

export const localizePath = (language: PortfolioLanguage, pathname: string) => {
  const match = pathname.match(/^([^?#]*)([?#].*)?$/u);
  const path = stripLanguagePrefix(match?.[1] || '/');
  const suffix = match?.[2] ?? '';
  return `/${language}${normalizePath(path)}${suffix}`;
};

export const switchPathLanguage = (
  pathname: string,
  language: PortfolioLanguage,
  search = '',
  hash = '',
) => `${localizePath(language, pathname)}${search}${hash}`;

export const legacyPathForTarget = (target: PortfolioRouteTarget) => targetPath(target);
