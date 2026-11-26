import { describe, expect, it } from 'vitest';
import {
  caseStudyStories,
  caseStudyStoryLabels,
  caseStudyStoryProjectIds,
  getNextCaseStudyProjectId,
  getPreviousCaseStudyProjectId,
} from './caseStudyStories';
import { projects } from './profile';

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
    const decisions = caseStudyStories.emergency_protocol.decisions;
    const nodes = caseStudyStories.emergency_protocol.system.nodes;

    expect(decisions).toHaveLength(3);
    expect(decisions[0].choice.en).toMatch(/learning and practice/i);
    expect(decisions[0].choice.he).toMatch(/למידה ותרגול/u);
    expect(decisions[1].choice.en).toMatch(/permissioned collaboration/i);
    expect(decisions[1].choice.he).toMatch(/שיתוף מבוסס הרשאות/u);
    expect(decisions[2].choice.en).toMatch(/Pages Functions and D1 in production.*Express and Prisma.*local/i);
    expect(decisions[2].choice.he).toMatch(/Pages Functions.*D1 בפרודקשן.*Express.*Prisma.*מקומית/u);
    expect(nodes.find(({ id }) => id === 'functions')).toMatchObject({ boundary: 'production' });
    expect(nodes.find(({ id }) => id === 'd1')).toMatchObject({ boundary: 'production' });
    expect(nodes.find(({ id }) => id === 'local')).toMatchObject({ boundary: 'local' });
    expect(caseStudyStories.emergency_protocol.system.caption.en).toMatch(/learning first.*permissioned collaboration second.*production boundary/i);
    expect(caseStudyStories.emergency_protocol.system.caption.he).toMatch(/קודם למידה.*שיתוף מבוסס הרשאות.*גבול Production/u);
    expect(caseStudyStories.emergency_protocol.system.boundaryNote?.en).toMatch(/Pages Functions and D1.*production.*Express and Prisma.*local-only/i);
    expect(caseStudyStories.emergency_protocol.system.boundaryNote?.he).toMatch(/Pages Functions.*D1.*Production.*Express.*Prisma.*מקומיים בלבד/u);
    expect(caseStudyStories.emergency_protocol.system.boundaryNote?.en).toMatch(/not for use during emergencies/i);
    expect(caseStudyStories.emergency_protocol.system.boundaryNote?.he).toMatch(/אינו מיועד לשימוש בזמן חירום/u);
  });

  it('keeps bilingual labels parallel and avoids fabricated numerical metrics', () => {
    expect(Object.keys(caseStudyStoryLabels.en)).toEqual(Object.keys(caseStudyStoryLabels.he));
    expect([
      caseStudyStoryLabels.en.problem,
      caseStudyStoryLabels.en.decision,
      caseStudyStoryLabels.en.execution,
      caseStudyStoryLabels.en.outcome,
    ]).toEqual(['Problem', 'Decision', 'Execution', 'Outcome']);
    expect([
      caseStudyStoryLabels.he.problem,
      caseStudyStoryLabels.he.decision,
      caseStudyStoryLabels.he.execution,
      caseStudyStoryLabels.he.outcome,
    ]).toEqual(['בעיה', 'החלטה', 'ביצוע', 'תוצאה']);
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

  it('frames the Online Converter decisions as bounded product tradeoffs in both languages', () => {
    const profileDecisions = projects.find(({ id }) => id === 'online_converter')?.caseStudy?.decisions;
    const storyDecisions = caseStudyStories.online_converter.decisions;
    const profileEnglish = profileDecisions?.en.join(' ') ?? '';
    const profileHebrew = profileDecisions?.he.join(' ') ?? '';
    const storyEnglish = storyDecisions.flatMap(({ need, choice, impact }) => [need.en, choice.en, impact.en]).join(' ');
    const storyHebrew = storyDecisions.flatMap(({ need, choice, impact }) => [need.he, choice.he, impact.he]).join(' ');

    expect(profileEnglish).toMatch(/browser-only.+input and output stay on the user's device/i);
    expect(profileEnglish).toMatch(/structured registries.+bilingual content and navigation model/i);
    expect(profileEnglish).toMatch(/release gates.+not traffic or revenue/i);
    expect(profileHebrew).toMatch(/בדפדפן.+קלט ופלט רגישים נשארים במכשיר/u);
    expect(profileHebrew).toMatch(/registries מובנים.+מודל תוכן וניווט דו־לשוני/u);
    expect(profileHebrew).toMatch(/שערי שחרור.+לא מוכיחים טראפיק או הכנסות/u);

    expect(storyEnglish).toMatch(/structured registries.+bilingual content and navigation model/i);
    expect(storyEnglish).toMatch(/privacy boundary.+input and output stay on the user's device/i);
    expect(storyEnglish).toMatch(/release gates.+do not prove traffic, adoption, or revenue/i);
    expect(storyHebrew).toMatch(/registries מובנים.+מודל תוכן וניווט דו־לשוני/u);
    expect(storyHebrew).toMatch(/גבול פרטיות.+קלט ופלט רגישים נשארים במכשיר/u);
    expect(storyHebrew).toMatch(/שערי שחרור.+אינם מוכיחים טראפיק, אימוץ או הכנסות/u);
  });

  it('opens the Online Converter case study with the sensitive-data scenario and browser boundary', () => {
    const onlineConverter = projects.find(({ id }) => id === 'online_converter')?.caseStudy;
    const englishOverview = onlineConverter?.overview.en.join(' ') ?? '';
    const hebrewOverview = onlineConverter?.overview.he.join(' ') ?? '';

    expect(onlineConverter?.overview.en[0]).toMatch(/sensitive data.*runs (?:locally )?in the browser/is);
    expect(onlineConverter?.overview.he[0]).toMatch(/מידע רגיש.*מתבצעת (?:מקומית )?בדפדפן/su);
    expect(englishOverview).toMatch(/bilingual catalog.*discover the right tool/is);
    expect(hebrewOverview).toMatch(/קטלוג דו־לשוני.*למצוא את הכלי המתאים/su);
  });

  it('keeps the FIX-159 Nis decision chain distinct, bilingual, and evidence-bounded', () => {
    const nisProfile = projects.find(({ id }) => id === 'nis_boutique')?.caseStudy;
    const nisStory = caseStudyStories.nis_boutique;

    expect(nisProfile?.decisions.en).toHaveLength(3);
    expect(nisProfile?.decisions.he).toHaveLength(3);
    expect(nisStory.decisions).toHaveLength(3);

    expect(nisProfile?.decisions.en).toEqual([
      expect.stringMatching(/WhatsApp.*inquiry path/i),
      expect.stringMatching(/service framing.*gallery context.*FAQ/i),
      expect.stringMatching(/RTL-first.*desktop and mobile/i),
    ]);
    expect(nisProfile?.decisions.he).toEqual([
      expect.stringMatching(/WhatsApp.*נתיב הפנייה/u),
      expect.stringMatching(/מסגור שירות.*גלריה.*FAQ/u),
      expect.stringMatching(/RTL-first.*דסקטופ ובמובייל/u),
    ]);

    expect(nisStory.decisions.map(({ choice }) => choice.en)).toEqual([
      expect.stringMatching(/WhatsApp.*conversion path/i),
      expect.stringMatching(/service framing.*gallery context.*FAQ/i),
      expect.stringMatching(/RTL-first.*screen sizes/i),
    ]);
    expect(nisStory.decisions.map(({ choice }) => choice.he)).toEqual([
      expect.stringMatching(/WhatsApp.*נתיב ההמרה/u),
      expect.stringMatching(/מסגור שירות.*גלריה.*FAQ/u),
      expect.stringMatching(/RTL-first.*גדלי המסך/u),
    ]);

    expect(nisStory.decisions.map(({ impact }) => impact.en)).toEqual([
      expect.stringMatching(/without claiming a conversion lift/i),
      expect.stringMatching(/without implying an inquiry or sales outcome/i),
      expect.stringMatching(/not presented as a business result/i),
    ]);
    expect(nisStory.decisions.map(({ impact }) => impact.he)).toEqual([
      expect.stringMatching(/בלי לטעון לשיפור בשיעור ההמרה/u),
      expect.stringMatching(/בלי לרמוז על תוצאת פניות או מכירות/u),
      expect.stringMatching(/אינו מוצג כתוצאה עסקית/u),
    ]);
  });

  it('presents Emergency Protocol health evidence as technical runtime evidence only', () => {
    const story = caseStudyStories.emergency_protocol;

    expect(story.limitation.en).toMatch(/HTTP 200.*runtime evidence only.*not evidence of .*clinical.*emergency/is);
    expect(story.limitation.he).toMatch(/HTTP 200.*ראיית runtime בלבד.*לא ראיה.*קלינית.*חירום/su);
    expect(story.technicalNotes.en.join(' ')).toMatch(/HTTP 200.*does not validate.*clinical or emergency outcome/is);
    expect(story.technicalNotes.he.join(' ')).toMatch(/HTTP 200.*אינו מאמת.*תוצאה קלינית.*חירום/su);
  });

  it('cycles deterministically through the four case studies', () => {
    expect(caseStudyStoryProjectIds.map(getNextCaseStudyProjectId)).toEqual([
      'online_converter',
      'emergency_protocol',
      'united_hatzalah',
      'nis_boutique',
    ]);

    expect(caseStudyStoryProjectIds.map(getPreviousCaseStudyProjectId)).toEqual([
      'united_hatzalah',
      'nis_boutique',
      'online_converter',
      'emergency_protocol',
    ]);
  });

  it('states ownership and collaboration boundaries for every published case study', () => {
    const publishedCaseStudies = projects.filter(({ caseStudy }) => Boolean(caseStudy));

    expect(publishedCaseStudies.map(({ id }) => id)).toEqual([...caseStudyStoryProjectIds]);
    publishedCaseStudies.forEach(({ caseStudy }) => {
      expect(caseStudy?.ownership.model.en.trim()).not.toBe('');
      expect(caseStudy?.ownership.model.he.trim()).not.toBe('');
      expect(caseStudy?.ownership.collaboration.en.trim()).not.toBe('');
      expect(caseStudy?.ownership.collaboration.he.trim()).not.toBe('');
    });
  });

  it('keeps United Hatzalah decisions in personal technical voice without claiming branch work', () => {
    const caseStudy = projects.find(({ id }) => id === 'united_hatzalah')?.caseStudy;
    const story = caseStudyStories.united_hatzalah;

    expect(caseStudy?.ownership.model.en).toMatch(/software implementation/i);
    expect(caseStudy?.ownership.collaboration.en).toMatch(/stakeholders supplied/i);
    expect(caseStudy?.ownership.collaboration.en).toMatch(/do not claim/i);
    expect(caseStudy?.decisions.en.every((decision) => decision.startsWith('I '))).toBe(true);
    expect(caseStudy?.decisions.he).toEqual(expect.arrayContaining([
      expect.stringMatching(/^מימשתי/u),
      expect.stringMatching(/^בניתי/u),
      expect.stringMatching(/^התייחסתי/u),
    ]));
    expect(story.decisions.every(({ choice }) => choice.en.startsWith('I '))).toBe(true);
    expect(story.decisions.map(({ choice }) => choice.he)).toEqual([
      expect.stringMatching(/^חיברתי/u),
      expect.stringMatching(/^השתמשתי/u),
      expect.stringMatching(/^הפרדתי/u),
    ]);
    expect(JSON.stringify({ caseStudy, story })).not.toMatch(/\bwe\b|בנינו|עבודתנו/iu);
  });
});
