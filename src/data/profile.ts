import {
  assertCaseStudyEvidenceContract,
  type CaseStudyEvidence,
  type OutcomeClaim,
} from './caseStudyEvidence.ts';

export const profileLinks = {
  github: 'https://github.com/Evyatar-Hazan',
  linkedin: 'https://www.linkedin.com/in/evyatar-hazan-662235210/',
  email: 'mailto:evyatarhazan3.14@gmail.com',
  whatsapp: 'https://wa.me/972587127547',
  cv: '',
} as const;

export type LocalizedText = {
  en: string;
  he: string;
};

export type LocalizedList = {
  en: string[];
  he: string[];
};

export type ProjectCaseStudy = {
  eyebrow: LocalizedText;
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  overview: LocalizedList;
  audience: LocalizedText;
  ownership: {
    model: LocalizedText;
    collaboration: LocalizedText;
  };
  proof: LocalizedText;
  decisions: LocalizedList;
  outcomes: readonly [OutcomeClaim, ...OutcomeClaim[]];
} & CaseStudyEvidence;

export type Project = {
  id: string;
  category: 'business' | 'fullstack' | 'nonprofit' | 'tool' | 'mobile';
  featured: boolean;
  status: 'live' | 'active' | 'fullstack' | 'monorepo' | 'privacy' | 'learning' | 'nonprofit';
  tags: string[];
  githubUrl: string;
  visual: 'catering' | 'converter' | 'protocol' | 'nonprofit' | 'mobile' | 'learning' | 'branch';
  summaryKey: string;
  impactKey: string;
  liveUrl?: string;
  caseStudy?: ProjectCaseStudy;
};

