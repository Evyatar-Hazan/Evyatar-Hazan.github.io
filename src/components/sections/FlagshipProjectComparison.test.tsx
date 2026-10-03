import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import {
  homepageFeaturedProjectIds,
  type LocalizedPathBuilder,
} from '../../contracts/portfolio';
import {
  flagshipProjectComparisonCopy,
  flagshipProjectComparisonRecords,
} from '../../data/flagshipProjectComparison';
import FlagshipProjectComparison from './FlagshipProjectComparison';

const buildPath: LocalizedPathBuilder = (language, target) => {
  if (target.route !== 'project') throw new Error('Unexpected comparison route.');
  return `/${language}/projects/${target.id}/`;
};

const renderComparison = (language: 'en' | 'he', pathBuilder = buildPath) => render(
  <MemoryRouter>
    <FlagshipProjectComparison language={language} buildPath={pathBuilder} />
  </MemoryRouter>,
);

describe('FlagshipProjectComparison', () => {
  it.each(['en', 'he'] as const)('renders all four featured projects in canonical order in %s', (language) => {
    renderComparison(language);

    const list = screen.getByRole('list', {
      name: flagshipProjectComparisonCopy[language].title,
    });
    const rows = within(list).getAllByRole('listitem');

    expect(rows).toHaveLength(homepageFeaturedProjectIds.length);
    rows.forEach((row, index) => {
      const record = flagshipProjectComparisonRecords[index];
      expect(record.id).toBe(homepageFeaturedProjectIds[index]);
      expect(within(row).getByRole('heading', { name: record.title[language] })).toBeInTheDocument();
      expect(within(row).getByText(record.audience[language])).toBeInTheDocument();
      expect(within(row).getByText(record.problem[language])).toBeInTheDocument();
      expect(within(row).getByText(record.contribution[language])).toBeInTheDocument();
      expect(within(row).getByText(record.evidence[language])).toBeInTheDocument();
      expect(within(row).getByRole('link', {
        name: flagshipProjectComparisonCopy[language].openProject(record.title[language]),
      })).toHaveAttribute('href', `/${language}/projects/${record.id}/`);
    });
  });

  it('delegates every deep link to the injected localized path builder', () => {
    const pathBuilder = vi.fn<LocalizedPathBuilder>((language, target) => {
      if (target.route !== 'project') throw new Error('Unexpected comparison route.');
      return `/resolved/${language}/${target.id}`;
    });

    renderComparison('en', pathBuilder);

    expect(pathBuilder).toHaveBeenCalledTimes(homepageFeaturedProjectIds.length);
    homepageFeaturedProjectIds.forEach((id) => {
      expect(pathBuilder).toHaveBeenCalledWith('en', { route: 'project', id });
    });
  });

  it('stays a static comparison and keeps emergency evidence learning-only', () => {
    const { container } = renderComparison('en');
    const emergency = flagshipProjectComparisonRecords.find(({ id }) => id === 'emergency_protocol');

    expect(container.querySelectorAll('button')).toHaveLength(0);
    expect(emergency?.audience.en).toMatch(/learning and practice/i);
    expect(emergency?.evidence.en).toMatch(/Functions and D1 in production/i);
    expect(emergency?.evidence.en).toMatch(/No medical validation or emergency-use claim/i);

    const allCopy = JSON.stringify(flagshipProjectComparisonRecords);
    expect(allCopy).not.toMatch(/Google OAuth/i);
    expect(allCopy).not.toMatch(/Express and Prisma/i);
  });
});
