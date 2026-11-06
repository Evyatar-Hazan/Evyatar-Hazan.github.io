import { describe, expect, it } from 'vitest';

import { getHumanAboutContent } from './content';

const backgroundBody = (language: 'en' | 'he') => {
  const background = getHumanAboutContent(language).pillars.find((pillar) => pillar.id === 'background');

  expect(background?.sourceId).toBe('verifiedProfessionalBackground');
  return background?.body ?? '';
};

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

describe('professional background copy', () => {
  it('connects interface, system, and verification decisions in English', () => {
    const body = backgroundBody('en');

    expect(body).toContain('connect decisions');
    expect(body).toContain('interface choice');
    expect(body).toContain('system that supports it');
    expect(body).toContain('evidence used to verify it');
    expect(body).toContain('evidence gaps');
  });

  it('keeps the same decision path and evidence boundary in Hebrew', () => {
    const body = backgroundBody('he');

    expect(body).toContain('מחברות החלטות');
    expect(body).toContain('בחירת ממשק');
    expect(body).toContain('המערכת שתומכת בה');
    expect(body).toContain('הראיות שמשמשות לאימותה');
    expect(body).toContain('פערי ראיות');
  });
});
