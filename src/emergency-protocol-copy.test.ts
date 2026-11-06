import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import he from './locales/he.json';

describe('FIX-146 Emergency Protocol card safety copy', () => {
  it('leads with learning and practice only in both languages', () => {
    expect(en.projects.items.emergency_protocol.description).toMatch(
      /^A learning-and-practice experience for exploring a BLS pathway only\./,
    );
    expect(he.projects.items.emergency_protocol.description).toMatch(
      /^חוויית למידה ותרגול להיכרות עם מסלול BLS בלבד\./u,
    );
  });

  it('keeps emergency and medical boundaries explicit', () => {
    expect(en.projects.items.emergency_protocol.description).toMatch(
      /not for use during emergencies.*no claim of medical validation/i,
    );
    expect(he.projects.items.emergency_protocol.description).toMatch(
      /אינה מיועדת לשימוש בזמן חירום.*אינה טוענת לאימות רפואי/u,
    );
  });

  it('presents the architecture as engineering evidence, not a medical outcome', () => {
    expect(en.projects.items.emergency_protocol.impact).toMatch(
      /engineering evidence, not a medical outcome/i,
    );
    expect(he.projects.items.emergency_protocol.impact).toMatch(
      /ראיה הנדסית, לא תוצאה רפואית/u,
    );
  });
});
