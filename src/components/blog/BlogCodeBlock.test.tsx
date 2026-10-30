import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BlogCodeBlock from './BlogCodeBlock';

describe('BlogCodeBlock', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('copies the exact code and confirms success in English', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(
      <BlogCodeBlock language="en">
        <code className="language-typescript">const value = 42;</code>
      </BlogCodeBlock>,
    );

    expect(screen.getByText('TYPESCRIPT')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('const value = 42;'));
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('uses localized Hebrew labels and keeps the pre keyboard-focusable', () => {
    render(
      <BlogCodeBlock language="he">
        <code className="language-java">System.out.println("שלום");</code>
      </BlogCodeBlock>,
    );

    expect(screen.getByRole('button', { name: 'העתקת קוד' })).toBeInTheDocument();
    expect(screen.getByText('JAVA')).toBeInTheDocument();
    expect(screen.getByText('System.out.println("שלום");').closest('pre')).toHaveAttribute('tabindex', '0');
    expect(screen.getByText('System.out.println("שלום");').closest('pre')).toHaveAttribute('dir', 'auto');
  });
});
