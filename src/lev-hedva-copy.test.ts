import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-147 Lev Hedva visitor-focused copy', () => {
  it('leads with the nonprofit need in both languages', () => {
    expect(en.projects.items.lev_chedva.summary).toBe(
      'A nonprofit needs a clear public presence today and room for its digital services to grow without every change becoming harder to manage.',
    );
    expect(he.projects.items.lev_chedva.summary).toBe(
      'עמותה צריכה נוכחות ציבורית ברורה היום ומרחב להרחיב שירותים דיגיטליים בלי שכל שינוי יהפוך למורכב יותר.',
    );

    expect(en.projects.items.lev_chedva.summary).not.toMatch(/monorepo|api/i);
    expect(he.projects.items.lev_chedva.summary).not.toMatch(/מונוריפו|API/i);
  });

  it('presents the technical structure as a means without claiming adoption', () => {
    expect(en.projects.items.lev_chedva.solution).toContain(
      "so each can evolve around the organization's needs",
    );
    expect(he.projects.items.lev_chedva.solution).toContain(
      'כדי שכל חלק יוכל להתפתח לפי צורכי הארגון',
    );

    expect(en.projects.items.lev_chedva.impact).not.toMatch(/adopted|in use|users/i);
    expect(he.projects.items.lev_chedva.impact).not.toMatch(/אומץ|בשימוש|משתמשים/);
  });
});
