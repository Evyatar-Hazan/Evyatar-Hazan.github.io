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
});
