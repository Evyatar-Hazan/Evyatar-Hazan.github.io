import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { LocalizedPathBuilder } from '../../contracts/portfolio';
import ReadingRoutesSection from './ReadingRoutesSection';
import {
  assertCuratedReadingRoutes,
  curatedReadingRoutes,
  getCuratedReadingRouteErrors,
  getReadingRouteMemberships,
} from './curatedReadingRoutes';

const buildPath: LocalizedPathBuilder = (language, target) => {
  if (target.route === 'article') return `/${language}/blog/${target.id}/`;
  if (target.route === 'project') return `/${language}/projects/${target.id}/`;
  return `/${language}/`;
};

describe('curated reading route data', () => {
  it('keeps exactly three bilingual, canonical ordered routes', () => {
    expect(getCuratedReadingRouteErrors()).toEqual([]);
    expect(() => assertCuratedReadingRoutes()).not.toThrow();
    expect(curatedReadingRoutes.map((route) => route.id)).toEqual([
      'reliability-data', 'browser-privacy', 'shipping-product',
    ]);

    for (const route of curatedReadingRoutes) {
      expect(route.title.en).not.toBe('');
      expect(route.title.he).not.toBe('');
      expect(route.rationale.en).not.toBe('');
      expect(route.rationale.he).not.toBe('');
      expect(route.items.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('exposes deterministic item memberships for Task 07', () => {
    expect(getReadingRouteMemberships({ kind: 'project', id: 'online_converter' })).toEqual([
      { routeId: 'browser-privacy', step: 1, totalSteps: 4 },
    ]);
    expect(getReadingRouteMemberships({ kind: 'article', id: 'deployment-is-product' })).toEqual([
      { routeId: 'shipping-product', step: 5, totalSteps: 5 },
    ]);
    expect(getReadingRouteMemberships({ kind: 'article', id: 'credible-portfolio' })).toEqual([]);
  });
});

describe('ReadingRoutesSection', () => {
  it('renders ordered routes with localized Task 09 links and explicit endpoints', () => {
    render(<MemoryRouter><ReadingRoutesSection buildPath={buildPath} language="en" /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Choose a deliberate route through the work' })).toBeInTheDocument();
    expect(screen.getAllByText('Start here')).toHaveLength(3);
    expect(screen.getAllByText('Finish here')).toHaveLength(3);
    expect(document.querySelectorAll('[data-reading-route]')).toHaveLength(3);

    const privacyRoute = document.querySelector('[data-reading-route="browser-privacy"]');
    expect(privacyRoute).not.toBeNull();
    const privacyLinks = within(privacyRoute as HTMLElement).getAllByRole('link');
    expect(privacyLinks[0]).toHaveAttribute('href', '/en/projects/online_converter/');
    expect(privacyLinks[1]).toHaveAttribute('href', '/en/blog/privacy-safe-product-analytics/');
    expect(privacyLinks[3]).toHaveAttribute('href', '/en/blog/monetization-needs-product-guardrails/');
  });

  it('renders Hebrew route copy and localized item paths', () => {
    render(<MemoryRouter><ReadingRoutesSection buildPath={buildPath} language="he" /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'בחרו מסלול מכוון דרך העבודות' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'פרטיות בדפדפן' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /איך מודדים מוצר בלי לקרוא את הדאטה של המשתמש/u }))
      .toHaveAttribute('href', '/he/blog/privacy-safe-product-analytics/');
  });
});
