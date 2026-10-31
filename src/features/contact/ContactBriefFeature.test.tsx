import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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
      availability: 'Reply timing varies with current workload. Send the context first; I will confirm availability and the next realistic step.',
    },
    {
      language: 'he' as const,
      send: 'את הצורך, המצב הנוכחי והתוצאה שרוצים להשיג.',
      next: 'אחזור עם שאלות ממוקדות והמלצה לצעד הבא.',
      availability: 'זמן התגובה משתנה לפי עומס העבודה הנוכחי. שלחו קודם את ההקשר; אחזור עם אישור זמינות והצעד המעשי הבא.',
    },
  ])('explains what to send, availability, and what happens next in $language', ({ language, send, next, availability }) => {
    render(<ContactBriefFeature language={language} buildLocalizedPath={buildLocalizedPath} />);

    expect(screen.getByText(send)).toBeVisible();
    expect(screen.getByText(availability)).toBeVisible();
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
    expect(screen.getByRole('link', { name: 'evyatarhazan3.14@gmail.com' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:evyatarhazan3\.14@gmail\.com/),
    );
  });

  it('shows only the fields relevant to the selected inquiry type', () => {
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);
    openBuilder();

    expect(screen.getByRole('radio', { name: 'Project' })).toBeChecked();
    expect(screen.getByLabelText('What is not working?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: 'Role or opportunity' }));

    expect(screen.getByLabelText('Role or opportunity', { selector: 'textarea' })).toBeInTheDocument();
    expect(screen.getByLabelText('Company or team')).toBeInTheDocument();
    expect(screen.getByLabelText('Why this looks relevant')).toBeInTheDocument();
    expect(screen.queryByLabelText('What is not working?')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Role or opportunity', { selector: 'textarea' }), {
      target: { value: 'Synthetic product engineering role' },
    });
    const emailBody = new URLSearchParams(
      (screen.getByRole('link', { name: 'Open email draft' }).getAttribute('href') ?? '').split('?')[1],
    ).get('body');
    expect(emailBody).toContain('Inquiry type: Role or opportunity');
    expect(emailBody).toContain('Role or opportunity: Synthetic product engineering role');

    fireEvent.click(screen.getByRole('radio', { name: 'Collaboration' }));
    expect(screen.getByLabelText('Collaboration idea')).toBeInTheDocument();
    expect(screen.getByLabelText('Why now')).toBeInTheDocument();
    expect(screen.queryByLabelText('Company or team')).not.toBeInTheDocument();
  });

  it('renders the inquiry taxonomy and relevant fields in Hebrew', () => {
    render(<ContactBriefFeature language="he" buildLocalizedPath={buildLocalizedPath} />);
    fireEvent.click(screen.getByRole('button', { name: /שליחת הודעה קצרה/i }));
    fireEvent.click(screen.getByRole('radio', { name: 'משרה או הזדמנות' }));

    expect(screen.getByLabelText('החברה או הצוות')).toBeInTheDocument();
    expect(screen.getByLabelText('למה זה נראה רלוונטי')).toBeInTheDocument();
    expect(screen.queryByLabelText('מה לא עובד?')).not.toBeInTheDocument();
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
    fireEvent.click(screen.getByRole('button', { name: /שליחת הודעה קצרה/i }));

    expect(screen.queryByText('מה קורה עכשיו')).not.toBeInTheDocument();
    expect(screen.queryByText(/אין כאן התחייבות לזמן תגובה קבוע/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('הודעה'), {
      target: { value: 'בדיקה סינתטית של הצעד הבא' },
    });
    fireEvent.change(screen.getByLabelText('שם'), { target: { value: 'מבקר בדיקה' } });
    fireEvent.change(screen.getByLabelText('כתובת אימייל'), {
      target: { value: 'visitor@example.test' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /שליחה באמצעות FormSubmit/i }).closest('form')!);

    expect(await screen.findByText(/מה קורה עכשיו/i)).toBeInTheDocument();
    expect(screen.getByText(/שאלות ממוקדות או המלצה לצעד הבא/i)).toBeInTheDocument();
    expect(screen.getByText(/אין כאן התחייבות לזמן תגובה קבוע/i)).toBeInTheDocument();
  });

  it('includes allowlisted case-study context in the submitted message', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);
    render(
      <ContactBriefFeature
        language="en"
        buildLocalizedPath={buildLocalizedPath}
        context={{ intent: 'project', projectId: 'online_converter' }}
        onContextChange={vi.fn()}
      />,
    );
    openBuilder();

    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Synthetic case-study context check' },
    });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Visitor' } });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'visitor@example.test' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /send with FormSubmit/i }).closest('form')!);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = init.body as FormData;
    expect(body.get('message')).toContain(
      'Related project (selected on the portfolio): Online Converter',
    );
    expect(body.get('_subject')).toBe('Project inquiry related to Online Converter');
    expect(body.get('_honey')).toBe('');
    expect(body.get('_captcha')).toBe('false');
    expect([...body.keys()]).toEqual(['name', 'email', 'message', '_subject', '_honey', '_captcha']);
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
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Synthetic spam-protection integration check' },
    });
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

  it('preserves every field after a rejected request and allows correction and retry', async () => {
    let rejectRequest: ((reason?: unknown) => void) | undefined;
    const fetchMock = vi.fn()
      .mockImplementationOnce(() => new Promise((_, reject) => {
        rejectRequest = reject;
      }))
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true }),
      });
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);
    openBuilder();

    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Keep this synthetic brief' },
    });
    fireEvent.change(screen.getByLabelText('What exists today?'), {
      target: { value: 'A complete synthetic fixture' },
    });
    fireEvent.change(screen.getByLabelText('What is not working?'), {
      target: { value: 'The provider request fails' },
    });
    fireEvent.change(screen.getByLabelText('What outcome would make this successful?'), {
      target: { value: 'Retry without retyping anything' },
    });
    fireEvent.change(screen.getByLabelText('What is the timeframe?'), {
      target: { value: 'This quarter' },
    });
    fireEvent.change(screen.getByLabelText('Preferred channel'), {
      target: { value: 'form' },
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
    expect(screen.getByLabelText('What exists today?')).toHaveValue('A complete synthetic fixture');
    expect(screen.getByLabelText('What is not working?')).toHaveValue('The provider request fails');
    expect(screen.getByLabelText('What outcome would make this successful?')).toHaveValue('Retry without retyping anything');
    expect(screen.getByLabelText('What is the timeframe?')).toHaveValue('This quarter');
    expect(screen.getByLabelText('Preferred channel')).toHaveValue('form');
    expect(screen.getByLabelText('Name')).toHaveValue('Test Visitor');
    expect(screen.getByLabelText('Email address')).toHaveValue('visitor@example.test');
    expect(screen.getByRole('link', { name: 'Open email draft' })).toHaveAttribute(
      'href',
      expect.stringContaining('Keep+this+synthetic+brief'),
    );
    expect(screen.getByRole('link', { name: 'evyatarhazan3.14@gmail.com' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:evyatarhazan3\.14@gmail\.com/),
    );

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'corrected@example.test' },
    });
    expect(screen.queryByText(/Every field is still here/i)).not.toBeInTheDocument();
    fireEvent.submit(form);

    expect(await screen.findByText(/confirmed delivery/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const retryBody = (fetchMock.mock.calls[1]![1] as RequestInit).body as FormData;
    expect(retryBody.get('email')).toBe('corrected@example.test');
    expect(retryBody.get('message')).toContain('A complete synthetic fixture');
    expect(retryBody.get('message')).toContain('Retry without retyping anything');
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

    const deliveryError = await screen.findByRole('alert');
    expect(deliveryError).toHaveTextContent(/Delivery was not confirmed/i);
    expect(deliveryError).toHaveAttribute('aria-live', 'assertive');
    expect(deliveryError).toHaveAttribute('aria-atomic', 'true');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry form delivery' })).toBeInTheDocument();
    expect(screen.queryByText(/What happens next/i)).not.toBeInTheDocument();
  });

  it('announces confirmed delivery once with polite priority without moving focus', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);
    openBuilder();

    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Synthetic announcement check' },
    });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Visitor' } });
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'visitor@example.test' },
    });
    const submitButton = screen.getByRole('button', { name: /send with FormSubmit/i });
    submitButton.focus();
    fireEvent.submit(submitButton.closest('form')!);

    const deliveryStatus = await screen.findByRole('status');
    expect(deliveryStatus).toHaveTextContent(/confirmed delivery/i);
    expect(deliveryStatus).toHaveAttribute('aria-live', 'polite');
    expect(deliveryStatus).toHaveAttribute('aria-atomic', 'true');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(deliveryStatus).not.toHaveFocus();
    expect(document.querySelectorAll('[role="status"]')).toHaveLength(1);
  });

  it('links every inline error to its field, announces the summary, and lets keyboard users return to the field', async () => {
    render(<ContactBriefFeature language="en" buildLocalizedPath={buildLocalizedPath} />);

    fireEvent.click(screen.getByRole('button', { name: 'Send a short message' }));
    fireEvent.click(screen.getByRole('button', { name: 'Send with FormSubmit' }));

    const messageField = screen.getByRole('textbox', { name: 'Message' });
    const nameField = screen.getByRole('textbox', { name: 'Name' });
    const emailField = screen.getByRole('textbox', { name: 'Email address' });
    const alert = screen.getByRole('alert');
    const messageErrorId = messageField.getAttribute('aria-errormessage');
    const nameErrorId = nameField.getAttribute('aria-errormessage');
    const emailErrorId = emailField.getAttribute('aria-errormessage');
    const nameError = document.getElementById(nameErrorId!);
    const emailError = document.getElementById(emailErrorId!);

    expect(messageField).toHaveAttribute('aria-invalid', 'true');
    expect(nameField).toHaveAttribute('aria-invalid', 'true');
    expect(emailField).toHaveAttribute('aria-invalid', 'true');
    expect(document.getElementById(messageErrorId!)).toHaveTextContent('Enter a short message to send through the form.');
    expect(nameError).toHaveTextContent('Enter your name to send through the form.');
    expect(emailError).toHaveTextContent('Enter your email address to send through the form.');
    await waitFor(() => expect(alert).toHaveFocus());

    fireEvent.click(within(alert).getByRole('button', { name: 'Enter your email address to send through the form.' }));
    expect(emailField).toHaveFocus();
  });

  it('uses the same accessible inline-error contract in Hebrew and clears a corrected field error', () => {
    render(<ContactBriefFeature language="he" buildLocalizedPath={buildLocalizedPath} />);

    fireEvent.click(screen.getByRole('button', { name: 'שליחת הודעה קצרה' }));
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
