import { describe, expect, it } from 'vitest';
import { profileLinks } from '../data/profile';
import en from '../locales/en.json';
import he from '../locales/he.json';

describe('FIX-132 footer handoff copy', () => {
  it.each([
    {
      cta: 'Share the context',
      locale: en,
      message: "Hi Evyatar, here's what's blocked, who it affects, and what a useful outcome would look like:",
    },
    {
      cta: 'שתפו את ההקשר',
      locale: he,
      message: 'היי אביתר, הנה מה שמעוכב, על מי זה משפיע ואיך תיראה תוצאה שימושית:',
    },
  ])('keeps the $cta action aligned with its prepared WhatsApp message', ({ cta, locale, message }) => {
    expect(locale.footer.cta).toBe(cta);
    expect(locale.contact.whatsappText).toBe(message);

    const whatsappUrl = `${profileLinks.whatsapp}?text=${encodeURIComponent(locale.contact.whatsappText)}`;
    const parsedUrl = new URL(whatsappUrl);

    expect(`${parsedUrl.origin}${parsedUrl.pathname}`).toBe(profileLinks.whatsapp);
    expect(parsedUrl.searchParams.get('text')).toBe(message);
  });
});
