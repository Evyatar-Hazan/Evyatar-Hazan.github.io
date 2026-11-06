import { describe, expect, it } from 'vitest';
import {
  buildContactUrl,
  contactIntentOptions,
  getContactContextDetails,
  parseContactContext,
  sanitizeContactSearch,
  serializeContactContext,
} from './contactIntent';

describe('contact intent model', () => {
  it.each([
    {
      language: 'en' as const,
      intent: 'general' as const,
      title: 'I’m not sure where to start',
      description: 'My need spans more than one path, or I want to describe it in my own words.',
    },
    {
      language: 'en' as const,
      intent: 'new-product' as const,
      title: 'I’m launching a new product or site',
      description: 'I have a new public-facing idea that needs a clear path to a launch-ready product or site.',
    },
    {
      language: 'en' as const,
      intent: 'internal-system' as const,
      title: 'I need an internal or full-stack system',
      description: 'I need a maintainable system for a manual workflow, operational need, or team process.',
    },
    {
      language: 'en' as const,
      intent: 'improve-existing' as const,
      title: 'I want to improve an existing product',
      description: 'I have a live product that needs a focused improvement to its experience, structure, discoverability, or validation.',
    },
    {
      language: 'he' as const,
      intent: 'general' as const,
      title: 'עוד לא ברור לי מאיפה להתחיל',
      description: 'הצורך שלי משלב כמה מסלולים, או שנוח לי לתאר אותו במילים שלי.',
    },
    {
      language: 'he' as const,
      intent: 'new-product' as const,
      title: 'אני רוצה להשיק מוצר או אתר חדש',
      description: 'יש לי רעיון חדש שצריך מסלול ברור למוצר או לאתר שמוכן להשקה.',
    },
    {
      language: 'he' as const,
      intent: 'internal-system' as const,
      title: 'אני צריך מערכת פנימית או Full Stack',
      description: 'אני צריך להפוך תהליך ידני, צורך תפעולי או עבודה צוותית למערכת שאפשר לתחזק.',
    },
    {
      language: 'he' as const,
      intent: 'improve-existing' as const,
      title: 'אני רוצה לשפר מוצר קיים',
      description: 'יש לי מוצר פעיל שצריך שיפור ממוקד בחוויה, במבנה, בגילוי או בבדיקות.',
    },
  ])('keeps $language $intent copy visitor-centered', ({ language, intent, title, description }) => {
    expect(getContactContextDetails(language, { intent })).toMatchObject({ title, description });
    expect(contactIntentOptions(language)).toContainEqual({ id: intent, label: title });
  });

  it.each(['general', 'new-product', 'internal-system', 'improve-existing'] as const)(
    'parses the %s intent',
    (intent) => {
      expect(parseContactContext(`?intent=${intent}`)).toEqual({ intent });
    },
  );

  it('accepts a canonical project ID and resolves its public copy', () => {
    const context = parseContactContext('?intent=project&project=online_converter');
    expect(context).toEqual({ intent: 'project', projectId: 'online_converter' });
    expect(getContactContextDetails('en', context).title).toBe('Online Converter');
  });

  it.each([
    '?intent=project&project=not-real',
    '?intent=unknown&project=online_converter',
    '?intent=%E0%A4%A',
    '?project=online_converter',
  ])('falls back safely for invalid query %s', (search) => {
    expect(parseContactContext(search)).toEqual({ intent: 'general' });
    expect(sanitizeContactSearch(search)).toBe('');
  });

  it('builds localized URLs from allowlisted public values only', () => {
    expect(buildContactUrl('en', { intent: 'new-product' })).toBe(
      '/en/contact/?intent=new-product',
    );
    expect(buildContactUrl('he', { intent: 'project', projectId: 'nis_boutique' })).toBe(
      '/he/contact/?intent=project&project=nis_boutique',
    );
  });

  it('does not serialize visitor text or unrelated query values', () => {
    const params = serializeContactContext(parseContactContext(
      '?intent=internal-system&name=Visitor&email=person%40example.com&message=secret',
    ));
    expect(params.toString()).toBe('intent=internal-system');
    expect(params.has('name')).toBe(false);
    expect(params.has('email')).toBe(false);
    expect(params.has('message')).toBe(false);
  });
});
