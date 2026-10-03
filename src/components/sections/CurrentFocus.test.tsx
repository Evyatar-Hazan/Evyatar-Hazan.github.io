import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { currentFocus, isCurrentFocusFresh } from '../../data/currentFocus';
import { localizedPath } from '../../routing/portfolioRoutes';
import CurrentFocus from './CurrentFocus';

const renderFocus = (
  language: 'en' | 'he',
  referenceDate = new Date('2026-10-03T12:00:00Z'),
) => render(
  <MemoryRouter>
    <CurrentFocus
      language={language}
      localizedPathBuilder={localizedPath}
      referenceDate={referenceDate}
    />
  </MemoryRouter>,
);

describe('CurrentFocus', () => {
  it('keeps the manually reviewed record to one or two evidence-backed items', () => {
    expect(currentFocus.items.length).toBeGreaterThanOrEqual(1);
    expect(currentFocus.items.length).toBeLessThanOrEqual(2);
    expect(Date.parse(`${currentFocus.verifiedOn}T00:00:00Z`)).not.toBeNaN();
    expect(Date.parse(`${currentFocus.reviewAfter}T00:00:00Z`)).toBeGreaterThanOrEqual(
      Date.parse(`${currentFocus.verifiedOn}T00:00:00Z`),
    );
  });

  it('renders dated English focus with localized public outcome paths', () => {
    renderFocus('en');

    expect(screen.getByRole('heading', { name: 'What I am working to make clearer now.' })).toBeInTheDocument();
    expect(screen.getByText('Evidence checked')).toBeInTheDocument();
    expect(document.querySelector('time')).toHaveAttribute('datetime', '2026-10-01');
    expect(document.querySelector('[data-freshness="current"]')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See the Online Converter case study' })).toHaveAttribute(
      'href',
      '/en/projects/online_converter/',
    );
    expect(screen.getByRole('link', { name: 'Read the latest reliability note' })).toHaveAttribute(
      'href',
      '/en/blog/one-bad-date-should-not-blank-a-screen/',
    );
  });

  it('renders the same evidence in Hebrew', () => {
    renderFocus('he');

    expect(screen.getByRole('heading', { name: 'מה אני עובד לחדד עכשיו.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'לקייס סטאדי של Online Converter' })).toHaveAttribute(
      'href',
      '/he/projects/online_converter/',
    );
    expect(document.querySelectorAll('[data-focus-id]')).toHaveLength(2);
  });

  it('stops calling the record current after its explicit review date without hiding evidence', () => {
    renderFocus('en', new Date('2026-11-02T00:00:00Z'));

    expect(document.querySelector('[data-freshness="last-verified"]')).toBeInTheDocument();
    expect(screen.getByText('Last verified focus')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/Freshness review is due/i);
    expect(screen.getAllByRole('link')).toHaveLength(currentFocus.items.length);
    expect(isCurrentFocusFresh(currentFocus, new Date('2026-11-01T23:59:59Z'))).toBe(true);
    expect(isCurrentFocusFresh(currentFocus, new Date('2026-11-02T00:00:00Z'))).toBe(false);
  });

  it('contains no roadmap or promise language in either locale', () => {
    const publicCopy = currentFocus.items.flatMap((item) => [
      item.title.en,
      item.title.he,
      item.summary.en,
      item.summary.he,
      item.outcome.label.en,
      item.outcome.label.he,
    ]).join(' ');

    expect(publicCopy).not.toMatch(/coming soon|roadmap|will ship|launching|בקרוב|מפת דרכים|נשיק|מתוכנן/iu);
  });
});
