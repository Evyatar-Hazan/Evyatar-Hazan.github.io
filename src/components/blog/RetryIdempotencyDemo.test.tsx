import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RetryIdempotencyDemo from './RetryIdempotencyDemo';
import { retryIdempotencyDemoRegistration } from './retryIdempotencyDemoRegistration';

describe('RetryIdempotencyDemo', () => {
  it('shows how the protected retry reuses a record while the unprotected retry duplicates it', () => {
    render(<RetryIdempotencyDemo language="en" />);

    const unprotected = screen.getByRole('region', { name: 'Without protection' });
    const protectedPath = screen.getByRole('region', { name: 'With idempotency' });

    fireEvent.click(screen.getByRole('button', { name: 'Run first attempt' }));

    expect(within(unprotected).getByText('MEMBER-101')).toBeInTheDocument();
    expect(within(protectedPath).getByText('MEMBER-101')).toBeInTheDocument();
    expect(within(unprotected).getByText('Simulated delivery failed.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Retry same intent' }));

    expect(within(unprotected).getByText('MEMBER-102')).toBeInTheDocument();
    expect(within(unprotected).getByText('Duplicate business record detected.')).toBeInTheDocument();
    expect(within(protectedPath).queryByText('MEMBER-102')).not.toBeInTheDocument();
    expect(within(protectedPath).getByText('No duplicate record created.')).toBeInTheDocument();
  });

  it('resets the synthetic scenario without making network requests', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    render(<RetryIdempotencyDemo language="en" />);

    fireEvent.click(screen.getByRole('button', { name: 'Run first attempt' }));
    fireEvent.click(screen.getByRole('button', { name: 'Retry same intent' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reset demo' }));

    expect(screen.getAllByText('Waiting for an action.')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Run first attempt' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Retry same intent' })).toBeDisabled();
    expect(fetchSpy).not.toHaveBeenCalled();

    fetchSpy.mockRestore();
  });

  it('provides equivalent Hebrew controls and the approved article slot registration', () => {
    render(<RetryIdempotencyDemo language="he" />);

    expect(screen.getByRole('region', { name: 'ניסיון חוזר לאותה כוונה' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'הרצת הניסיון הראשון' })).toBeEnabled();
    expect(retryIdempotencyDemoRegistration.taskId).toBe('t11');
    expect(retryIdempotencyDemoRegistration.slot).toBe('article.interactive');
  });
});
