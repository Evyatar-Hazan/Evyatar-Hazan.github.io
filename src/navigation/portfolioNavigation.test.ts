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

  it('uses familiar, visitor-focused labels with natural Hebrew and English pairs', () => {
    expect({
      projects: [en.nav.Projects, he.nav.Projects],
      about: [en.nav.About, he.nav.About],
      blog: [en.nav.Blog, he.nav.Blog],
      contact: [en.nav.Contact, he.nav.Contact],
    }).toEqual({
      projects: ['Work', 'עבודות'],
      about: ['About me', 'עליי'],
      blog: ['Articles', 'מאמרים'],
      contact: ['Contact', 'צור קשר'],
    });
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

  it('matches route branches only at a segment boundary', () => {
    expect(activeNavigationId('/en/projects-archive/', '')).toBeNull();
    expect(activeNavigationId('/he/blogroll/', '')).toBeNull();
    expect(activeNavigationId('/en/projects/online_converter/evidence/', '')).toBe('projects');
    expect(activeNavigationId('/he/blog/catering-whatsapp/summary/', '')).toBe('blog');
  });

  it('derives compact route context from canonical project and article data', () => {
    expect(getPortfolioRouteContext('/en/projects/online_converter/', 'en', t)).toEqual({
      category: 'nav.Projects',
      detail: 'projects.items.online_converter.title',
    });
    expect(getPortfolioRouteContext('/he/blog/catering-whatsapp/', 'he', t)).toEqual({
      category: 'nav.Blog',
      detail: 'איך בניתי אתר עסקי שמוביל ל-WhatsApp',
    });
    expect(getPortfolioRouteContext('/en/blog/', 'en', t)).toEqual({
      category: 'nav.Blog',
      detail: 'shell.context.articleLibrary',
    });
    expect(getPortfolioRouteContext('/he/projects/', 'he', t)).toEqual({
      category: 'nav.Projects',
      detail: 'shell.context.projectCollection',
    });
    expect(getPortfolioRouteContext('/en/about/', 'en', t)).toEqual({
      category: 'nav.About',
      detail: 'shell.context.professionalStory',
    });
    expect(getPortfolioRouteContext('/he/contact/', 'he', t)).toEqual({
      category: 'nav.Contact',
      detail: 'shell.context.contactOptions',
    });
  });
});
