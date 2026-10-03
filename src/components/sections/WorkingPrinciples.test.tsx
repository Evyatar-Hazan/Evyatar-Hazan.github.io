import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../../contracts/portfolio';
import { workingPrinciples, workingPrinciplesCopy } from '../../data/workingPrinciples';
import WorkingPrinciples from './WorkingPrinciples';

const localizedPath = vi.fn<LocalizedPathBuilder>((language, target) => {
  if (target.route === 'project') return `/${language}/projects/${target.id}`;
  if (target.route === 'article') return `/${language}/blog/${target.id}`;
  return `/${language}/${target.route}`;
});

describe('WorkingPrinciples', () => {
  it.each(['en', 'he'] as const)('renders all observed choices with examples and exceptions in %s', (language) => {
    localizedPath.mockClear();

    const { container } = render(
      <MemoryRouter>
        <WorkingPrinciples language={language} localizedPath={localizedPath} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: workingPrinciplesCopy.title[language] })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-principle-id]')).toHaveLength(4);
    expect(screen.getAllByText(workingPrinciplesCopy.exampleLabel[language])).toHaveLength(4);
    expect(screen.getAllByText(workingPrinciplesCopy.exceptionLabel[language])).toHaveLength(4);
    expect(localizedPath).toHaveBeenCalledTimes(8);

    workingPrinciples.forEach((principle) => {
      expect(screen.getByRole('heading', { name: principle.title[language] })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: principle.example.linkLabel[language] })).toHaveAttribute(
        'href',
        expect.stringContaining(`/${language}/`),
      );
      expect(screen.getByRole('link', { name: principle.exception.linkLabel[language] })).toHaveAttribute(
        'href',
        expect.stringContaining(`/${language}/`),
      );
    });
  });

  it('forwards the integration class without changing the stable section id', () => {
    const { container } = render(
      <MemoryRouter>
        <WorkingPrinciples
          language="en"
          localizedPath={localizedPath}
          className="integration-slot"
        />
      </MemoryRouter>,
    );

    expect(container.querySelector('#working-principles')).toHaveClass('integration-slot');
  });
});
