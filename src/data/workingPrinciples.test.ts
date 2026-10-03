import { describe, expect, it } from 'vitest';
import {
  routeTargetForPrincipleRef,
  workingPrinciples,
  workingPrinciplesCopy,
} from './workingPrinciples';

const bilingualValues = (value: { en: string; he: string }) => [value.en, value.he];

describe('working principles content', () => {
  it('publishes four stable, unique principles', () => {
    expect(workingPrinciples).toHaveLength(4);
    expect(new Set(workingPrinciples.map(({ id }) => id)).size).toBe(4);
  });

  it('keeps every statement, example, exception, and link label bilingual', () => {
    const copyValues = Object.values(workingPrinciplesCopy).flatMap(bilingualValues);
    const principleValues = workingPrinciples.flatMap((principle) => [
      ...bilingualValues(principle.title),
      ...bilingualValues(principle.position),
      ...bilingualValues(principle.example.copy),
      ...bilingualValues(principle.example.linkLabel),
      ...bilingualValues(principle.exception.copy),
      ...bilingualValues(principle.exception.linkLabel),
    ]);

    [...copyValues, ...principleValues].forEach((value) => {
      expect(value.trim().length).toBeGreaterThan(0);
    });
  });

  it('uses stable project and article identifiers for both evidence paths', () => {
    const targets = workingPrinciples.flatMap((principle) => [
      routeTargetForPrincipleRef(principle.example.ref),
      routeTargetForPrincipleRef(principle.exception.ref),
    ]);

    expect(targets).toEqual([
      { route: 'project', id: 'nis_boutique' },
      { route: 'project', id: 'online_converter' },
      { route: 'project', id: 'united_hatzalah' },
      { route: 'project', id: 'nis_boutique' },
      { route: 'article', id: 'privacy-safe-product-analytics' },
      { route: 'project', id: 'emergency_protocol' },
      { route: 'article', id: 'deployment-is-product' },
      { route: 'article', id: 'tests-need-honest-environments' },
    ]);
  });
});
