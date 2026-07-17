import type { LocalizedText } from './profile';

export type PortfolioLanguage = 'en' | 'he';

export type PortfolioCapabilityGroup = {
  id: 'webMobile' | 'languages' | 'aiCv' | 'devops' | 'databases' | 'automation' | 'methodologies';
  label: LocalizedText;
  description: LocalizedText;
  skills: readonly string[];
};

/**
 * The canonical, UI-agnostic capability inventory shared by portfolio surfaces.
 * It preserves the factual stack already presented by the legacy About section,
 * while giving Experience V2 localized group context without copying UI markup.
 */
export const portfolioCapabilityGroups: readonly PortfolioCapabilityGroup[] = [
  {
    id: 'webMobile',
    label: { en: 'Web & mobile products', he: 'מוצרי Web ומובייל' },
    description: {
      en: 'Product interfaces, full-stack systems, and reusable application foundations.',
      he: 'ממשקי מוצר, מערכות Full Stack ותשתיות אפליקטיביות לשימוש חוזר.',
    },
    skills: [
      'React Native',
      'React',
      'Next.js',
      'Vite',
      'Node.js',
      'NestJS',
      'Express',
      'Redux',
      'REST APIs',
      'Google OAuth',
    ],
  },
  {
    id: 'languages',
    label: { en: 'Languages', he: 'שפות פיתוח' },
    description: {
      en: 'The languages I use across product, backend, automation, and systems work.',
      he: 'השפות שבהן אני משתמש בעבודת מוצר, Backend, אוטומציה ומערכות.',
    },
    skills: ['TypeScript', 'JavaScript', 'Java', 'Python'],
  },
  {
    id: 'aiCv',
    label: { en: 'AI & computer vision', he: 'AI וראייה ממוחשבת' },
    description: {
      en: 'Applied vision pipelines and models prepared for practical product environments.',
      he: 'תהליכי ראייה ממוחשבת ומודלים המותאמים לסביבות מוצר מעשיות.',
    },
    skills: ['YOLOv5', 'ONNX', 'TFLite', 'Image Processing & Mapping'],
  },
  {
    id: 'devops',
    label: { en: 'Delivery & infrastructure', he: 'תשתיות ו-Delivery' },
    description: {
      en: 'Repeatable delivery, deployment, and operating foundations for reliable products.',
      he: 'תהליכי מסירה, פריסה ותפעול שחוזרים על עצמם ותומכים במוצרים אמינים.',
    },
    skills: ['AWS', 'Docker', 'Linux', 'Jenkins CI/CD', 'CI', 'Vercel', 'Render', 'Git'],
  },
  {
    id: 'databases',
    label: { en: 'Data', he: 'נתונים' },
    description: {
      en: 'Relational data modeling and the tools needed to inspect and maintain it.',
      he: 'מידול נתונים רלציוני והכלים הדרושים לבדיקה ולתחזוקה שלו.',
    },
    skills: ['PostgreSQL', 'SQL', 'Prisma', 'PgAdmin', 'Cloudinary'],
  },
  {
    id: 'automation',
    label: { en: 'Quality automation', he: 'אוטומציית איכות' },
    description: {
      en: 'Cross-platform automation and evidence that protects real user journeys.',
      he: 'אוטומציה חוצת פלטפורמות וראיות שמגנות על מסעות משתמש אמיתיים.',
    },
    skills: ['Appium', 'Selenium', 'Perfecto', 'XCUITest', 'Allure'],
  },
  {
    id: 'methodologies',
    label: { en: 'Product practice & leadership', he: 'פרקטיקת מוצר והובלה' },
    description: {
      en: 'Technical leadership that connects development, product, and quality decisions.',
      he: 'הובלה טכנית שמחברת בין החלטות פיתוח, מוצר ואיכות.',
    },
    skills: [
      'Technical Mentoring',
      'Development Leadership',
      'Product/QA Collaboration',
      'SEO',
      'i18n',
      'RTL',
      'Privacy-first',
      'Monorepo',
      'Jira',
    ],
  },
] as const;

export const getPortfolioCapabilityGroups = (language: PortfolioLanguage) =>
  portfolioCapabilityGroups.map((group) => ({
    id: group.id,
    label: group.label[language],
    description: group.description[language],
    skills: group.skills,
  }));
