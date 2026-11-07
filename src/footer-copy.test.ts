import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-131 footer conversation brief', () => {
  it('guides visitors to share the blocked work, affected people, and useful outcome', () => {
    expect(en.footer.title).toBe(
      'Share what’s blocked, who it affects, and what a useful outcome looks like.',
    );
    expect(he.footer.title).toBe(
      'שתפו מה מעוכב, על מי זה משפיע ואיך נראית תוצאה שימושית.',
    );
  });

  it('adds a distinct next step instead of repeating the audience-entry question', () => {
    expect(en.footer.title).not.toBe('What do you need to move forward?');
    expect(he.footer.title).not.toBe('מה צריך להתקדם?');
  });
});
