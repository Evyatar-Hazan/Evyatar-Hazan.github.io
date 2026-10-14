import { describe, expect, it } from 'vitest';
import {
  buildContactUrl,
  getContactContextDetails,
  parseContactContext,
  sanitizeContactSearch,
  serializeContactContext,
} from './contactIntent';

describe('contact intent model', () => {
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
