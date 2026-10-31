import { describe, expect, it } from 'vitest';
import { getStaticRouteSeo, routeSeo } from './routeSeo';

describe('FIX-095 canonical route metadata', () => {
  it('keeps every core route and locale title and description unique', () => {
    const entries = Object.keys(routeSeo).flatMap((routeId) => (
      (['en', 'he'] as const).map((language) => (
        getStaticRouteSeo(routeId as keyof typeof routeSeo, language)
      ))
    ));

    expect(new Set(entries.map(({ title }) => title)).size).toBe(entries.length);
    expect(new Set(entries.map(({ description }) => description)).size).toBe(entries.length);
    expect(entries.every(({ title, description }) => title.trim() && description.trim())).toBe(true);
  });

  it('keeps every core route path normalized and unique', () => {
    const paths = Object.values(routeSeo).map(({ path }) => path);

    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every((path) => path.startsWith('/') && path.endsWith('/'))).toBe(true);
  });
});
