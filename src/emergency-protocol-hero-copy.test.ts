import { describe, expect, it } from 'vitest';
import { getProjectById } from './data/profile';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-153 Emergency Protocol hero and SEO safety copy', () => {
  const caseStudy = getProjectById('emergency_protocol')?.caseStudy;

  it('labels the hero as learning and practice only in both languages', () => {
    expect(en.projects.items.emergency_protocol.title).toContain('Learning and Practice Only');
    expect(he.projects.items.emergency_protocol.title).toContain('ללמידה ולתרגול בלבד');
    expect(en.projects.items.emergency_protocol.description).toMatch(/learning-and-practice.*only/i);
    expect(he.projects.items.emergency_protocol.description).toMatch(/למידה ותרגול.*בלבד/u);
    expect(caseStudy?.eyebrow.en).toBe('Learning and practice only');
    expect(caseStudy?.eyebrow.he).toBe('למידה ותרגול בלבד');
  });

  it('keeps learning-only scope and emergency boundaries in audience and SEO copy', () => {
    expect(caseStudy?.audience.en).toMatch(/learning and practice only.*not emergency use/i);
    expect(caseStudy?.audience.he).toMatch(/ללמידה ולתרגול בלבד.*לא לשימוש בזמן חירום/u);
    expect(caseStudy?.seoTitle.en).toContain('Learning and Practice Only');
    expect(caseStudy?.seoTitle.he).toContain('למידה ותרגול בלבד');
    expect(caseStudy?.seoDescription.en).toMatch(
      /learning and practice only.*not for use during emergencies.*no medical validation/i,
    );
    expect(caseStudy?.seoDescription.he).toMatch(
      /ללמידה ולתרגול בלבד.*לא לשימוש בזמן חירום.*ללא טענה לאימות רפואי/u,
    );
  });
});
