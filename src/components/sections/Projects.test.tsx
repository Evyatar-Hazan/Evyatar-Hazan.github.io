import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '../../i18n';
import Projects from './Projects';

const renderProjects = () => render(
  <MemoryRouter>
    <Projects />
  </MemoryRouter>,
);

describe('Projects flagship hierarchy', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('promotes one canonical flagship and keeps the other projects supporting', () => {
    const { container } = renderProjects();

    expect(container.querySelectorAll('[data-featured-project]')).toHaveLength(1);
    expect(container.querySelector('[data-featured-project="nis_boutique"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-supporting-project]')).toHaveLength(3);
    expect(screen.getByText('Flagship project / in depth')).toBeInTheDocument();
  });

  it('keeps the flagship story, outcome, and case study link explicit', () => {
    const { container } = renderProjects();
    const flagship = container.querySelector<HTMLElement>('[data-featured-project="nis_boutique"]');

    expect(flagship).not.toBeNull();
    const flagshipQueries = within(flagship!);

    expect(flagshipQueries.getByRole('heading', { name: 'The starting point' })).toBeInTheDocument();
    expect(flagshipQueries.getByRole('heading', { name: 'The solution in practice' })).toBeInTheDocument();
    expect(flagshipQueries.getByRole('heading', { name: 'What changed' })).toBeInTheDocument();
    expect(flagshipQueries.getByRole('link', { name: 'Case study' })).toHaveAttribute(
      'href',
      '/en/projects/nis_boutique/',
    );
  });
});
