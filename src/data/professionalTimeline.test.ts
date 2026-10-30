import { describe, expect, it } from 'vitest';
import { getProfessionalTimeline, professionalTimeline } from './professionalTimeline';

describe('professional timeline', () => {
  it('keeps one verified progression with period, role, and impact in both languages', () => {
    expect(professionalTimeline).toHaveLength(4);
    expect(new Set(professionalTimeline.map(({ id }) => id)).size).toBe(4);

    professionalTimeline.forEach((entry) => {
      (['en', 'he'] as const).forEach((language) => {
        expect(entry.period[language].trim()).not.toBe('');
        expect(entry.role[language].trim()).not.toBe('');
        expect(entry.impact[language].trim()).not.toBe('');
      });
    });
  });

  it.each(['en', 'he'] as const)('returns localized display copy in %s', (language) => {
    const timeline = getProfessionalTimeline(language);
    expect(timeline.title.trim()).not.toBe('');
    expect(timeline.introduction.trim()).not.toBe('');
    expect(timeline.entries).toHaveLength(4);
  });
});
