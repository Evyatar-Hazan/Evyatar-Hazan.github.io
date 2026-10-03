import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../../contracts/portfolio';
import { ServiceEngagements } from './ServiceEngagements';
import { createServiceEngagementsRegistration } from './serviceEngagementsRegistration';

const buildPath = vi.fn<LocalizedPathBuilder>((language, target) => {
  if (target.route === 'project') return `/${language}/projects/${target.id}`;
  return `/${language}/${target.route}`;
});

describe('ServiceEngagements', () => {
  it.each([
    ['en', 'Three ways to move a product forward.', 'Intended audience', 'Typical deliverables'],
    ['he', 'שלוש דרכים לקדם מוצר.', 'למי זה מתאים', 'תוצרים אופייניים'],
  ] as const)('renders three complete engagement articles in %s', (language, title, audience, deliverables) => {
    render(<ServiceEngagements language={language} buildPath={buildPath} />);

    expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(3);

    articles.forEach((article) => {
      expect(within(article).getByRole('heading', { name: audience })).toBeInTheDocument();
      expect(within(article).getByRole('heading', { name: deliverables })).toBeInTheDocument();
      expect(within(article).getAllByRole('listitem')).toHaveLength(3);
      expect(within(article).getAllByRole('link')).toHaveLength(2);
    });
  });

  it('uses stable route targets for project proof and contact CTAs', () => {
    render(<ServiceEngagements language="en" buildPath={buildPath} />);

    expect(screen.getByRole('link', { name: 'See the public-site case study' })).toHaveAttribute(
      'href',
      '/en/projects/nis_boutique',
    );
    expect(screen.getByRole('link', { name: 'See the full-stack case study' })).toHaveAttribute(
      'href',
      '/en/projects/emergency_protocol',
    );
    expect(screen.getByRole('link', { name: 'See the product-improvement case study' })).toHaveAttribute(
      'href',
      '/en/projects/online_converter',
    );
    screen.getAllByRole('link', { name: /^Discuss/ }).forEach((link) => {
      expect(link).toHaveAttribute('href', '/en/contact');
    });

    expect(buildPath).toHaveBeenCalledWith('en', { route: 'project', id: 'nis_boutique' });
    expect(buildPath).toHaveBeenCalledWith('en', { route: 'contact' });
  });

  it('exports the approved t02 slot registration without owning shared routing', () => {
    const registration = createServiceEngagementsRegistration(buildPath);
    expect(registration.taskId).toBe('t02');
    expect(registration.slot).toBe('home.serviceEngagements');

    render(<registration.Component language="en" className="integration-marker" />);
    expect(document.querySelector('#service-engagements')).toHaveClass('integration-marker');
  });
});
