import { describe, expect, it } from 'vitest';
import { localizedPath } from './portfolioRoutes';
import {
  routeQaLanguages,
  routeQaMatrix,
  routeQaSharedChecks,
  routeQaThemes,
  routeQaViewports,
} from './routeQaMatrix';

describe('FIX-003 route QA matrix', () => {
  it('covers every accepted route family exactly once', () => {
    expect(routeQaMatrix.map(({ id }) => id)).toEqual([
      'home',
      'projects',
      'articles',
      'about',
      'contact',
      'lab',
      'privacy',
    ]);
  });

  it('keeps one shared QA method for every route', () => {
    expect(routeQaLanguages).toEqual(['en', 'he']);
    expect(routeQaThemes).toEqual(['light', 'dark']);
    expect(routeQaViewports).toEqual([
      { id: 'desktop', width: 1440, height: 900 },
      { id: 'mobile', width: 390, height: 844 },
    ]);
    expect(routeQaSharedChecks).toEqual([
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
    ]);
  });

  it('generates unique localized paths for every matrix sample', () => {
    const paths = routeQaMatrix.flatMap(({ samples }) => (
      samples.flatMap(({ target }) => routeQaLanguages.map((language) => localizedPath(language, target)))
    ));

    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toContain('/en/projects/online_converter/');
    expect(paths).toContain('/he/blog/tests-need-honest-environments/');
  });
});
