import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LocalizedPathBuilder } from '../../contracts/portfolio';
import ContactBriefFeature from './ContactBriefFeature';

const buildLocalizedPath: LocalizedPathBuilder = (language, target) =>
  `/${language}/${target.route}/`;

const openBuilder = () => {
  fireEvent.click(screen.getByRole('button', { name: /short message/i }));
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
    expect(screen.queryByRole('heading', { name: 'Message review' })).not.toBeInTheDocument();
  });

  it.each([
    {
      language: 'en' as const,
      send: 'The need, the current situation, and the result you want.',
      next: 'I will reply with focused questions and a recommended next step.',
    },
    {
      language: 'he' as const,
      send: 'את הצורך, המצב הנוכחי והתוצאה שרוצים להשיג.',
      next: 'אחזור עם שאלות ממוקדות והמלצה לצעד הבא.',
    },
  ])('explains what to send and what happens next in $language', ({ language, send, next }) => {
    render(<ContactBriefFeature language={language} buildLocalizedPath={buildLocalizedPath} />);

    expect(screen.getByText(send)).toBeVisible();
    expect(screen.getByText(next)).toBeVisible();
  });

  it('builds drafts from synthetic brief data and injects the localized privacy link', () => {
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);
    openBuilder();

    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'A synthetic scheduling tool' },
    });
    fireEvent.change(screen.getByLabelText('What is not working?'), {
      target: { value: 'The current handoff is manual' },
    });
    fireEvent.change(screen.getByLabelText('Preferred channel'), {
      target: { value: 'whatsapp' },
    });

    fireEvent.change(screen.getByLabelText('What outcome would make this successful?'), {
      target: { value: 'A reliable handoff' },
    });

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
    expect(emailBody).toContain('Main issue: The current handoff is manual');
    expect(emailBody).toContain('Desired outcome: A reliable handoff');
    expect(emailBody).toContain('Preferred channel: WhatsApp');
    expect(whatsappBody).toContain('A synthetic scheduling tool');
  });

  it('keeps the short form to exactly three required fields', () => {
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);
    openBuilder();

    const requiredFields = screen.getAllByRole('textbox').filter((field) => field.hasAttribute('required'));
    expect(requiredFields).toHaveLength(3);
    expect(screen.getByLabelText('Message')).toBeRequired();
    expect(screen.getByLabelText('Name')).toBeRequired();
    expect(screen.getByLabelText('Email address')).toBeRequired();
    expect(screen.getByLabelText('What exists today?')).not.toBeRequired();
  });

  it('does not contact the provider when required short-form fields are missing', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);
    openBuilder();

    fireEvent.submit(screen.getByRole('button', { name: /send with FormSubmit/i }).closest('form')!);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Name')).toBeRequired();
    expect(screen.getByLabelText('Email address')).toBeRequired();
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a short message');
  });

  it('submits only the allowlisted delivery fields after an explicit submit', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: 'true' }),
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);
    openBuilder();

    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Synthetic portfolio fixture' },
    });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Visitor' } });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'visitor@example.test' },
    });
    expect(fetchMock).not.toHaveBeenCalled();
    fireEvent.submit(screen.getByRole('button', { name: /send with FormSubmit/i }).closest('form')!);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [endpoint, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = init.body as FormData;
    expect(endpoint).toBe('https://formsubmit.co/ajax/evyatarhazan3.14@gmail.com');
    expect([...body.keys()]).toEqual(['name', 'email', 'message', '_subject']);
    expect(body.get('message')).toContain('Synthetic portfolio fixture');
    expect([...body.keys()]).not.toContain('intent');
    expect(await screen.findByText(/confirmed delivery/i)).toBeInTheDocument();
  });

  it('renders allowlisted project context and clears it through the caller', () => {
    const onContextChange = vi.fn();
    render(
      <ContactBriefFeature
        language="en"
        buildLocalizedPath={buildLocalizedPath}
        context={{ intent: 'project', projectId: 'online_converter' }}
        onContextChange={onContextChange}
        titleAs="h1"
      />,
    );

    expect(screen.getByRole('heading', { name: 'Online Converter' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      expect.stringContaining('Online%20Converter'),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear context' }));
    expect(onContextChange).toHaveBeenCalledWith({ intent: 'general' });
  });

  it('protects against double submit and keeps the brief after a rejected request', async () => {
    let rejectRequest: ((reason?: unknown) => void) | undefined;
    const fetchMock = vi.fn().mockImplementation(() => new Promise((_, reject) => {
      rejectRequest = reject;
    }));
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);
    openBuilder();

    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Keep this synthetic brief' },
    });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Visitor' } });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'visitor@example.test' },
    });
    const form = screen.getByRole('button', { name: /send with FormSubmit/i }).closest('form')!;
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    rejectRequest?.(new Error('synthetic network failure'));
    expect(await screen.findByText(/Delivery was not confirmed/i)).toBeInTheDocument();
    expect(screen.getByLabelText<HTMLTextAreaElement>('Message').value).toBe(
      'Keep this synthetic brief',
    );
    expect(screen.getByRole('link', { name: 'Open email draft' })).toHaveAttribute(
      'href',
      expect.stringContaining('Keep+this+synthetic+brief'),
    );
  });

  it('does not treat an HTTP 200 without provider confirmation as delivered', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: false }),
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);
    openBuilder();

    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Synthetic provider confirmation check' },
    });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Visitor' } });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'visitor@example.test' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /send with FormSubmit/i }).closest('form')!);

    expect(await screen.findByText(/Delivery was not confirmed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry form delivery' })).toBeInTheDocument();
  });
});
