import { describe, expect, it } from 'vitest';
import {
  getLanguageFromPath,
  localizedPath,
  localizePath,
  normalizePath,
  stripLanguagePrefix,
  switchPathLanguage,
} from './portfolioRoutes';

describe('localized portfolio routes', () => {
  it('builds stable canonical paths from route targets', () => {
    expect(localizedPath('en', { route: 'home' })).toBe('/en/');
    expect(localizedPath('he', { route: 'projects' })).toBe('/he/#projects');
    expect(localizedPath('en', { route: 'project', id: 'online_converter' })).toBe('/en/projects/online_converter/');
    expect(localizedPath('he', { route: 'article', id: 'catering-whatsapp' })).toBe('/he/blog/catering-whatsapp/');
    expect(localizedPath('en', { route: 'contact' })).toBe('/en/contact/');
  });

  it('reads and removes only supported language prefixes', () => {
    expect(getLanguageFromPath('/he/blog/')).toBe('he');
    expect(getLanguageFromPath('/fr/blog/')).toBeNull();
    expect(stripLanguagePrefix('/en/projects/online_converter/')).toBe('/projects/online_converter/');
    expect(stripLanguagePrefix('/blog/')).toBe('/blog/');
  });

  it('switches language without losing the route, query, or hash', () => {
    expect(switchPathLanguage('/en/blog/catering-whatsapp/', 'he', '?ref=legacy', '#summary'))
      .toBe('/he/blog/catering-whatsapp/?ref=legacy#summary');
    expect(localizePath('en', '/blog/catering-whatsapp/')).toBe('/en/blog/catering-whatsapp/');
  });

  it('normalizes trailing slashes before query strings and fragments', () => {
    expect(normalizePath('/blog')).toBe('/blog/');
    expect(normalizePath('/blog?source=test')).toBe('/blog/?source=test');
    expect(normalizePath('/')).toBe('/');
  });
});
