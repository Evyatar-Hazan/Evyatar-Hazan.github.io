import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../../contracts/portfolio';
import ContactBriefFeature from './ContactBriefFeature';

const buildLocalizedPath: LocalizedPathBuilder = (language, target) =>
  `/${language}/${target.route}/`;

const openBuilder = () => {
  fireEvent.click(screen.getByRole('button', { name: /project brief/i }));
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ContactBriefFeature', () => {
  it('keeps direct contact available before the optional builder is opened', () => {
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);

    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/972587127547'),
    );
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:evyatarhazan3.14@gmail.com'),
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/evyatar-hazan-662235210/',
    );
    expect(screen.queryByRole('heading', { name: 'Message preview' })).not.toBeInTheDocument();
  });

  it('previews synthetic brief data and injects the localized privacy link', () => {
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);
    openBuilder();

    fireEvent.change(screen.getByLabelText('What do you need?'), {
      target: { value: 'A synthetic scheduling tool' },
    });
    fireEvent.change(screen.getByLabelText('What is not working?'), {
      target: { value: 'The current handoff is manual' },
    });
    fireEvent.change(screen.getByLabelText('Preferred channel'), {
      target: { value: 'whatsapp' },
    });

    const preview = screen.getByLabelText<HTMLTextAreaElement>('Message preview');
    expect(preview.value).toContain('What I need: A synthetic scheduling tool');
    expect(preview.value).toContain('Main issue: The current handoff is manual');
    expect(preview.value).toContain('Preferred channel: WhatsApp');
    expect(screen.getByRole('link', { name: 'Read the privacy notice' })).toHaveAttribute(
      'href',
      '/en/privacy/',
    );

    const emailDraft = screen.getByRole('link', { name: 'Open email draft' });
    const whatsappDraft = screen.getByRole('link', { name: 'Open WhatsApp draft' });
    const emailBody = new URLSearchParams(
      (emailDraft.getAttribute('href') ?? '').split('?')[1],
    ).get('body');
    const whatsappBody = new URL(whatsappDraft.getAttribute('href') ?? '').searchParams.get(
      'text',
    );
    expect(emailBody).toContain('A synthetic scheduling tool');
    expect(whatsappBody).toContain('A synthetic scheduling tool');
  });

  it('does not contact the provider when required form identity fields are missing', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);
    openBuilder();

    fireEvent.submit(screen.getByRole('button', { name: /send with the existing form/i }).closest('form')!);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Name')).toBeRequired();
    expect(screen.getByLabelText('Email address')).toBeRequired();
  });

  it('submits only the existing name, email, and generated message fields', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);
    openBuilder();

    fireEvent.change(screen.getByLabelText('What do you need?'), {
      target: { value: 'Synthetic portfolio fixture' },
    });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Visitor' } });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'visitor@example.test' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /send with the existing form/i }).closest('form')!);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [endpoint, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = init.body as FormData;
    expect(endpoint).toBe('https://formsubmit.co/ajax/evyatarhazan3.14@gmail.com');
    expect([...body.keys()]).toEqual(['message', 'name', 'email']);
    expect(body.get('message')).toContain('Synthetic portfolio fixture');
    expect(await screen.findByText(/Message sent successfully/i)).toBeInTheDocument();
  });
});
