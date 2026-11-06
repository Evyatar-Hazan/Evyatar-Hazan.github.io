import { describe, expect, it } from 'vitest';
import { getStaticRouteSeo } from './data/routeSeo';
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

    expect(getStaticRouteSeo('projects', 'en').description).toBe(en.projectsHub.seoDescription);
    expect(getStaticRouteSeo('projects', 'he').description).toBe(he.projectsHub.seoDescription);
  });

  it('does not describe the page as an internal work dossier', () => {
    expect(en.projectsHub.introduction).not.toMatch(/work(?:ing)? dossier/i);
    expect(en.projectsHub.seoDescription).not.toMatch(/work(?:ing)? dossier/i);
    expect(he.projectsHub.introduction).not.toContain('תיק עבודה');
    expect(he.projectsHub.seoDescription).not.toContain('תיק עבודות');
  });

  it('frames the selected projects around problem, choice, and outcome', () => {
    expect(en.projectsHub.featuredEyebrow).toBe('Selected projects / 04');
    expect(en.projectsHub.featuredTitle).toBe('Four projects, from problem to choice to outcome.');

    expect(he.projectsHub.featuredEyebrow).toBe('פרויקטים נבחרים / 04');
    expect(he.projectsHub.featuredTitle).toBe('ארבעה פרויקטים — מהבעיה, דרך הבחירה ועד לתוצאה.');
  });

  it('turns every comparison state into a visitor decision step in both languages', () => {
    expect(en.projectsHub.compareEyebrow).toBe('Choose where to go deeper');
    expect(en.projectsHub.compareTitle).toBe('Compare the problem, contribution, and evidence');
    expect(en.projectsHub.compareEmpty).toContain('Choose two or three projects');
    expect(en.projectsHub.compareOne).toContain('Choose one more project');
    expect(en.projectsHub.compareReady).toContain('open the project that best matches your need');

    expect(he.projectsHub.compareEyebrow).toBe('בחרו במה להעמיק');
    expect(he.projectsHub.compareTitle).toBe('השוו בין הבעיה, התרומה והראיות');
    expect(he.projectsHub.compareEmpty).toContain('בחרו שניים או שלושה פרויקטים');
    expect(he.projectsHub.compareOne).toContain('בחרו פרויקט נוסף');
    expect(he.projectsHub.compareReady).toContain('פתחו את הפרויקט שמתאים ביותר לצורך שלכם');

    expect(en.projectsHub.compareEmpty).not.toMatch(/dossier|archive|surface/i);
    expect(he.projectsHub.compareEmpty).not.toMatch(/תיקי עבודה|ארכיון|משטח/);
  });
});
