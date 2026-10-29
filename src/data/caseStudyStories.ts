import type { ProjectId } from '../contracts/portfolio';
import type { LocalizedList, LocalizedText } from './profile';

export const caseStudyStoryProjectIds = [
  'nis_boutique',
  'online_converter',
  'emergency_protocol',
  'united_hatzalah',
] as const satisfies readonly ProjectId[];

export type CaseStudyStoryProjectId = (typeof caseStudyStoryProjectIds)[number];
export type CaseStudyAccent = 'copper' | 'cyan' | 'amber' | 'orange';

export type CaseStudyDecision = {
  need: LocalizedText;
  choice: LocalizedText;
  impact: LocalizedText;
};

export type CaseStudySystemNode = {
  id: string;
  label: LocalizedText;
  detail: LocalizedText;
  boundary: 'public' | 'production' | 'local';
};

export type CaseStudyStory = {
  accent: CaseStudyAccent;
  decisions: readonly [CaseStudyDecision, ...CaseStudyDecision[]];
  system: {
    caption: LocalizedText;
    nodes: readonly [CaseStudySystemNode, ...CaseStudySystemNode[]];
    boundaryNote?: LocalizedText;
  };
  technicalNotes: LocalizedList;
};

const node = (
  id: string,
  boundary: CaseStudySystemNode['boundary'],
  enLabel: string,
  heLabel: string,
  enDetail: string,
  heDetail: string,
): CaseStudySystemNode => ({
  id,
  boundary,
  label: { en: enLabel, he: heLabel },
  detail: { en: enDetail, he: heDetail },
});

