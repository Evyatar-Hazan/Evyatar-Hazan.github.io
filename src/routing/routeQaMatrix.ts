import type { PortfolioRouteTarget } from '../contracts/portfolio';
import { portfolioLanguages } from './portfolioRoutes';

export const routeQaLanguages = portfolioLanguages;
export const routeQaThemes = ['light', 'dark'] as const;
export const routeQaViewports = [
  { id: 'desktop', width: 1440, height: 900 },
  { id: 'mobile', width: 390, height: 844 },
] as const;

export const routeQaSharedChecks = [
  'direct-load',
  'page-identity',
  'single-main-landmark',
  'primary-content',
  'language-and-direction',
  'light-and-dark-theme',
  'keyboard-navigation',
  'language-and-theme-controls',
  'horizontal-overflow',
  'console-and-network',
] as const;

type RouteQaSample = {
  id: string;
  target: PortfolioRouteTarget;
  readySelector: string;
};

export type RouteQaEntry = {
  id: 'home' | 'projects' | 'articles' | 'about' | 'contact' | 'lab' | 'privacy';
  label: string;
  samples: readonly RouteQaSample[];
};

/**
 * Canonical FIX-003 route coverage. Every sample is exercised with the same
 * language, theme, viewport, accessibility, overflow, console, and network
 * checks defined above; route-specific checks only identify readiness.
 */
export const routeQaMatrix = [
  {
    id: 'home',
    label: 'Home',
    samples: [
      { id: 'home', target: { route: 'home' }, readySelector: '#home h1' },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    samples: [
      { id: 'projects-index', target: { route: 'projects' }, readySelector: '.projects-hub h1' },
      {
        id: 'project-case-study',
        target: { route: 'project', id: 'online_converter' },
        readySelector: 'article[data-case-study-template="product-story-v1"] h1',
      },
    ],
  },
  {
    id: 'articles',
    label: 'Articles',
    samples: [
      { id: 'articles-index', target: { route: 'blog' }, readySelector: '.blog-archive h1' },
      {
        id: 'article',
        target: { route: 'article', id: 'tests-need-honest-environments' },
        readySelector: '.blog-article-shell h1',
      },
    ],
  },
  {
    id: 'about',
    label: 'About',
    samples: [
      { id: 'about', target: { route: 'about' }, readySelector: '.about-dossier h1' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    samples: [
      { id: 'contact', target: { route: 'contact' }, readySelector: '.contact-workspace h1' },
    ],
  },
  {
    id: 'lab',
    label: 'Lab',
    samples: [
      { id: 'lab', target: { route: 'lab' }, readySelector: '.craft-lab h1' },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacy',
    samples: [
      { id: 'privacy', target: { route: 'privacy' }, readySelector: '#main-content h1' },
    ],
  },
] as const satisfies readonly RouteQaEntry[];
