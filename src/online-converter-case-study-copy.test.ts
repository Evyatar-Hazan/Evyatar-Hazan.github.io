import { describe, expect, it } from 'vitest';
import { projects } from './data/profile';

describe('Online Converter case study positioning', () => {
  it('leads with local processing and the verified bilingual catalog scope', () => {
    const caseStudy = projects.find(({ id }) => id === 'online_converter')?.caseStudy;

    expect(caseStudy).toBeDefined();

    const seoCopy = `${caseStudy?.seoDescription.en} ${caseStudy?.seoDescription.he}`;
    const heroCopy = `${caseStudy?.overview.en[0]} ${caseStudy?.overview.he[0]}`;

    expect(seoCopy).toMatch(/local processing/i);
    expect(seoCopy).toContain('עיבוד מקומי');
    expect(`${seoCopy} ${heroCopy}`).toMatch(/140/u);
    expect(heroCopy).toMatch(/16/u);
    expect(heroCopy).toMatch(/English and Hebrew/i);
    expect(heroCopy).toContain('עברית ובאנגלית');
    expect(heroCopy).toMatch(/locally in the browser/i);
    expect(heroCopy).toContain('מקומית בדפדפן');
  });

  it('does not frame the verified scope as growth or business performance', () => {
    const caseStudy = projects.find(({ id }) => id === 'online_converter')?.caseStudy;
    const copy = [
      caseStudy?.seoDescription.en,
      caseStudy?.seoDescription.he,
      caseStudy?.overview.en[0],
      caseStudy?.overview.he[0],
    ].join(' ');

    expect(copy).not.toMatch(/\b(?:growth|traffic|revenue)\b|צמיחה|טראפיק|הכנסות/iu);
  });
});