const caseStudies = {
  nis_boutique: {
    eyebrow: {
      en: 'Business website case study',
      he: 'קייס סטאדי לאתר עסקי'
    },
    seoTitle: {
      en: 'Nis Boutique Catering Case Study | Evyatar Hazan',
      he: 'קייס סטאדי: Nis Boutique Catering | אביתר חזן'
    },
    seoDescription: {
      en: 'How I built a conversion-focused boutique catering website around WhatsApp, trust, RTL UX, and practical SEO.',
      he: 'איך בניתי אתר קייטרינג מוכוון המרה סביב WhatsApp, אמון, חוויית RTL ו-SEO פרקטי.'
    },
    overview: {
      en: [
        'This project was not about adding as many website features as possible. It was about helping a local catering business feel premium, clear, and easy to contact from the first screen.',
        'The core product decision was to treat WhatsApp as the primary conversion path, then build the page hierarchy, trust elements, imagery, FAQ, and copy around that one action.'
      ],
      he: [
        'הפרויקט הזה לא היה ניסיון לדחוף כמה שיותר פיצ׳רים לאתר. המטרה היתה לעזור לעסק קייטרינג מקומי להיראות איכותי, ברור וקל ליצירת קשר כבר מהמסך הראשון.',
        'החלטת המוצר המרכזית היתה להתייחס ל-WhatsApp כערוץ ההמרה הראשי, ואז לבנות סביבו את היררכיית התוכן, אלמנטים של אמון, גלריה, FAQ וקופי.'
      ]
    },
    audience: {
      en: 'Small service businesses that need one strong inquiry path instead of a bloated brochure site.',
      he: 'עסקי שירות קטנים שצריכים נתיב פנייה אחד חזק, ולא אתר תדמית מנופח.'
    },
    ownership: {
      model: {
        en: 'Independent technical ownership.',
        he: 'אחריות טכנית אישית.'
      },
      collaboration: {
        en: 'The business owner supplied the service context and business direction. I do not claim ownership of the catering business or its operations.',
        he: 'בעלת העסק סיפקה את הקשר השירותי ואת הכיוון העסקי. איני מייחס לעצמי בעלות על עסק הקייטרינג או על פעילותו.'
      }
    },
    proof: {
      en: 'The public site and pinned repository document a live custom-domain product plus three distinct surfaces: the website, Content Studio, and private media library.',
      he: 'האתר הציבורי ומאגר הקוד המקובע מתעדים מוצר חי בדומיין מותאם ושלושה משטחים נפרדים: האתר, Content Studio וספריית מדיה פרטית.'
    },
    evidenceStatus: 'verified',
    verifiedAt: '2026-10-29',
    evidenceLinks: [
      {
        label: { en: 'Live catering website', he: 'אתר הקייטרינג החי' },
        url: 'https://nisboutiquecatering.com/',
      },
      {
        label: { en: 'Pinned source and architecture', he: 'קוד וארכיטקטורה בגרסה מקובעת' },
        url: 'https://github.com/Evyatar-Hazan/nis-boutique-catering/tree/039f02897190d1e08e16ad7f9f0cbf5e6e3a389f',
      },
    ],
    decisions: {
      en: [
        'Kept the content tightly scoped so visitors never need to guess what to do next.',
        'Used RTL-first layout, restrained motion, and image treatment that supports the premium positioning instead of fighting it.',
        'Avoided pricing-heavy clutter and built the page around trust, service framing, and WhatsApp readiness.'
      ],
      he: [
        'שמרתי את התוכן ממוקד כדי שהמבקר לא יצטרך לנחש מה לעשות הלאה.',
        'השתמשתי בפריסה RTL-first, תנועה מאופקת וטיפול במדיה שתומך במיצוב הפרימיום במקום להפריע לו.',
        'נמנעתי מעומס של מחירים ופירקתי את העמוד סביב אמון, מסגור השירות ומוכנות ל-WhatsApp.'
      ]
    },
    outcomes: [
      {
        statement: {
          en: 'One repository now separates the public website, editorial Content Studio, and private source-photo library.',
          he: 'מאגר אחד מפריד כעת בין האתר הציבורי, Content Studio לעריכה וספריית תמונות מקור פרטית.',
        },
        support: {
          kind: 'metric',
          value: '3',
          label: { en: 'documented product surfaces', he: 'משטחי מוצר מתועדים' },
          source: {
            label: { en: 'Pinned repository README', he: 'README בגרסה מקובעת' },
            url: 'https://github.com/Evyatar-Hazan/nis-boutique-catering/tree/039f02897190d1e08e16ad7f9f0cbf5e6e3a389f',
          },
        },
      },
      {
        statement: {
          en: 'The customer-facing product is publicly reachable on its custom domain in Hebrew and English.',
          he: 'המוצר ללקוחות נגיש לציבור בדומיין המותאם שלו בעברית ובאנגלית.',
        },
        support: {
          kind: 'source',
          value: { en: 'Live', he: 'חי' },
          label: { en: 'public product evidence', he: 'ראיית מוצר ציבורית' },
          source: {
            label: { en: 'Open live website', he: 'פתיחת האתר החי' },
            url: 'https://nisboutiquecatering.com/',
          },
        },
      },
      {
        statement: {
          en: 'No lead-volume, conversion-rate, or revenue lift is claimed because comparable business analytics were not provided.',
          he: 'לא נטענת עלייה בכמות הלידים, בשיעור ההמרה או בהכנסות, משום שלא סופקו נתוני אנליטיקה עסקיים להשוואה.',
        },
        support: {
          kind: 'boundary',
          value: { en: 'Not claimed', he: 'לא נטען' },
          label: { en: 'business-performance boundary', he: 'גבול לביצועים עסקיים' },
        },
      },
    ]
  },
  online_converter: {
    eyebrow: {
      en: 'Tool and SEO case study',
      he: 'קייס סטאדי לכלי ו-SEO'
    },
    seoTitle: {
      en: 'Online Converter Case Study | Evyatar Hazan',
      he: 'קייס סטאדי: Online Converter | אביתר חזן'
    },
    seoDescription: {
      en: 'How I turned a small converter tool into a bilingual growth product with structured SEO, privacy-safe UX, and quality gates.',
      he: 'איך הפכתי כלי המרה קטן למוצר צמיחה דו-לשוני עם SEO מסודר, UX שומר פרטיות ובדיקות איכות.'
    },
    overview: {
      en: [
        'Online Converter started as a simple browser utility. The real product challenge was to turn it into a scalable content surface that can attract search traffic in both Hebrew and English.',
        'That meant treating SEO, internal linking, metadata, categories, examples, FAQ, and technical quality checks as part of the product itself, not as a checklist added at the end.'
      ],
      he: [
        'Online Converter התחיל ככלי דפדפן פשוט. האתגר האמיתי היה להפוך אותו למשטח תוכן סקיילבילי שמסוגל למשוך חיפושים גם בעברית וגם באנגלית.',
        'זה דרש להתייחס ל-SEO, קישורים פנימיים, metadata, קטגוריות, דוגמאות, FAQ ובדיקות איכות טכניות כחלק מהמוצר עצמו, לא כרשימה שמוסיפים בסוף.'
      ]
    },
    audience: {
      en: 'Developers, analysts, content teams, and technical users who need quick local transformations without uploading data.',
      he: 'מפתחים, אנליסטים, צוותי תוכן ומשתמשים טכניים שצריכים המרות מהירות מקומית בלי העלאת מידע.'
    },
    ownership: {
      model: {
        en: 'Personal project with end-to-end product and technical ownership.',
        he: 'פרויקט אישי עם אחריות מלאה על המוצר ועל המימוש.'
      },
      collaboration: {
        en: 'No team delivery is claimed; this case study describes my individual product and engineering work.',
        he: 'לא מיוחסת כאן תרומה של צוות; הקייס סטאדי מתאר את עבודת המוצר והפיתוח האישית שלי.'
      }
    },
    proof: {
      en: 'The pinned repository records 140 converter definitions, including 16 editorially reviewed tools published in both English and Hebrew; conversion runs locally in the browser.',
      he: 'מאגר הקוד המקובע מתעד 140 הגדרות ממיר, ובהן 16 כלים שעברו עריכה ופורסמו בעברית ובאנגלית; ההמרה רצה מקומית בדפדפן.'
    },
    evidenceStatus: 'verified',
    verifiedAt: '2026-10-29',
    evidenceLinks: [
      {
        label: { en: 'Live converter product', he: 'מוצר ההמרה החי' },
        url: 'https://online-converter.evyatarhazan.com/',
      },
      {
        label: { en: 'Pinned source and published counts', he: 'קוד וספירות פרסום בגרסה מקובעת' },
        url: 'https://github.com/Evyatar-Hazan/online-converter/tree/788761e81c4b968bd603b4445d04df9a39eaa6cd',
      },
    ],
    decisions: {
      en: [
        'Moved from a small manually managed SPA toward a more content-scalable architecture with registry-driven pages and stronger metadata patterns.',
        'Kept the core privacy promise: conversions run in the browser and the UX explains that clearly.',
        'Added quality gates for canonical, hreflang, sitemap, internal links, and performance so scale does not silently degrade trust.'
      ],
      he: [
        'עברתי מ-SPA קטן שמנוהל ידנית לכיוון ארכיטקטורה יותר סקיילבילית, עם עמודים מבוססי registry ותבניות metadata חזקות יותר.',
        'שמרתי על הבטחת הפרטיות המרכזית: ההמרות רצות בדפדפן וה-UX מסביר את זה בצורה ברורה.',
        'הוספתי שערי איכות ל-canonical, hreflang, sitemap, קישורים פנימיים וביצועים כדי שסקייל לא יפגע באמון בשקט.'
      ]
    },
    outcomes: [
      {
        statement: {
          en: 'The registry contains 140 converter definitions; 16 reviewed tools are published as static pages in two languages.',
          he: 'ה־registry מכיל 140 הגדרות ממיר; 16 כלים שעברו עריכה מפורסמים כעמודים סטטיים בשתי שפות.',
        },
        support: {
          kind: 'metric',
          value: '140 / 16 / 2',
          label: { en: 'definitions / published tools / languages', he: 'הגדרות / כלים מפורסמים / שפות' },
          source: {
            label: { en: 'Pinned repository README', he: 'README בגרסה מקובעת' },
            url: 'https://github.com/Evyatar-Hazan/online-converter/tree/788761e81c4b968bd603b4445d04df9a39eaa6cd',
          },
        },
      },
      {
        statement: {
          en: 'Reviewed converters execute in the browser, so pasted input is not uploaded to a conversion server.',
          he: 'הממירים שפורסמו פועלים בדפדפן, ולכן הקלט המודבק אינו נשלח לשרת המרה.',
        },
        support: {
          kind: 'source',
          value: { en: 'Browser-only', he: 'בדפדפן בלבד' },
          label: { en: 'documented processing boundary', he: 'גבול עיבוד מתועד' },
          source: {
            label: { en: 'Pinned implementation source', he: 'מקור מימוש מקובע' },
            url: 'https://github.com/Evyatar-Hazan/online-converter/tree/788761e81c4b968bd603b4445d04df9a39eaa6cd',
          },
        },
      },
      {
        statement: {
          en: 'No organic-traffic, conversion, or advertising-revenue increase is claimed without verified analytics.',
          he: 'לא נטענת עלייה בטראפיק אורגני, בהמרות או בהכנסות מפרסום ללא נתוני אנליטיקה מאומתים.',
        },
        support: {
          kind: 'boundary',
          value: { en: 'Not claimed', he: 'לא נטען' },
          label: { en: 'growth and revenue boundary', he: 'גבול לצמיחה ולהכנסות' },
        },
      },
    ]
  },
  emergency_protocol: {
    eyebrow: {
      en: 'Full-stack workflow case study',
      he: 'קייס סטאדי ל-Workflow של Full Stack'
    },
    seoTitle: {
      en: 'Emergency Protocol Diagram Case Study | Evyatar Hazan',
      he: 'קייס סטאדי: Emergency Protocol Diagram | אביתר חזן'
    },
    seoDescription: {
      en: 'A full-stack learning and practice tool for exploring a BLS pathway, with authentication and discussion features.',
      he: 'כלי למידה ותרגול Full Stack להיכרות עם מסלול BLS, עם התחברות ודיון.'
    },
    overview: {
      en: [
        'This project organizes a BLS pathway into a tool for learning and practice only. It is not intended for use during an emergency and does not claim medical validation.',
        'The core value is not only the diagram itself. It is the shift from static documentation toward a permissioned workflow with clear ownership and iteration paths.'
      ],
      he: [
        'הפרויקט מארגן מסלול BLS בכלי למידה ותרגול בלבד. הוא אינו מיועד לשימוש בזמן חירום ואינו מציג טענה לאימות רפואי.',
        'הערך המרכזי הוא לא רק הדיאגרמה עצמה, אלא המעבר מתיעוד סטטי ל-workflow עם הרשאות, בעלות ברורה ויכולת איטרציה.'
      ]
    },
    audience: {
      en: 'Learners who want to explore and discuss a BLS pathway in a learning and practice context.',
      he: 'לומדים שרוצים להכיר מסלול BLS ולדון בו בהקשר של למידה ותרגול.'
    },
    ownership: {
      model: {
        en: 'Personal project with end-to-end technical ownership.',
        he: 'פרויקט אישי עם אחריות טכנית מלאה.'
      },
      collaboration: {
        en: 'No clinical or organizational authorship is claimed; medical review and source approval remain outside my technical contribution.',
        he: 'איני מייחס לעצמי סמכות קלינית או ארגונית; בדיקה רפואית ואישור מקורות נשארים מחוץ לתרומה הטכנית שלי.'
      }
    },
    proof: {
      en: 'The live health endpoint returned HTTP 200 on October 29, 2026. The pinned source identifies Cloudflare Pages Functions and D1 as production, while Express and Prisma remain local development only.',
      he: 'נקודת הקצה החיה לבדיקת תקינות החזירה HTTP 200 ב־29 באוקטובר 2026. המקור המקובע מזהה את Cloudflare Pages Functions ו־D1 כפרודקשן, בעוד Express ו־Prisma נשארים לפיתוח מקומי בלבד.'
    },
    evidenceStatus: 'verified',
    verifiedAt: '2026-10-29',
    evidenceLinks: [
      {
        label: { en: 'Live health endpoint', he: 'נקודת קצה חיה לבדיקת תקינות' },
        url: 'https://bls-protocol.evyatarhazan.com/api/health',
      },
      {
        label: { en: 'Pinned production architecture', he: 'ארכיטקטורת פרודקשן בגרסה מקובעת' },
        url: 'https://github.com/Evyatar-Hazan/emergency-protocol-diagram/tree/36cfc831589f7e4090bd340faa078faae1a67458',
      },
    ],
    decisions: {
      en: [
        'Separated client, API, auth, and data responsibilities so future protocol changes do not collapse into one fragile layer.',
        'Structured the interaction around step-by-step learning and practice.',
        'Added maintainable backend structure so collaboration features remain grounded in clear models rather than ad hoc state.'
      ],
      he: [
        'הפרדתי בין אחריות של client, API, auth ו-data כדי ששינויים עתידיים בפרוטוקול לא יקרסו לשכבה שבירה אחת.',
        'ארגנתי את האינטראקציה סביב למידה ותרגול צעד-אחר-צעד.',
        'הוספתי מבנה backend תחזוקתי כדי שפיצ׳רי שיתוף יישבו על מודלים ברורים ולא על state מאולתר.'
      ]
    },
    outcomes: [
      {
        statement: {
          en: 'The production health endpoint responded successfully during the evidence check on October 29, 2026.',
          he: 'נקודת הקצה של הפרודקשן לבדיקת תקינות הגיבה בהצלחה בבדיקת הראיות ב־29 באוקטובר 2026.',
        },
        support: {
          kind: 'metric',
          value: 'HTTP 200',
          label: { en: 'live health response', he: 'תגובת תקינות חיה' },
          source: {
            label: { en: 'Open health endpoint', he: 'פתיחת נקודת התקינות' },
            url: 'https://bls-protocol.evyatarhazan.com/api/health',
          },
        },
      },
      {
        statement: {
          en: 'The deployed data path is documented as Pages Functions plus D1; Express and Prisma are explicitly excluded from the production claim.',
          he: 'נתיב הנתונים הפרוס מתועד כ־Pages Functions יחד עם D1; ‏Express ו־Prisma מוחרגים במפורש מטענת הפרודקשן.',
        },
        support: {
          kind: 'metric',
          value: '2',
          label: { en: 'documented production backend layers', he: 'שכבות Backend מתועדות בפרודקשן' },
          source: {
            label: { en: 'Pinned architecture source', he: 'מקור ארכיטקטורה מקובע' },
            url: 'https://github.com/Evyatar-Hazan/emergency-protocol-diagram/tree/36cfc831589f7e4090bd340faa078faae1a67458',
          },
        },
      },
      {
        statement: {
          en: 'No clinical effectiveness, emergency-response, or medical-validation outcome is claimed; the product is for learning and review only.',
          he: 'לא נטענת תוצאה של יעילות קלינית, תגובת חירום או אימות רפואי; המוצר מיועד ללמידה ולחזרה בלבד.',
        },
        support: {
          kind: 'boundary',
          value: { en: 'Not a clinical claim', he: 'לא טענה קלינית' },
          label: { en: 'medical-use boundary', he: 'גבול לשימוש רפואי' },
        },
      },
    ]
  },
  united_hatzalah: {
    eyebrow: {
      en: 'Nonprofit operations case study',
      he: 'קייס סטאדי לתפעול עמותה'
    },
    seoTitle: {
      en: 'United Hatzalah Shoham Branch Case Study | Evyatar Hazan',
      he: 'קייס סטאדי: איחוד הצלה שוהם | אביתר חזן'
    },
    seoDescription: {
      en: 'How I built a nonprofit branch website and admin workflow that reduces dependency on code changes for routine updates.',
      he: 'איך בניתי אתר סניף ומערכת ניהול לעמותה שמפחיתים תלות בעדכוני קוד עבור שינויים שוטפים.'
    },
    overview: {
      en: [
        'Nonprofit systems often suffer from a familiar problem: every public update becomes a developer task, even when the content itself is simple.',
        'This project focused on reducing that dependency by combining a public branch website with an admin workflow for content, media, and operational data.'
      ],
      he: [
        'מערכות לעמותות סובלות הרבה פעמים מבעיה מוכרת: כל עדכון ציבורי הופך למשימת פיתוח, גם כשהתוכן עצמו פשוט.',
        'הפרויקט הזה התמקד בהפחתת התלות הזאת באמצעות שילוב בין אתר ציבורי לסניף לבין workflow ניהולי לתוכן, מדיה ונתונים תפעוליים.'
      ]
    },
    audience: {
      en: 'Local nonprofits and operational teams that need a reliable public presence without turning every change into a code deployment.',
      he: 'עמותות מקומיות וצוותים תפעוליים שצריכים נוכחות ציבורית אמינה בלי להפוך כל שינוי לפריסת קוד.'
    },
    ownership: {
      model: {
        en: 'Independent software implementation within an organizational project.',
        he: 'מימוש תוכנה אישי בתוך פרויקט ארגוני.'
      },
      collaboration: {
        en: 'Branch stakeholders supplied the operational context and content priorities. I do not claim their organizational or volunteer work.',
        he: 'בעלי העניין בסניף סיפקו את ההקשר התפעולי ואת סדרי העדיפות לתוכן. איני מייחס לעצמי את עבודתם הארגונית או ההתנדבותית.'
      }
    },
    proof: {
      en: 'The pinned repository documents three product surfaces—a public website, admin panel, and backend API—inside one full-stack monorepo.',
      he: 'מאגר הקוד המקובע מתעד שלושה משטחי מוצר—אתר ציבורי, פאנל ניהול ו־Backend API—בתוך מונוריפו Full Stack אחד.'
    },
    evidenceStatus: 'verified',
    verifiedAt: '2026-10-29',
    evidenceLinks: [
      {
        label: { en: 'Live branch website', he: 'אתר הסניף החי' },
        url: 'https://hatzalah-shoham.evyatarhazan.com/',
      },
      {
        label: { en: 'Pinned source and product surfaces', he: 'קוד ומשטחי מוצר בגרסה מקובעת' },
        url: 'https://github.com/Evyatar-Hazan/united-hatzalah-shoham-branch/tree/8b373a20d40e0dd80721e43d5fff9fe4ac78a5d3',
      },
    ],
    decisions: {
      en: [
        'Built the content and media workflow so routine updates do not require touching the codebase.',
        'Kept the data layer structured because nonprofit information tends to evolve in uneven but important ways.',
        'Treated public trust as part of the product, not only the admin feature set.'
      ],
      he: [
        'בנינו את זרימת התוכן והמדיה כך שעדכונים שוטפים לא ידרשו מגע בקוד.',
        'שמרתי על שכבת data מסודרת כי מידע של עמותות נוטה להשתנות בצורה לא אחידה אבל חשובה.',
        'התייחסתי לאמון הציבורי כחלק מהמוצר, לא רק לפיצ׳רי הניהול.'
      ]
    },
    outcomes: [
      {
        statement: {
          en: 'The repository separates the public website, administrative editing, and backend operations into explicit product surfaces.',
          he: 'המאגר מפריד בין האתר הציבורי, עריכת הניהול ופעולות ה־Backend למשטחי מוצר מפורשים.',
        },
        support: {
          kind: 'metric',
          value: '3',
          label: { en: 'documented product surfaces', he: 'משטחי מוצר מתועדים' },
          source: {
            label: { en: 'Pinned repository README', he: 'README בגרסה מקובעת' },
            url: 'https://github.com/Evyatar-Hazan/united-hatzalah-shoham-branch/tree/8b373a20d40e0dd80721e43d5fff9fe4ac78a5d3',
          },
        },
      },
      {
        statement: {
          en: 'The public branch website is reachable independently from the administrative workflow described in the source.',
          he: 'אתר הסניף הציבורי נגיש בנפרד מזרימת הניהול המתוארת בקוד המקור.',
        },
        support: {
          kind: 'source',
          value: { en: 'Live', he: 'חי' },
          label: { en: 'public website evidence', he: 'ראיית אתר ציבורי' },
          source: {
            label: { en: 'Open live website', he: 'פתיחת האתר החי' },
            url: 'https://hatzalah-shoham.evyatarhazan.com/',
          },
        },
      },
      {
        statement: {
          en: 'No adoption, response-time, fundraising, or developer-time reduction is claimed because those operational metrics were not verified.',
          he: 'לא נטענת ירידה בזמן תגובה או בזמן מפתח, ולא נטען שיפור באימוץ או בגיוס תרומות, משום שמדדים תפעוליים אלה לא אומתו.',
        },
        support: {
          kind: 'boundary',
          value: { en: 'Not measured', he: 'לא נמדד' },
          label: { en: 'operational-impact boundary', he: 'גבול להשפעה תפעולית' },
        },
      },
    ]
  }
} satisfies Record<string, ProjectCaseStudy>;

