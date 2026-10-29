import { describe, expect, it } from 'vitest';
import {
  caseStudyStories,
  caseStudyStoryLabels,
  caseStudyStoryProjectIds,
  getNextCaseStudyProjectId,
} from './caseStudyStories';

describe('case study product story contract', () => {
  it('covers all four requested projects with decisions and a system view', () => {
    expect(Object.keys(caseStudyStories)).toEqual([...caseStudyStoryProjectIds]);

    caseStudyStoryProjectIds.forEach((projectId) => {
      const story = caseStudyStories[projectId];
      expect(story.decisions.length).toBeGreaterThanOrEqual(2);
      expect(story.decisions.length).toBeLessThanOrEqual(4);
      expect(story.system.nodes.length).toBeGreaterThanOrEqual(3);
      expect(story.limitation.en.trim()).not.toBe('');
      expect(story.limitation.he.trim()).not.toBe('');
      story.decisions.forEach((decision) => {
        expect(decision.need.en.trim()).not.toBe('');
        expect(decision.need.he.trim()).not.toBe('');
        expect(decision.choice.en.trim()).not.toBe('');
        expect(decision.choice.he.trim()).not.toBe('');
        expect(decision.impact.en.trim()).not.toBe('');
        expect(decision.impact.he.trim()).not.toBe('');
      });
    });
  });

  it('keeps the Emergency Protocol production and local boundaries explicit', () => {
    const nodes = caseStudyStories.emergency_protocol.system.nodes;

    expect(nodes.find(({ id }) => id === 'functions')).toMatchObject({ boundary: 'production' });
    expect(nodes.find(({ id }) => id === 'd1')).toMatchObject({ boundary: 'production' });
    expect(nodes.find(({ id }) => id === 'local')).toMatchObject({ boundary: 'local' });
    expect(caseStudyStories.emergency_protocol.system.boundaryNote?.en).toMatch(/not for use during emergencies/i);
    expect(caseStudyStories.emergency_protocol.system.boundaryNote?.he).toMatch(/אינו מיועד לשימוש בזמן חירום/u);
  });

  it('keeps bilingual labels parallel and avoids fabricated numerical metrics', () => {
    expect(Object.keys(caseStudyStoryLabels.en)).toEqual(Object.keys(caseStudyStoryLabels.he));
    const serialized = JSON.stringify(caseStudyStories);
    expect(serialized).not.toMatch(/\b\d+(?:\.\d+)?%\b/u);
    expect(serialized).not.toMatch(/\b\d+x (?:faster|growth|conversion)\b/iu);
  });

  it('keeps every executive summary limitation explicit and evidence-bounded', () => {
    expect(caseStudyStories.nis_boutique.limitation.en).toMatch(/does not currently include/i);
    expect(caseStudyStories.online_converter.limitation.en).toMatch(/do not prove/i);
    expect(caseStudyStories.emergency_protocol.limitation.en).toMatch(/not an emergency tool/i);
    expect(caseStudyStories.united_hatzalah.limitation.en).toMatch(/no .* metric is claimed/i);
  });

  it('cycles deterministically through the four case studies', () => {
    expect(caseStudyStoryProjectIds.map(getNextCaseStudyProjectId)).toEqual([
      'online_converter',
      'emergency_protocol',
      'united_hatzalah',
      'nis_boutique',
    ]);
  });
});
