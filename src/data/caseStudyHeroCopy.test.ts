import { describe, expect, it } from 'vitest';
import { getProjectById } from './profile';

describe('United Hatzalah case-study hero copy', () => {
  const caseStudy = getProjectById('united_hatzalah')?.caseStudy;

  it('explains the public site and branch editing workflow in both languages', () => {
    expect(caseStudy).toBeDefined();
    expect(caseStudy?.eyebrow.en).toBe('Public site and branch-managed content');
    expect(caseStudy?.eyebrow.he).toBe('אתר ציבורי ותוכן בניהול עצמאי של הסניף');
    expect(caseStudy?.audience.en).toContain('admin path for routine content and media updates');
    expect(caseStudy?.audience.he).toContain('נתיב ניהול לעדכוני תוכן ומדיה שוטפים');
  });

  it('keeps the measurement boundary explicit in SEO copy', () => {
    expect(caseStudy?.seoDescription.en).toContain('no measured time-saving claim');
    expect(caseStudy?.seoDescription.he).toContain('ללא טענה לחיסכון בזמן שנמדד');
  });

  it('opens with a typical content update, its bottleneck, and the system goal', () => {
    expect(caseStudy?.overview.en[0]).toContain('publish a new activity update or replace a photo');
    expect(caseStudy?.overview.en[0]).toContain('developer task');
    expect(caseStudy?.overview.en[1]).toContain('remove that bottleneck');
    expect(caseStudy?.overview.en[1]).toContain('without editing code');

    expect(caseStudy?.overview.he[0]).toContain('לפרסם עדכון על פעילות או להחליף תמונה');
    expect(caseStudy?.overview.he[0]).toContain('משימת פיתוח');
    expect(caseStudy?.overview.he[1]).toContain('להסיר את צוואר הבקבוק');
    expect(caseStudy?.overview.he[1]).toContain('בלי לערוך קוד');
  });

  it('does not invent cadence, duration, or time savings in the opening', () => {
    const opening = [...(caseStudy?.overview.en ?? []), ...(caseStudy?.overview.he ?? [])].join(' ');

    expect(opening).not.toMatch(/\d/);
    expect(opening).not.toMatch(/\b(?:daily|weekly|monthly|minutes?|hours?|days?|time savings?)\b/i);
    expect(opening).not.toMatch(/(?:בכל יום|יומי|שבועי|חודשי|דקות|שעות|ימים|חיסכון בזמן)/);
  });
});
