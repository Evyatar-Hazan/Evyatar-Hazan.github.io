import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../../contracts/portfolio';
import { DatePresentationDemo } from './DatePresentationDemo';
import { createDatePresentationRegistration } from './datePresentationRegistration';

const buildLocalizedPath = vi.fn<LocalizedPathBuilder>((language, target) => (
  target.route === 'article' ? `/${language}/blog/${target.id}/` : `/${language}/`
));

describe('DatePresentationDemo', () => {
  it('renders a semantic valid date and uses the injected localized route builder', () => {
    render(<DatePresentationDemo language="en" buildLocalizedPath={buildLocalizedPath} />);

    expect(screen.getByLabelText('ISO calendar date')).toHaveValue('2026-09-13');
    expect(screen.getByText('September 13, 2026')).toHaveAttribute('datetime', '2026-09-13');
    expect(screen.getByText('Valid calendar date')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read the public engineering note' })).toHaveAttribute(
      'href',
      '/en/blog/one-bad-date-should-not-blank-a-screen/',
    );
    expect(buildLocalizedPath).toHaveBeenCalledWith('en', {
      route: 'article',
      id: 'one-bad-date-should-not-blank-a-screen',
    });
  });

  it('contains malformed input without removing the rest of the demo', () => {
    render(<DatePresentationDemo language="en" buildLocalizedPath={buildLocalizedPath} />);

    fireEvent.change(screen.getByLabelText('ISO calendar date'), { target: { value: '2023-02-29' } });

    expect(screen.getByText('Invalid input contained')).toBeInTheDocument();
    expect(screen.getByText('Date unavailable')).not.toHaveAttribute('datetime');
    expect(screen.getByRole('heading', { name: 'Contract' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read the public engineering note' })).toBeInTheDocument();
  });

  it('offers labeled keyboard-native presets and an honest empty state', () => {
    render(<DatePresentationDemo language="en" buildLocalizedPath={buildLocalizedPath} />);

    const emptyButton = screen.getByRole('button', { name: 'Empty' });
    emptyButton.focus();
    expect(emptyButton).toHaveFocus();
    fireEvent.click(emptyButton);

    expect(screen.getByLabelText('ISO calendar date')).toHaveValue('');
    expect(screen.getByText('Waiting for a date')).toBeInTheDocument();
    expect(screen.getByText('Date unavailable')).not.toHaveAttribute('datetime');
  });

  it('renders localized Hebrew copy and direction', () => {
    const { container } = render(
      <DatePresentationDemo language="he" buildLocalizedPath={buildLocalizedPath} />,
    );

    expect(container.querySelector('section')).toHaveAttribute('dir', 'rtl');
    expect(screen.getByLabelText('תאריך קלנדרי בתקן ISO')).toBeInTheDocument();
    expect(screen.getByText('תאריך קלנדרי תקין')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'לקריאת הרשומה ההנדסית הפומבית' })).toHaveAttribute(
      'href',
      '/he/blog/one-bad-date-should-not-blank-a-screen/',
    );
  });

  it('registers through the shared portfolio slot contract', () => {
    const registration = createDatePresentationRegistration(buildLocalizedPath);

    expect(registration.taskId).toBe('t12');
    expect(registration.slot).toBe('lab.reusableComponent');
    render(<registration.Component language="en" />);
    expect(screen.getByRole('heading', { name: 'A date should inform, not interrupt.' })).toBeInTheDocument();
  });
});
