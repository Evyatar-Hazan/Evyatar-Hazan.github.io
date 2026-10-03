import type {
  PortfolioContentRef,
  PortfolioRouteTarget,
} from '../contracts/portfolio';
import type { LocalizedText } from './profile';

type WorkingPrincipleRef = Extract<
  PortfolioContentRef,
  { kind: 'project' | 'article' }
>;

export type WorkingPrincipleEvidence = {
  copy: LocalizedText;
  linkLabel: LocalizedText;
  ref: WorkingPrincipleRef;
};

export type WorkingPrinciple = {
  id: 'clear-path' | 'operational-ownership' | 'privacy-boundaries' | 'evidence-boundaries';
  title: LocalizedText;
  position: LocalizedText;
  example: WorkingPrincipleEvidence;
  exception: WorkingPrincipleEvidence;
};

export const workingPrinciplesCopy = {
  eyebrow: {
    en: 'Decision record / 04',
    he: 'יומן החלטות / 04',
  },
  title: {
    en: 'Working principles, visible in the work.',
    he: 'עקרונות עבודה שאפשר לראות בפרויקטים.',
  },
  introduction: {
    en: 'These are recurring product choices documented across the published projects and writing—not universal rules or claims about every situation.',
    he: 'אלה בחירות מוצר שחוזרות בפרויקטים ובכתיבה שפורסמו — לא כללים מוחלטים ולא טענות שמתאימות לכל מצב.',
  },
  exampleLabel: {
    en: 'Seen in practice',
    he: 'בפועל',
  },
  exceptionLabel: {
    en: 'Where the rule bends',
    he: 'מתי הכלל משתנה',
  },
} as const;

