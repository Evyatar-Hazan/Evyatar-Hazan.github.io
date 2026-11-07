import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../../contracts/portfolio';
import { AudienceEntryPaths } from './AudienceEntryPaths';

const buildPath = vi.fn<LocalizedPathBuilder>((language, target) => (
  `/${language}/${target.route}`
));

describe('AudienceEntryPaths', () => {
  it('renders business visitors first, followed by professional-fit evaluators and readers', () => {
    render(<AudienceEntryPaths language="en" buildPath={buildPath} />);

    const paths = screen.getAllByRole('listitem');
    expect(paths).toHaveLength(3);
    expect(paths[0]).toHaveAttribute('data-audience-priority', 'primary');
    expect(paths[0]).toHaveTextContent('When a product, workflow, or system blocks progress');
    expect(paths[1]).toHaveAttribute('data-audience-priority', 'secondary');
    expect(paths[1]).toHaveTextContent('Assess product engineering fit');
    expect(paths[2]).toHaveAttribute('data-audience-priority', 'secondary');
    expect(paths[2]).toHaveTextContent('Technical readers & fellow builders');
  });

  it('uses the injected localized route builder for existing destinations', () => {
    buildPath.mockClear();
    render(<AudienceEntryPaths language="en" buildPath={buildPath} />);

    expect(screen.getByRole('link', { name: /Describe what's blocking progress/i })).toHaveAttribute(
      'href',
      '/en/contact',
    );
    expect(screen.getByRole('link', { name: /Assess contribution and evidence/i })).toHaveAttribute(
      'href',
      '/en/projects',
    );
    expect(screen.getByRole('link', { name: /Read the technical notes/i })).toHaveAttribute(
      'href',
      '/en/blog',
    );
    expect(buildPath).toHaveBeenNthCalledWith(1, 'en', { route: 'contact' });
    expect(buildPath).toHaveBeenNthCalledWith(2, 'en', { route: 'projects' });
    expect(buildPath).toHaveBeenNthCalledWith(3, 'en', { route: 'blog' });
  });

  it('renders the Hebrew path labels and exposes a localized navigation name', () => {
    render(<AudienceEntryPaths language="he" buildPath={buildPath} />);

    expect(screen.getByRole('navigation', { name: 'מה צריך להתקדם?' })).toBeInTheDocument();
    expect(screen.getByText('כשמוצר, תהליך או מערכת מעכבים התקדמות')).toBeInTheDocument();
    expect(screen.getByText('לבחון התאמה מקצועית לפיתוח מוצר')).toBeInTheDocument();
    expect(screen.getByText('קוראים טכניים ואנשי פיתוח')).toBeInTheDocument();
  });
});
