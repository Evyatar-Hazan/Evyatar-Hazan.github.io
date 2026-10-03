import { describe, expect, it } from 'vitest';
import {
  buildContactBriefMessage,
  buildContactEmailHref,
  buildContactWhatsappHref,
  emptyContactBrief,
} from './contactBrief';

describe('contact brief message builders', () => {
  it('uses the existing localized direct-contact message when the optional brief is empty', () => {
    expect(buildContactBriefMessage('en', emptyContactBrief)).toBe(
      'Hi Evyatar, I saw your website and would like to talk about a project.',
    );
    expect(buildContactBriefMessage('he', emptyContactBrief)).toBe(
      'היי אביתר, ראיתי את האתר שלך ורוצה לדבר על פרויקט.',
    );
  });

  it('formats only completed fields in the preview', () => {
    const message = buildContactBriefMessage('en', {
      ...emptyContactBrief,
      need: '  A clearer onboarding flow  ',
      issue: 'Users get stuck after sign-up',
      preferredChannel: 'email',
    });

    expect(message).toContain('What I need: A clearer onboarding flow');
    expect(message).toContain('Main issue: Users get stuck after sign-up');
    expect(message).toContain('Preferred channel: Email');
    expect(message).not.toContain('Existing situation:');
    expect(message).not.toContain('Timeframe:');
  });

  it('formats every approved brief field in Hebrew', () => {
    const message = buildContactBriefMessage('he', {
      need: 'כלי תיאום',
      existingSituation: 'התהליך מתבצע ידנית',
      issue: 'העברת המידע איטית',
      timeframe: 'ברבעון הקרוב',
      preferredChannel: 'form',
    });

    expect(message).toContain('מה אני צריך/ה: כלי תיאום');
    expect(message).toContain('המצב הקיים: התהליך מתבצע ידנית');
    expect(message).toContain('הבעיה המרכזית: העברת המידע איטית');
    expect(message).toContain('לוח זמנים: ברבעון הקרוב');
    expect(message).toContain('ערוץ מועדף: טופס באתר');
  });

  it('encodes the same preview into email and WhatsApp drafts', () => {
    const message = 'Hi Evyatar,\nNeed: synthetic test project';
    const emailHref = buildContactEmailHref('mailto:test@example.com', 'en', message);
    const whatsappHref = buildContactWhatsappHref('https://wa.me/10000000000', message);

    expect(emailHref).toContain('mailto:test@example.com?');
    expect(new URLSearchParams(emailHref.split('?')[1]).get('body')).toBe(message);
    expect(new URL(whatsappHref).searchParams.get('text')).toBe(message);
  });
});
