import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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

    fireEvent.change(screen.getByLabelText('What outcome would make this successful?'), {
      target: { value: 'A reliable handoff' },
    });

    const preview = screen.getByLabelText<HTMLTextAreaElement>('Message review');
    expect(preview.value).toContain('What I need: A synthetic scheduling tool');
    expect(preview.value).toContain('Main issue: The current handoff is manual');
    expect(preview.value).toContain('Desired outcome: A reliable handoff');
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
    expect(screen.getByRole('link', { name: 'evyatarhazan3.14@gmail.com' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:evyatarhazan3\.14@gmail\.com/),
    );
  });

  it('does not contact the provider when required form identity fields are missing', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);
    openBuilder();

    fireEvent.submit(screen.getByRole('button', { name: /send with FormSubmit/i }).closest('form')!);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Name')).toBeRequired();
    expect(screen.getByLabelText('Email address')).toBeRequired();
    expect(screen.getByRole('alert')).toHaveTextContent('Enter your name');
  });

  it('submits only the allowlisted delivery fields after an explicit submit', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: 'true' }),
    });
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
    expect(fetchMock).not.toHaveBeenCalled();
    fireEvent.submit(screen.getByRole('button', { name: /send with FormSubmit/i }).closest('form')!);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [endpoint, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = init.body as FormData;
    expect(endpoint).toBe('https://formsubmit.co/ajax/evyatarhazan3.14@gmail.com');
    expect([...body.keys()]).toEqual(['name', 'email', 'message', '_subject', '_honey', '_captcha']);
    expect(body.get('message')).toContain('Synthetic portfolio fixture');
    expect(body.get('_honey')).toBe('');
    expect(body.get('_captcha')).toBe('false');
    expect([...body.keys()]).not.toContain('intent');
    expect(await screen.findByText(/confirmed delivery/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'evyatarhazan3.14@gmail.com' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:evyatarhazan3\.14@gmail\.com/),
    );
    expect(screen.getByText(/What happens next/i)).toBeInTheDocument();
    expect(screen.getByText(/focused questions or a recommended next step/i)).toBeInTheDocument();
    expect(screen.getByText(/no fixed response-time promise/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true');
  });

  it('shows the localized next step only after provider-confirmed success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactBriefFeature language="he" buildLocalizedPath={buildLocalizedPath} />);
    fireEvent.click(screen.getByRole('button', { name: /תקציר פרויקט קצר/i }));

    expect(screen.queryByText('מה קורה עכשיו')).not.toBeInTheDocument();
    expect(screen.queryByText(/אין כאן התחייבות לזמן תגובה קבוע/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('שם'), { target: { value: 'מבקר בדיקה' } });
    fireEvent.change(screen.getByLabelText('כתובת אימייל'), {
      target: { value: 'visitor@example.test' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /שליחה באמצעות FormSubmit/i }).closest('form')!);

    expect(await screen.findByText(/מה קורה עכשיו/i)).toBeInTheDocument();
    expect(screen.getByText(/שאלות ממוקדות או המלצה לצעד הבא/i)).toBeInTheDocument();
    expect(screen.getByText(/אין כאן התחייבות לזמן תגובה קבוע/i)).toBeInTheDocument();
  });

  it('passes honeypot values to FormSubmit without exposing a CAPTCHA or focus target', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);
    openBuilder();

    const honeypot = document.querySelector<HTMLInputElement>('input[name="_honey"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute('hidden');
    expect(honeypot).toHaveAttribute('tabindex', '-1');
    expect(document.querySelector('iframe[src*="recaptcha"], script[src*="recaptcha"]')).toBeNull();

    fireEvent.change(honeypot!, { target: { value: 'synthetic bot payload' } });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Synthetic Bot' } });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'bot@example.test' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /send with FormSubmit/i }).closest('form')!);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const body = fetchMock.mock.calls[0]![1]!.body as FormData;
    expect(body.get('_honey')).toBe('synthetic bot payload');
    expect(body.get('_captcha')).toBe('false');
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

    fireEvent.change(screen.getByLabelText('What do you need?'), {
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
    expect(screen.getByLabelText<HTMLTextAreaElement>('What do you need?').value).toBe(
      'Keep this synthetic brief',
    );
    expect(screen.getByRole('link', { name: 'Open email draft' })).toHaveAttribute(
      'href',
      expect.stringContaining('Keep+this+synthetic+brief'),
    );
    expect(screen.getByRole('link', { name: 'evyatarhazan3.14@gmail.com' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:evyatarhazan3\.14@gmail\.com/),
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

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Visitor' } });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'visitor@example.test' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /send with FormSubmit/i }).closest('form')!);

    expect(await screen.findByText(/Delivery was not confirmed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry form delivery' })).toBeInTheDocument();
    expect(screen.queryByText(/What happens next/i)).not.toBeInTheDocument();
  });

  it('links every inline error to its field, announces the summary, and lets keyboard users return to the field', async () => {
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);

    fireEvent.click(screen.getByRole('button', { name: 'Build a short project brief (optional)' }));
    fireEvent.click(screen.getByRole('button', { name: 'Send with FormSubmit' }));

    const nameField = screen.getByRole('textbox', { name: 'Name' });
    const emailField = screen.getByRole('textbox', { name: 'Email address' });
    const alert = screen.getByRole('alert');
    const nameErrorId = nameField.getAttribute('aria-errormessage');
    const emailErrorId = emailField.getAttribute('aria-errormessage');
    const nameError = document.getElementById(nameErrorId!);
    const emailError = document.getElementById(emailErrorId!);

    expect(nameField).toHaveAttribute('aria-invalid', 'true');
    expect(emailField).toHaveAttribute('aria-invalid', 'true');
    expect(nameError).toHaveTextContent('Enter your name to send through the form.');
    expect(emailError).toHaveTextContent('Enter your email address to send through the form.');
    await waitFor(() => expect(alert).toHaveFocus());

    fireEvent.click(within(alert).getByRole('button', { name: 'Enter your email address to send through the form.' }));
    expect(emailField).toHaveFocus();
  });

  it('uses the same accessible inline-error contract in Hebrew and clears a corrected field error', () => {
    render(<ContactBriefFeature language="he" buildLocalizedPath={buildLocalizedPath} />);

    fireEvent.click(screen.getByRole('button', { name: 'הכנת תקציר פרויקט קצר (לא חובה)' }));
    fireEvent.click(screen.getByRole('button', { name: 'שליחה באמצעות FormSubmit' }));

    const nameField = screen.getByRole('textbox', { name: 'שם' });
    const nameErrorId = nameField.getAttribute('aria-errormessage');
    expect(nameErrorId).toBeTruthy();
    expect(document.getElementById(nameErrorId!)).toHaveTextContent('יש להזין שם כדי לשלוח דרך הטופס.');
    expect(screen.getByRole('alert')).toHaveTextContent('יש לתקן את השדות הבאים:');

    fireEvent.change(nameField, { target: { value: 'אביתר' } });
    expect(nameField).toHaveAttribute('aria-invalid', 'false');
    expect(nameField).not.toHaveAttribute('aria-errormessage');
  });
});