export const workingPrinciples = [
  {
    id: 'clear-path',
    title: {
      en: 'Make the primary action obvious.',
      he: 'להפוך את הפעולה המרכזית לברורה.',
    },
    position: {
      en: 'When a product has one decisive next step, the interface is organized around that step instead of accumulating feature and content clutter.',
      he: 'כשיש למוצר צעד הבא מרכזי, הממשק מתארגן סביבו במקום לצבור עומס של פיצ׳רים ותוכן.',
    },
    example: {
      copy: {
        en: 'Nis Boutique makes WhatsApp the main inquiry path, then uses hierarchy, real media, and practical answers to support it.',
        he: 'Nis Boutique מציב את WhatsApp כנתיב הפנייה הראשי, ואז משתמש בהיררכיה, מדיה אמיתית ותשובות מעשיות כדי לתמוך בו.',
      },
      linkLabel: {
        en: 'See the Nis Boutique case study',
        he: 'לקייס סטאדי של Nis Boutique',
      },
      ref: { kind: 'project', id: 'nis_boutique' },
    },
    exception: {
      copy: {
        en: 'A discovery product can need many useful entry points. Online Converter uses a typed registry to keep that breadth structured rather than forcing one route.',
        he: 'מוצר גילוי יכול להזדקק להרבה נקודות כניסה שימושיות. Online Converter משתמש ב־registry טיפוסי כדי לארגן את הרוחב הזה במקום לכפות נתיב יחיד.',
      },
      linkLabel: {
        en: 'See the Online Converter case study',
        he: 'לקייס סטאדי של Online Converter',
      },
      ref: { kind: 'project', id: 'online_converter' },
    },
  },
  {
    id: 'operational-ownership',
    title: {
      en: 'Let routine work move without code changes.',
      he: 'לאפשר לעבודה שוטפת להתקדם בלי שינויי קוד.',
    },
    position: {
      en: 'Content and operational workflows are designed so ordinary updates can move through the product instead of becoming developer tickets.',
      he: 'זרימות תוכן ותפעול נבנות כך שעדכונים רגילים יעברו דרך המוצר במקום להפוך למשימות פיתוח.',
    },
    example: {
      copy: {
        en: 'The United Hatzalah branch project combines a public site with an admin workflow for content, media, and operational data.',
        he: 'פרויקט סניף איחוד הצלה משלב אתר ציבורי עם זרימת ניהול לתוכן, מדיה ונתונים תפעוליים.',
      },
      linkLabel: {
        en: 'See the United Hatzalah case study',
        he: 'לקייס סטאדי של איחוד הצלה',
      },
      ref: { kind: 'project', id: 'united_hatzalah' },
    },
    exception: {
      copy: {
        en: 'Editing freedom does not mean instant browser-to-production publishing. The Nis workflow keeps validation, rollback, and release boundaries in place.',
        he: 'חופש עריכה אינו פרסום מיידי מהדפדפן לפרודקשן. הזרימה של Nis משאירה אימות, rollback וגבולות פרסום במקום.',
      },
      linkLabel: {
        en: 'See the controlled publishing workflow',
        he: 'לזרימת הפרסום המבוקרת',
      },
      ref: { kind: 'project', id: 'nis_boutique' },
    },
  },
  {
    id: 'privacy-boundaries',
    title: {
      en: 'Collect the signal, not the private content.',
      he: 'לאסוף את האות, לא את התוכן הפרטי.',
    },
    position: {
      en: 'Data collection is narrowed to the product question being answered, while private inputs stay outside the measurement layer.',
      he: 'איסוף הנתונים מצטמצם לשאלת המוצר שצריך לענות עליה, בזמן שקלט פרטי נשאר מחוץ לשכבת המדידה.',
    },
    example: {
      copy: {
        en: 'Online Converter measures useful actions such as opening or converting, while keeping the user\'s input and output out of analytics.',
        he: 'Online Converter מודד פעולות שימושיות כמו פתיחה או המרה, בלי להעביר לאנליטיקה את הקלט או הפלט של המשתמש.',
      },
      linkLabel: {
        en: 'Read the privacy-safe analytics note',
        he: 'לרשומה על אנליטיקה שומרת פרטיות',
      },
      ref: { kind: 'article', id: 'privacy-safe-product-analytics' },
    },
    exception: {
      copy: {
        en: 'Collaboration can require server-side state. The Emergency Protocol learning product uses Functions and D1 for authentication and comments instead of pretending every workflow can remain local.',
        he: 'שיתוף פעולה יכול לדרוש מצב בצד השרת. מוצר הלמידה של Emergency Protocol משתמש ב־Functions וב־D1 לאימות ולתגובות, במקום להעמיד פנים שכל זרימה יכולה להישאר מקומית.',
      },
      linkLabel: {
        en: 'See the Emergency Protocol case study',
        he: 'לקייס סטאדי של Emergency Protocol',
      },
      ref: { kind: 'project', id: 'emergency_protocol' },
    },
  },
  {
    id: 'evidence-boundaries',
    title: {
      en: 'Name exactly what the evidence proves.',
      he: 'להגדיר בדיוק מה הראיה מוכיחה.',
    },
    position: {
      en: 'Builds, tests, deployments, and live checks are treated as different evidence. A result is described at the level where it was actually verified.',
      he: 'Build, בדיקות, פריסה ובדיקות חיות נחשבים לראיות שונות. תוצאה מתוארת רק ברמה שבה היא באמת אומתה.',
    },
    example: {
      copy: {
        en: 'The deployment note treats a working public URL, refresh-safe routes, and verification after release as part of product delivery.',
        he: 'הרשומה על פריסה מתייחסת לכתובת ציבורית עובדת, לנתיבים ששורדים רענון ולאימות לאחר פרסום כחלק ממסירת המוצר.',
      },
      linkLabel: {
        en: 'Read why deployment is product work',
        he: 'לרשומה על פריסה כחלק מהמוצר',
      },
      ref: { kind: 'article', id: 'deployment-is-product' },
    },
    exception: {
      copy: {
        en: 'Local integration evidence is still useful, but it is not production evidence. The environment and coverage boundary remain explicit.',
        he: 'ראיית integration מקומית עדיין שימושית, אבל היא אינה ראיית פרודקשן. סביבת הבדיקה וגבול הכיסוי נשארים מפורשים.',
      },
      linkLabel: {
        en: 'Read about honest test environments',
        he: 'לרשומה על סביבות בדיקה כנות',
      },
      ref: { kind: 'article', id: 'tests-need-honest-environments' },
    },
  },
] as const satisfies readonly WorkingPrinciple[];

export const routeTargetForPrincipleRef = (
  ref: WorkingPrincipleRef,
): PortfolioRouteTarget => (
  ref.kind === 'project'
    ? { route: 'project', id: ref.id }
    : { route: 'article', id: ref.id }
);
