import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('projects hub visitor-focused copy', () => {
  it('explains what visitors can learn, compare, and decide in both languages', () => {
    expect(en.projectsHub.introduction).toContain('See the need each project set out to address');
    expect(en.projectsHub.introduction).toContain('Compare projects to decide where to go deeper');
    expect(en.projectsHub.seoDescription).toContain('public evidence available for comparison');

    expect(he.projectsHub.introduction).toContain('איזה צורך כל פרויקט נועד לתת לו מענה');
    expect(he.projectsHub.introduction).toContain('השוו בין הפרויקטים כדי לבחור במה להעמיק');
    expect(he.projectsHub.seoDescription).toContain('הראיות הציבוריות הזמינות להשוואה');
  });

  it('does not describe the page as an internal work dossier', () => {
    expect(en.projectsHub.introduction).not.toMatch(/work(?:ing)? dossier/i);
    expect(en.projectsHub.seoDescription).not.toMatch(/work(?:ing)? dossier/i);
    expect(he.projectsHub.introduction).not.toContain('תיק עבודה');
    expect(he.projectsHub.seoDescription).not.toContain('תיק עבודות');
  });
});
