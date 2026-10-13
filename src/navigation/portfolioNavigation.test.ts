import { describe, expect, it } from 'vitest';
import type { TFunction } from 'i18next';
import en from '../locales/en.json';
import he from '../locales/he.json';
import {
  activeNavigationId,
  getPortfolioRouteContext,
  navigationHref,
  portfolioNavigation,
  primaryNavigation,
  secondaryNavigation,
} from './portfolioNavigation';

const t = ((key: string) => key) as TFunction;

describe('portfolio navigation registry', () => {
  it('keeps one set of stable IDs and destinations for every shell consumer', () => {
    const ids = portfolioNavigation.map((item) => item.id);
    const enDestinations = portfolioNavigation.map((item) => navigationHref(item, 'en'));

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(enDestinations).size).toBe(enDestinations.length);
    expect(primaryNavigation.map((item) => item.id)).toEqual([
      'home', 'projects', 'about', 'blog', 'contact',
    ]);
    expect(secondaryNavigation.map((item) => item.id)).toEqual(['lab', 'privacy']);
  });

  it('keeps every registry label available in both supported languages', () => {
    for (const item of portfolioNavigation) {
      const key = item.translationKey.replace('nav.', '') as keyof typeof en.nav;
      expect(en.nav[key]).toBeTruthy();
      expect(he.nav[key]).toBeTruthy();
    }
  });

  it('uses the real Projects and About routes available in the current route map', () => {
    const projects = portfolioNavigation.find((item) => item.id === 'projects')!;
    const about = portfolioNavigation.find((item) => item.id === 'about')!;

    expect(navigationHref(projects, 'he')).toBe('/he/projects/');
    expect(navigationHref(about, 'he')).toBe('/he/about/');
  });

  it('matches home sections, indexes, articles, and nested case studies', () => {
    expect(activeNavigationId('/en/', '')).toBe('home');
    expect(activeNavigationId('/en/about/', '')).toBe('about');
    expect(activeNavigationId('/en/projects/', '')).toBe('projects');
    expect(activeNavigationId('/he/projects/online_converter/', '')).toBe('projects');
    expect(activeNavigationId('/en/blog/', '')).toBe('blog');
    expect(activeNavigationId('/en/blog/catering-whatsapp/', '')).toBe('blog');
  });

  it('derives compact route context from canonical project and article data', () => {
    expect(getPortfolioRouteContext('/en/projects/online_converter/', 'en', t)).toEqual({
      category: 'shell.context.project',
      detail: 'projects.items.online_converter.title',
    });
    expect(getPortfolioRouteContext('/he/blog/catering-whatsapp/', 'he', t)).toEqual({
      category: 'shell.context.writing',
      detail: 'איך בניתי אתר עסקי שמוביל ל-WhatsApp',
    });
    expect(getPortfolioRouteContext('/en/blog/', 'en', t)).toEqual({
      category: 'shell.context.writing',
      detail: 'shell.context.library',
    });
  });
});