export const caseStudyStories = {
  nis_boutique: {
    accent: 'copper',
    decisions: [
      {
        need: {
          en: 'Give visitors one obvious way to move from interest to an inquiry.',
          he: 'לתת למבקרים דרך אחת וברורה לעבור מהתעניינות לפנייה.',
        },
        choice: {
          en: 'Treat WhatsApp as the primary conversion path and organize the page around it.',
          he: 'להגדיר את WhatsApp כנתיב ההמרה הראשי ולארגן סביבו את העמוד.',
        },
        impact: {
          en: 'The offer, trust signals, and contact action read as one continuous journey.',
          he: 'ההצעה, סימני האמון ופעולת הקשר נקראים כמסע אחד רציף.',
        },
      },
      {
        need: {
          en: 'Make a Hebrew-first service brand feel premium without slowing the path to contact.',
          he: 'לתת למותג שירות עברי תחושה איכותית בלי להאט את הדרך ליצירת קשר.',
        },
        choice: {
          en: 'Use RTL-first hierarchy, restrained motion, focused imagery, and concise service framing.',
          he: 'להשתמש בהיררכיית RTL-first, תנועה מאופקת, מדיה ממוקדת ומסגור שירות תמציתי.',
        },
        impact: {
          en: 'The same product story remains legible on desktop and mobile.',
          he: 'אותו סיפור מוצר נשאר קריא בדסקטופ ובמובייל.',
        },
      },
      {
        need: {
          en: 'Build trust without turning the site into a pricing-heavy brochure.',
          he: 'לבנות אמון בלי להפוך את האתר לברושור עמוס מחירים.',
        },
        choice: {
          en: 'Prioritize service categories, gallery context, FAQ, and direct conversation.',
          he: 'לתעדף קטגוריות שירות, הקשר חזותי, FAQ ושיחה ישירה.',
        },
        impact: {
          en: 'The site stays focused on qualification and contact rather than generic filler.',
          he: 'האתר נשאר ממוקד בהתאמה ובפנייה במקום בתוכן גנרי.',
        },
      },
    ],
    system: {
      caption: {
        en: 'A deliberately short public path from first impression to a direct business conversation.',
        he: 'מסלול ציבורי קצר ומכוון מהרושם הראשון לשיחה עסקית ישירה.',
      },
      nodes: [
        node('visitor', 'public', 'Visitor', 'מבקר', 'Referral or direct visit', 'הפניה או כניסה ישירה'),
        node('site', 'production', 'React + Vite site', 'אתר React + Vite', 'RTL content, services, gallery, FAQ', 'תוכן RTL, שירותים, גלריה ו־FAQ'),
        node('contact', 'public', 'WhatsApp inquiry', 'פנייה ב־WhatsApp', 'The primary live conversion path', 'נתיב ההמרה החי הראשי'),
      ],
    },
    technicalNotes: {
      en: [
        'Custom-domain deployment is part of the public delivery path.',
        'SEO, baseline accessibility, and restrained motion are implemented as supporting layers rather than the product promise.',
      ],
      he: [
        'פריסה לדומיין מותאם היא חלק מנתיב המסירה הציבורי.',
        'SEO, נגישות בסיסית ותנועה מאופקת מיושמים כשכבות תומכות ולא כהבטחת המוצר.',
      ],
    },
  },
  online_converter: {
    accent: 'cyan',
    decisions: [
      {
        need: {
          en: 'Expand beyond a handful of manually maintained converter pages.',
          he: 'להתרחב מעבר למספר קטן של עמודי המרה שמתוחזקים ידנית.',
        },
        choice: {
          en: 'Drive tools and content pages from structured registries and repeatable metadata patterns.',
          he: 'להניע כלי המרה ועמודי תוכן מתוך registries מסודרים ותבניות metadata חוזרות.',
        },
        impact: {
          en: 'New tools can join the same bilingual content and navigation model.',
          he: 'כלים חדשים יכולים להצטרף לאותו מודל תוכן וניווט דו־לשוני.',
        },
      },
      {
        need: {
          en: 'Let technical users transform sensitive drafts without uploading them.',
          he: 'לאפשר למשתמשים טכניים להמיר טיוטות רגישות בלי להעלות אותן.',
        },
        choice: {
          en: 'Run the core conversion flow in the browser and state that boundary in the interface.',
          he: 'להריץ את זרימת ההמרה המרכזית בדפדפן ולהציג את הגבול הזה בממשק.',
        },
        impact: {
          en: 'The privacy promise is visible before a converter is opened.',
          he: 'הבטחת הפרטיות גלויה עוד לפני פתיחת ממיר.',
        },
      },
      {
        need: {
          en: 'Keep search discovery coherent as the registry grows.',
          he: 'לשמור על גילוי עקבי בחיפוש ככל שה־registry גדל.',
        },
        choice: {
          en: 'Validate canonical URLs, hreflang, sitemap, internal links, and performance during delivery.',
          he: 'לאמת canonical, ‏hreflang, ‏sitemap, קישורים פנימיים וביצועים כחלק מהמסירה.',
        },
        impact: {
          en: 'Growth mechanics become a tested product layer instead of a manual afterthought.',
          he: 'מנגנוני הצמיחה הופכים לשכבת מוצר נבדקת במקום לתוספת ידנית בסוף.',
        },
      },
    ],
    system: {
      caption: {
        en: 'Conversion stays in the browser, while structured content and delivery checks support discovery.',
        he: 'ההמרה נשארת בדפדפן, ותוכן מובנה ובדיקות מסירה תומכים בגילוי.',
      },
      nodes: [
        node('input', 'public', 'User input', 'קלט משתמש', 'JSON, CSV, XML, or YAML', 'JSON, CSV, XML או YAML'),
        node('converter', 'production', 'Client-side converter', 'ממיר בצד הלקוח', 'Validation and transformation in the browser', 'אימות והמרה בתוך הדפדפן'),
        node('output', 'public', 'Local result', 'תוצאה מקומית', 'Copy or download without an upload step', 'העתקה או הורדה בלי שלב העלאה'),
        node('discovery', 'production', 'Registry + SEO checks', 'Registry + בדיקות SEO', 'Bilingual pages, metadata, sitemap, and links', 'עמודים דו־לשוניים, metadata, ‏sitemap וקישורים'),
      ],
    },
    technicalNotes: {
      en: [
        'The product uses React, TypeScript, Vite, and i18n for the public client.',
        'CI checks support the delivery model; they do not prove traffic, adoption, or revenue.',
      ],
      he: [
        'המוצר משתמש ב־React, ‏TypeScript, ‏Vite ו־i18n עבור הלקוח הציבורי.',
        'בדיקות CI תומכות במודל המסירה; הן אינן מוכיחות טראפיק, אימוץ או הכנסה.',
      ],
    },
  },
  emergency_protocol: {
    accent: 'amber',
    decisions: [
      {
        need: {
          en: 'Make a complex BLS pathway easier to study without presenting it as emergency guidance.',
          he: 'להקל על לימוד מסלול BLS מורכב בלי להציג אותו כהנחיה לשעת חירום.',
        },
        choice: {
          en: 'Frame the interface explicitly as a step-by-step learning and practice product.',
          he: 'למסגר את הממשק במפורש כמוצר ללמידה ותרגול צעד־אחר־צעד.',
        },
        impact: {
          en: 'The educational context and its safety boundary stay visible in the product story.',
          he: 'ההקשר הלימודי וגבול הבטיחות שלו נשארים גלויים בסיפור המוצר.',
        },
      },
      {
        need: {
          en: 'Support health checks, authentication, and comments in the deployed product.',
          he: 'לתמוך בבדיקות תקינות, אימות ותגובות במוצר הפרוס.',
        },
        choice: {
          en: 'Use Cloudflare Pages Functions and D1 behind the React client in production.',
          he: 'להשתמש ב־Cloudflare Pages Functions וב־D1 מאחורי לקוח React בפרודקשן.',
        },
        impact: {
          en: 'The live system has a clear production data and API boundary.',
          he: 'למערכת החיה יש גבול ברור ל־API ולנתונים בפרודקשן.',
        },
      },
      {
        need: {
          en: 'Keep local backend experimentation from being confused with the deployed architecture.',
          he: 'למנוע בלבול בין ניסויי backend מקומיים לבין הארכיטקטורה הפרוסה.',
        },
        choice: {
          en: 'Document Express and Prisma as a separate local development workspace.',
          he: 'לתעד את Express ו־Prisma כסביבת פיתוח מקומית נפרדת.',
        },
        impact: {
          en: 'The case study does not present local services as production components.',
          he: 'הקייס סטאדי אינו מציג שירותים מקומיים כרכיבי Production.',
        },
      },
    ],
    system: {
      caption: {
        en: 'The production path and the local development workspace are intentionally shown as separate boundaries.',
        he: 'נתיב הפרודקשן וסביבת הפיתוח המקומית מוצגים בכוונה כגבולות נפרדים.',
      },
      nodes: [
        node('learner', 'public', 'Learner', 'לומד', 'Learning and practice only', 'למידה ותרגול בלבד'),
        node('client', 'production', 'React client', 'לקוח React', 'Step-by-step pathway and discussion UI', 'מסלול מדורג וממשק דיון'),
        node('functions', 'production', 'Pages Functions', 'Pages Functions', 'Production health, auth, and comment endpoints', 'נקודות קצה חיות לתקינות, אימות ותגובות'),
        node('d1', 'production', 'Cloudflare D1', 'Cloudflare D1', 'Production persistence', 'התמדה בפרודקשן'),
        node('local', 'local', 'Express + Prisma', 'Express + Prisma', 'Local development workspace only', 'סביבת פיתוח מקומית בלבד'),
      ],
      boundaryNote: {
        en: 'Express and Prisma are not presented as the production API. The product is not for use during emergencies and makes no medical-validation claim.',
        he: 'Express ו־Prisma אינם מוצגים כ־API של הפרודקשן. המוצר אינו מיועד לשימוש בזמן חירום ואינו טוען לאימות רפואי.',
      },
    },
    technicalNotes: {
      en: [
        'The public learning client, Pages Functions, and D1 form the deployed architecture described here.',
        'Authentication and comments are collaboration features inside a learning product, not clinical functionality.',
      ],
      he: [
        'לקוח הלמידה הציבורי, Pages Functions ו־D1 מרכיבים את הארכיטקטורה הפרוסה שמתוארת כאן.',
        'אימות ותגובות הם יכולות שיתוף בתוך מוצר למידה, ולא פונקציונליות קלינית.',
      ],
    },
  },
  united_hatzalah: {
    accent: 'orange',
    decisions: [
      {
        need: {
          en: 'Publish routine branch updates without turning every content change into a code task.',
          he: 'לפרסם עדכוני סניף שוטפים בלי להפוך כל שינוי תוכן למשימת קוד.',
        },
        choice: {
          en: 'Pair the public branch site with an administrative content workflow.',
          he: 'לחבר את אתר הסניף הציבורי לזרימת ניהול תוכן.',
        },
        impact: {
          en: 'Public content and operational updates can move through one product system.',
          he: 'תוכן ציבורי ועדכונים תפעוליים יכולים לנוע דרך מערכת מוצר אחת.',
        },
      },
      {
        need: {
          en: 'Keep changing nonprofit data and media organized over time.',
          he: 'לשמור מידע ומדיה משתנים של עמותה מסודרים לאורך זמן.',
        },
        choice: {
          en: 'Use structured data models with a dedicated media workflow.',
          he: 'להשתמש במודלי נתונים מסודרים ובזרימת מדיה ייעודית.',
        },
        impact: {
          en: 'Content, media, and public display have explicit responsibilities.',
          he: 'לתוכן, למדיה ולתצוגה הציבורית יש תחומי אחריות ברורים.',
        },
      },
      {
        need: {
          en: 'Protect public trust while still supporting operational editing.',
          he: 'לשמור על אמון ציבורי ובמקביל לתמוך בעריכה תפעולית.',
        },
        choice: {
          en: 'Separate the public experience from the admin workflow and deployment structure.',
          he: 'להפריד בין החוויה הציבורית לבין זרימת הניהול ומבנה הפריסה.',
        },
        impact: {
          en: 'The public and management layers can evolve without becoming the same interface.',
          he: 'השכבה הציבורית והשכבה הניהולית יכולות להתפתח בלי להפוך לאותו ממשק.',
        },
      },
    ],
    system: {
      caption: {
        en: 'A public branch experience and an operational editing path share structured content without sharing the same interface.',
        he: 'חוויה ציבורית לסניף ונתיב עריכה תפעולי חולקים תוכן מובנה בלי לחלוק את אותו ממשק.',
      },
      nodes: [
        node('public', 'public', 'Public visitor', 'מבקר ציבורי', 'Branch information and activity', 'מידע ופעילות הסניף'),
        node('react', 'production', 'React public site', 'אתר React ציבורי', 'The live branch presentation layer', 'שכבת התצוגה החיה של הסניף'),
        node('admin', 'production', 'Admin workflow', 'זרימת ניהול', 'Content and media updates', 'עדכוני תוכן ומדיה'),
        node('api', 'production', 'Express API', 'Express API', 'Application and content operations', 'פעולות יישום ותוכן'),
        node('data', 'production', 'Prisma + Cloudinary', 'Prisma + Cloudinary', 'Structured data and managed media', 'נתונים מובנים ומדיה מנוהלת'),
      ],
    },
    technicalNotes: {
      en: [
        'The documented stack includes React, Express, Prisma, Cloudinary, and structured deployment.',
        'No adoption, response-time, fundraising, or operational-efficiency metric is claimed.',
      ],
      he: [
        'הסטאק המתועד כולל React, ‏Express, ‏Prisma, ‏Cloudinary ופריסה מסודרת.',
        'לא נטען מדד של אימוץ, זמן תגובה, גיוס תרומות או יעילות תפעולית.',
      ],
    },
  },
} as const satisfies Record<CaseStudyStoryProjectId, CaseStudyStory>;