assertCaseStudyEvidenceContract(
  Object.entries(caseStudies).map(([id, evidence]) => ({ id, evidence, outcomes: evidence.outcomes })),
);

export const projects: Project[] = [
  {
    id: 'nis_boutique',
    category: 'business',
    featured: true,
    status: 'live',
    tags: ['React', 'TypeScript', 'Vite', 'Vercel', 'SEO', 'RTL'],
    githubUrl: 'https://github.com/Evyatar-Hazan/nis-boutique-catering',
    liveUrl: 'https://nisboutiquecatering.com/',
    visual: 'catering',
    summaryKey: 'projects.items.nis_boutique.summary',
    impactKey: 'projects.items.nis_boutique.impact',
    caseStudy: caseStudies.nis_boutique
  },
  {
    id: 'online_converter',
    category: 'tool',
    featured: true,
    status: 'active',
    tags: ['React', 'TypeScript', 'Vite', 'i18n', 'CI'],
    githubUrl: 'https://github.com/Evyatar-Hazan/online-converter',
    liveUrl: 'https://online-converter.evyatarhazan.com/',
    visual: 'converter',
    summaryKey: 'projects.items.online_converter.summary',
    impactKey: 'projects.items.online_converter.impact',
    caseStudy: caseStudies.online_converter
  },
  {
    id: 'emergency_protocol',
    category: 'fullstack',
    featured: true,
    status: 'fullstack',
    tags: ['React', 'Cloudflare Pages Functions', 'D1', 'Learning', 'CI'],
    githubUrl: 'https://github.com/Evyatar-Hazan/emergency-protocol-diagram',
    liveUrl: 'https://bls-protocol.evyatarhazan.com/',
    visual: 'protocol',
    summaryKey: 'projects.items.emergency_protocol.summary',
    impactKey: 'projects.items.emergency_protocol.impact',
    caseStudy: caseStudies.emergency_protocol
  },
  {
    id: 'lev_chedva',
    category: 'nonprofit',
    featured: false,
    status: 'monorepo',
    tags: ['Monorepo', 'React', 'Node.js', 'TypeScript', 'CI'],
    githubUrl: 'https://github.com/Evyatar-Hazan/lev-hedva',
    liveUrl: 'https://lev-chedva.evyatarhazan.com/',
    visual: 'nonprofit',
    summaryKey: 'projects.items.lev_chedva.summary',
    impactKey: 'projects.items.lev_chedva.impact'
  },
  {
    id: 'password_gen',
    category: 'mobile',
    featured: false,
    status: 'privacy',
    tags: ['React Native', 'TypeScript', 'Core package', 'Privacy-first'],
    githubUrl: 'https://github.com/Evyatar-Hazan/password-generator',
    visual: 'mobile',
    summaryKey: 'projects.items.password_gen.summary',
    impactKey: 'projects.items.password_gen.impact'
  },
  {
    id: 'test_yourself',
    category: 'fullstack',
    featured: false,
    status: 'learning',
    tags: ['React', 'Express', 'TypeScript', 'Monorepo', 'CI'],
    githubUrl: 'https://github.com/Evyatar-Hazan/test-yourself',
    visual: 'learning',
    summaryKey: 'projects.items.test_yourself.summary',
    impactKey: 'projects.items.test_yourself.impact'
  },
  {
    id: 'united_hatzalah',
    category: 'nonprofit',
    featured: true,
    status: 'nonprofit',
    tags: ['React', 'Express', 'Prisma', 'Cloudinary', 'Render'],
    githubUrl: 'https://github.com/Evyatar-Hazan/united-hatzalah-shoham-branch',
    liveUrl: 'https://hatzalah-shoham.evyatarhazan.com/',
    visual: 'branch',
    summaryKey: 'projects.items.united_hatzalah.summary',
    impactKey: 'projects.items.united_hatzalah.impact',
    caseStudy: caseStudies.united_hatzalah
  },
];

export const projectById = new Map(projects.map((project) => [project.id, project]));

export const getProjectById = (projectId: string | undefined) => (
  projectId ? projectById.get(projectId) : undefined
);
