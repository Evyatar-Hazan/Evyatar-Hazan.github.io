import type { LocalizedText } from './profile';

export type ProfessionalTimelineEntry = {
  id: 'foundations' | 'productEngineering' | 'qualityEngineering' | 'technicalLeadership';
  period: LocalizedText;
  role: LocalizedText;
  impact: LocalizedText;
};

const timelineCopy = {
  en: {
    eyebrow: 'Experience progression',
    title: 'Each stage expanded the system I could own.',
    introduction: 'A focused timeline of verified experience—period, role, and the practical impact carried into the next stage.',
  },
  he: {
    eyebrow: 'התקדמות מקצועית',
    title: 'כל שלב הרחיב את המערכת שיכולתי לקחת עליה אחריות.',
    introduction: 'ציר זמן ממוקד של ניסיון מאומת — תקופה, תפקיד וההשפעה המעשית שעברה לשלב הבא.',
  },
} as const;

export const professionalTimeline = [
  {
    id: 'foundations',
    period: { en: '2020–2022', he: '2020–2022' },
    role: { en: 'Software engineering foundations', he: 'יסודות הנדסת תוכנה' },
    impact: {
      en: 'Built a practical base in computer science, algorithms, web systems, databases, operating systems, and networks.',
      he: 'בניית בסיס מעשי במדעי המחשב, אלגוריתמים, מערכות Web, מסדי נתונים, מערכות הפעלה ורשתות.',
    },
  },
  {
    id: 'productEngineering',
    period: { en: '2023–2024', he: '2023–2024' },
    role: { en: 'React Native & Full-Stack development', he: 'פיתוח React Native ו־Full-Stack' },
    impact: {
      en: 'Connected mobile architecture, backend integrations, routing logic, and containerized cloud environments into one product workflow.',
      he: 'חיבור ארכיטקטורת מובייל, אינטגרציות Backend, לוגיקת מסלולים וסביבות ענן מבוססות קונטיינרים לתהליך מוצר אחד.',
    },
  },
  {
    id: 'qualityEngineering',
    period: { en: '2024–2026', he: '2024–2026' },
    role: { en: 'Frontend & cross-platform automation', he: 'Frontend ואוטומציה חוצת פלטפורמות' },
    impact: {
      en: 'Extended delivery across iOS, Android, and Web with CI/CD, accessibility, test-data infrastructure, and computer-vision-assisted UI testing.',
      he: 'הרחבת המסירה ל־iOS, Android ו־Web בעזרת CI/CD, נגישות, תשתיות נתוני בדיקה ובדיקות UI בסיוע ראייה ממוחשבת.',
    },
  },
  {
    id: 'technicalLeadership',
    period: { en: 'From Apr 2026', he: 'מאפריל 2026' },
    role: { en: 'End-to-end delivery & technical leadership', he: 'מסירה מקצה לקצה והובלה טכנית' },
    impact: {
      en: 'Took broader ownership of business systems—from product framing and full-stack implementation through deployment, verification, and maintainable handoff.',
      he: 'הרחבת האחריות על מערכות עסקיות — מהגדרת המוצר ומימוש Full-Stack ועד פריסה, אימות ומסירה שניתנת לתחזוקה.',
    },
  },
] as const satisfies readonly ProfessionalTimelineEntry[];

export const getProfessionalTimeline = (language: 'en' | 'he') => ({
  ...timelineCopy[language],
  entries: professionalTimeline.map((entry) => ({
    id: entry.id,
    period: entry.period[language],
    role: entry.role[language],
    impact: entry.impact[language],
  })),
});
