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

  it('invites owners of existing systems to a concrete fit conversation in both languages', () => {
    expect(en.projectsHub.contactPrompt).toContain('existing system');
    expect(en.projectsHub.contactPrompt).toContain("we'll map the need");
    expect(en.projectsHub.contactPrompt).toContain('relevant');
    expect(en.projectsHub.contactCta).toBe('Tell me about your system');

    expect(he.projectsHub.contactPrompt).toContain('מערכת קיימת');
    expect(he.projectsHub.contactPrompt).toContain('נמפה את הצורך');
    expect(he.projectsHub.contactPrompt).toContain('רלוונטי');
    expect(he.projectsHub.contactCta).toBe('ספרו לי על המערכת');
  });

  it('explains each lifecycle status plainly without overstating current availability', () => {
    expect(en.projectsHub.lifecycle).toEqual({
      active: 'Live when checked',
      maintained: 'Maintenance documented',
      archived: 'Moved to archive',
      historical: 'Past project',
      undocumented: 'Status not verified',
    });
    expect(he.projectsHub.lifecycle).toEqual({
      active: 'היה חי בבדיקה',
      maintained: 'תחזוקה תועדה',
      archived: 'הועבר לארכיון',
      historical: 'פרויקט עבר',
      undocumented: 'המצב לא אומת',
    });

    expect(en.projectsHub.lifecycleNote.active).toContain('does not guarantee it is online now');
    expect(en.projectsHub.lifecycleNote.maintained).toContain('were not verified');
    expect(en.projectsHub.lifecycleNote.archived).toContain('No current live version was verified');
    expect(en.projectsHub.lifecycleNote.historical).toContain('No current live version was verified');
    expect(en.projectsHub.lifecycleNote.undocumented).toContain('No reliable source was found');

    expect(he.projectsHub.lifecycleNote.active).toContain('אין בכך הבטחה שהוא זמין עכשיו');
    expect(he.projectsHub.lifecycleNote.maintained).toContain('לא אומתו');
    expect(he.projectsHub.lifecycleNote.archived).toContain('לא אומתה גרסה חיה נוכחית');
    expect(he.projectsHub.lifecycleNote.historical).toContain('לא אומתה גרסה חיה נוכחית');
    expect(he.projectsHub.lifecycleNote.undocumented).toContain('לא נמצא מקור מהימן');
  });

  it('names the public asset visitors can open without presenting missing evidence as a failure', () => {
    expect(en.projectsHub).toMatchObject({
      caseStudyAvailable: 'Case study page',
      liveProductAvailable: 'Live product link',
      publicCodeAvailable: 'Public source-code link',
      evidenceStatus: 'Public evidence you can open',
      evidenceVerified: 'Public evidence links available',
      evidenceUndocumented: 'No public evidence link documented yet',
      yes: 'Available to open',
      no: 'No public link available',
    });
    expect(en.projectsHub.evidenceUndocumented).not.toMatch(/failed|error/i);

    expect(he.projectsHub).toMatchObject({
      caseStudyAvailable: 'עמוד קייס סטאדי',
      liveProductAvailable: 'קישור למוצר חי',
      publicCodeAvailable: 'קישור לקוד ציבורי',
      evidenceStatus: 'ראיה ציבורית שניתן לפתוח',
      evidenceVerified: 'קישורי ראיה ציבוריים זמינים',
      evidenceUndocumented: 'עדיין לא תועד קישור לראיה ציבורית',
      yes: 'זמין לפתיחה',
      no: 'אין קישור ציבורי זמין',
    });
    expect(he.projectsHub.evidenceUndocumented).not.toMatch(/כשל|שגיאה/);
  });
});