export const caseStudyStoryLabels = {
  en: {
    heroAudience: 'Product and audience',
    heroRole: 'My role',
    liveProduct: 'View live product',
    sourceCode: 'View source code',
    chapterNavigation: 'Case study chapters',
    visualProof: 'Visual proof',
    challenge: 'The challenge',
    role: 'My role',
    ownership: 'Ownership model',
    collaboration: 'Collaboration boundary',
    decisions: 'Product decisions',
    decisionNeed: 'Need',
    decisionChoice: 'Choice',
    decisionImpact: 'Impact',
    system: 'System view',
    systemLegend: 'System boundary legend',
    publicBoundary: 'Public interaction',
    productionBoundary: 'Production component',
    localBoundary: 'Local workspace',
    outcome: 'Outcome and evidence',
    evidenceStatus: 'Evidence status',
    verified: 'Verified public evidence',
    unverified: 'Public evidence not yet verified',
    appendix: 'Technical appendix',
    appendixOpen: 'Open technical appendix',
    appendixClose: 'Close technical appendix',
    appendixDescription: 'Secondary implementation and verification notes.',
    context: 'Project context',
    verification: 'Verification notes',
    verificationUnknown: 'Public test and verification details are not documented yet.',
    next: 'Next step',
    relatedWriting: 'Related writing',
    relatedCapabilities: 'Relevant capabilities',
    nextProject: 'Next project',
    allProjects: 'All projects',
    contact: 'Start a conversation',
  },
  he: {
    heroAudience: 'המוצר והקהל',
    heroRole: 'התפקיד שלי',
    liveProduct: 'צפייה במוצר החי',
    sourceCode: 'צפייה בקוד המקור',
    chapterNavigation: 'פרקי הקייס סטאדי',
    visualProof: 'הוכחה חזותית',
    challenge: 'האתגר',
    role: 'התפקיד שלי',
    ownership: 'מודל האחריות',
    collaboration: 'גבול שיתוף הפעולה',
    decisions: 'החלטות מוצר',
    decisionNeed: 'הצורך',
    decisionChoice: 'הבחירה',
    decisionImpact: 'ההשפעה',
    system: 'מבט מערכת',
    systemLegend: 'מקרא גבולות המערכת',
    publicBoundary: 'אינטראקציה ציבורית',
    productionBoundary: 'רכיב Production',
    localBoundary: 'סביבה מקומית',
    outcome: 'תוצאה וראיות',
    evidenceStatus: 'מצב הראיות',
    verified: 'ראיה ציבורית מאומתת',
    unverified: 'הראיה הציבורית עדיין לא אומתה',
    appendix: 'נספח טכני',
    appendixOpen: 'פתיחת הנספח הטכני',
    appendixClose: 'סגירת הנספח הטכני',
    appendixDescription: 'פרטי מימוש ואימות משניים.',
    context: 'הקשר הפרויקט',
    verification: 'הערות אימות',
    verificationUnknown: 'פרטי בדיקות ואימות ציבוריים עדיין לא תועדו.',
    next: 'הצעד הבא',
    relatedWriting: 'כתיבה קשורה',
    relatedCapabilities: 'יכולות רלוונטיות',
    nextProject: 'הפרויקט הבא',
    allProjects: 'כל הפרויקטים',
    contact: 'מתחילים שיחה',
  },
} as const;

export const getNextCaseStudyProjectId = (projectId: CaseStudyStoryProjectId) => {
  const index = caseStudyStoryProjectIds.indexOf(projectId);
  return caseStudyStoryProjectIds[(index + 1) % caseStudyStoryProjectIds.length];
};
