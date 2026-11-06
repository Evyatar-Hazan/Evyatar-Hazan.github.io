import { describe, expect, it } from 'vitest';

import { getHumanAboutContent } from './content';

describe('human about introduction', () => {
  it('opens with visitor needs and explains the value in English', () => {
    const introduction = getHumanAboutContent('en').introduction;

    expect(introduction).toContain('shaping a new product');
    expect(introduction).toContain('improving an existing flow');
    expect(introduction).toContain('making a system easier to operate');
    expect(introduction).toContain('public evidence to help assess fit');
    expect(introduction).not.toMatch(/I(?:'m| am) Evyatar/i);
  });

  it('keeps the same visitor needs and value in Hebrew', () => {
    const introduction = getHumanAboutContent('he').introduction;

    expect(introduction).toContain('מוצר חדש');
    expect(introduction).toContain('תהליך קיים');
    expect(introduction).toContain('מערכת לקלה יותר לתפעול');
    expect(introduction).toContain('ראיות ציבוריות שעוזרות לבחון התאמה');
    expect(introduction).not.toContain('אני אביתר');
  });
});
