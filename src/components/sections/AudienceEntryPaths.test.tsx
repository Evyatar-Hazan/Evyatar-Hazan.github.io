import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../../contracts/portfolio';
import { AudienceEntryPaths } from './AudienceEntryPaths';
import { createAudienceEntryPathsRegistration } from './audienceEntryPathsRegistration';

const buildPath = vi.fn<LocalizedPathBuilder>((language, target) => (
  `/${language}/${target.route}`
));

describe('AudienceEntryPaths', () => {
  it('renders business visitors first, followed by recruiters and readers', () => {
    render(<AudienceEntryPaths language="en" buildPath={buildPath} />);

    const paths = screen.getAllByRole('listitem');
    expect(paths).toHaveLength(3);
    expect(paths[0]).toHaveAttribute('data-audience-priority', 'primary');
    expect(paths[0]).toHaveTextContent('Business owners, founders & product teams');
    expect(paths[1]).toHaveAttribute('data-audience-priority', 'secondary');
    expect(paths[1]).toHaveTextContent('Recruiters & technical leaders');
    expect(paths[2]).toHaveAttribute('data-audience-priority', 'secondary');
    expect(paths[2]).toHaveTextContent('Technical readers & fellow builders');
  });

  it('uses the injected localized route builder for existing destinations', () => {
    buildPath.mockClear();
    render(<AudienceEntryPaths language="en" buildPath={buildPath} />);

    expect(screen.getByRole('link', { name: /Discuss a product or system/i })).toHaveAttribute(
      'href',
      '/en/contact',
    );
    expect(screen.getByRole('link', { name: /Review selected work/i })).toHaveAttribute(
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
    expect(screen.getByText('בעלי עסקים, יזמים וצוותי מוצר')).toBeInTheDocument();
    expect(screen.getByText('מגייסים ומנהלים טכנולוגיים')).toBeInTheDocument();
    expect(screen.getByText('קוראים טכניים ואנשי פיתוח')).toBeInTheDocument();
  });

  it('registers in the approved home audience slot', () => {
    const registration = createAudienceEntryPathsRegistration(buildPath);

    expect(registration.taskId).toBe('t01');
    expect(registration.slot).toBe('home.audience');
    expect(registration.Component).toEqual(expect.any(Function));
  });
});
