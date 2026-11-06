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
  cv: '/evyatar-hazan-cv.pdf',
} as const;

export const publicCv = {
  updatedAt: '2026-07-23',
  downloadName: 'Evyatar-Hazan-CV.pdf',
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
      en: 'From event interest to a clear inquiry',
      he: 'מהתעניינות באירוע לפנייה ברורה'
    },
    seoTitle: {
      en: 'Clear Catering Inquiries — Nis Boutique Case Study | Evyatar Hazan',
      he: 'נתיב פנייה ברור לקייטרינג — Nis Boutique | אביתר חזן'
    },
    seoDescription: {
      en: 'A boutique catering site that helps event planners assess fit and reach one clear inquiry path, using WhatsApp, trust cues, and RTL UX to reduce friction.',
      he: 'אתר קייטרינג בוטיק שעוזר למתכנני אירועים להבין התאמה ולהגיע לנתיב פנייה ברור, בעזרת WhatsApp, סימני אמון וחוויית RTL שמפחיתים חיכוך.'
    },
    overview: {
      en: [
        'A visitor planning an event needs to understand quickly whether the catering style fits the occasion and how to start an inquiry. The challenge is to present the service, build trust, and make the next step clear without overwhelming them with detail.',
        'That led to one product decision: make WhatsApp the primary inquiry path, then organize the content hierarchy, trust cues, imagery, FAQ, and copy around that conversation.'
      ],
      he: [
        'מבקר שמתכנן אירוע צריך להבין במהירות אם סגנון הקייטרינג מתאים לאירוע ואיך להתחיל פנייה. האתגר הוא להציג את השירות, לבנות אמון ולהבהיר את הצעד הבא בלי להציף אותו בפרטים.',
        'מכאן נבעה החלטת מוצר אחת: להפוך את WhatsApp לנתיב הפנייה הראשי, ולארגן סביב השיחה הזו את היררכיית התוכן, רכיבי האמון, התמונות, ה־FAQ והקופי.'
      ]
    },
    audience: {
      en: 'A local catering business whose visitors need to assess fit quickly and move into one clear inquiry path.',
      he: 'עסק קייטרינג מקומי שהמבקרים בו צריכים להבין התאמה במהירות ולעבור לנתיב פנייה ברור אחד.'
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
      en: 'The live bilingual site shows the customer journey to a WhatsApp inquiry, while the pinned repository documents the supporting Content Studio and private media library.',
      he: 'האתר החי והדו־לשוני מציג את מסע הלקוח עד לפנייה ב־WhatsApp, ומאגר הקוד המקובע מתעד את Content Studio ואת ספריית המדיה הפרטית שתומכים בו.'
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
        'Made WhatsApp the primary inquiry path, with the page hierarchy and service copy leading to one clear next step.',
        'Replaced pricing-heavy clutter with concise service framing, gallery context, and FAQ so visitors can assess fit before contacting.',
        'Built an RTL-first hierarchy with restrained motion and focused imagery so the same premium story stays legible on desktop and mobile.'
      ],
      he: [
        'הפכתי את WhatsApp לנתיב הפנייה הראשי, כשהיררכיית העמוד וקופי השירות מובילים לצעד הבא ברור אחד.',
        'החלפתי עומס של מחירים במסגור שירות תמציתי, גלריה שנותנת הקשר ו־FAQ, כדי שמבקרים יוכלו לבחון התאמה לפני הפנייה.',
        'בניתי היררכיית RTL-first עם תנועה מאופקת ומדיה ממוקדת, כדי שאותו סיפור פרימיום יישאר קריא בדסקטופ ובמובייל.'
      ]
    },
    outcomes: [
      {
        statement: {
          en: 'The live bilingual website gives visitors a direct path from service details to a WhatsApp inquiry.',
          he: 'האתר החי והדו־לשוני נותן למבקרים נתיב ישיר מפרטי השירות לפנייה ב־WhatsApp.',
        },
        support: {
          kind: 'source',
          value: { en: 'Live', he: 'חי' },
          label: { en: 'public product and inquiry path', he: 'מוצר ציבורי ונתיב פנייה' },
          source: {
            label: { en: 'Open live website', he: 'פתיחת האתר החי' },
            url: 'https://nisboutiquecatering.com/',
          },
        },
      },
      {
        statement: {
          en: 'The public evidence confirms the product and contact route, but it does not establish a conversion rate, inquiry volume, or revenue lift.',
          he: 'הראיות הציבוריות מאמתות את המוצר ואת נתיב הפנייה, אך אינן מוכיחות שיעור המרה, היקף פניות או עלייה בהכנסות.',
        },
        support: {
          kind: 'boundary',
          value: { en: 'No conversion metric', he: 'אין מדד המרה' },
          label: { en: 'business-performance boundary', he: 'גבול לביצועים עסקיים' },
        },
      },
      {
        statement: {
          en: 'One repository separates the public website, editorial Content Studio, and private source-photo library so publishing work stays distinct from the visitor experience.',
          he: 'מאגר אחד מפריד בין האתר הציבורי, Content Studio לעריכה וספריית תמונות מקור פרטית, כך שעבודת הפרסום נשארת נפרדת מחוויית המבקר.',
        },
        support: {
          kind: 'metric',
          value: '3',
          label: { en: 'documented supporting surfaces', he: 'משטחים תומכים מתועדים' },
          source: {
            label: { en: 'Pinned repository README', he: 'README בגרסה מקובעת' },
            url: 'https://github.com/Evyatar-Hazan/nis-boutique-catering/tree/039f02897190d1e08e16ad7f9f0cbf5e6e3a389f',
          },
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
      en: 'A bilingual catalog of 140 browser-based converter definitions, with local processing, structured SEO, and quality gates.',
      he: 'קטלוג דו־לשוני של 140 הגדרות ממיר בדפדפן, עם עיבוד מקומי, SEO מסודר ושערי איכות.'
    },
    overview: {
      en: [
        'When someone needs to convert a draft that may contain sensitive data, uploading it to an unfamiliar service creates a second problem. Online Converter starts with a clear boundary: the core conversion runs locally in the browser, so the input does not need to be sent to a server. The verified surface includes a bilingual catalog of 140 converter definitions, including 16 editorially reviewed tools published in English and Hebrew.',
        'From that privacy-first foundation, I expanded the utility through a structured registry, metadata, categories, internal links, examples, and quality checks. Together, they help people discover the right tool while keeping the conversion flow consistent.'
      ],
      he: [
        'כשצריך להמיר טיוטה שעשויה לכלול מידע רגיש, העלאה לשירות לא מוכר יוצרת בעיה נוספת. Online Converter מתחיל בגבול ברור: ההמרה המרכזית מתבצעת מקומית בדפדפן, כך שאין צורך לשלוח את הקלט לשרת. המשטח שאומת כולל קטלוג דו־לשוני של 140 הגדרות ממיר, ובהן 16 כלים שעברו עריכה ופורסמו בעברית ובאנגלית.',
        'מהבסיס שומר הפרטיות הזה, הרחבתי את הכלי באמצעות registry מובנה, metadata, קטגוריות, קישורים פנימיים, דוגמאות ובדיקות איכות. יחד הם עוזרים לאנשים למצוא את הכלי המתאים, תוך שמירה על זרימת המרה עקבית.'
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
      en: 'The pinned repository documents 140 converter definitions. Of those, 16 reviewed tools are published as static pages in two languages—English and Hebrew—and their conversions run locally in the browser.',
      he: 'מאגר הקוד המקובע מתעד 140 הגדרות ממיר. מתוכן, 16 כלים שעברו עריכה מפורסמים כעמודים סטטיים בשתי שפות—עברית ואנגלית—וההמרות שלהם רצות מקומית בדפדפן.'
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
        'Made browser-only conversion a product boundary: sensitive input and output stay on the user\'s device, and the interface explains that limit before use.',
        'Chose structured registries over manually duplicating pages, so new converter definitions can join one bilingual content and navigation model.',
        'Turned canonical URLs, hreflang, sitemap, internal links, and performance into release gates that catch delivery drift as the registry grows; they protect consistency, not traffic or revenue.'
      ],
      he: [
        'קבעתי המרה בדפדפן כגבול מוצרי: קלט ופלט רגישים נשארים במכשיר של המשתמש, והממשק מסביר את הגבול לפני השימוש.',
        'בחרתי ב־registries מובנים במקום לשכפל עמודים ידנית, כך שהגדרות ממיר חדשות יכולות להצטרף למודל תוכן וניווט דו־לשוני אחד.',
        'הפכתי canonical, ‏hreflang, ‏sitemap, קישורים פנימיים וביצועים לשערי שחרור שתופסים סטיות במסירה כשה־registry גדל; הם מגנים על עקביות, לא מוכיחים טראפיק או הכנסות.'
      ]
    },
    outcomes: [
      {
        statement: {
          en: 'The codebase holds 140 converter definitions; 16 reviewed tools are available as static pages in two languages—English and Hebrew.',
          he: 'בסיס הקוד מכיל 140 הגדרות ממיר; 16 כלים שעברו עריכה זמינים כעמודים סטטיים בשתי שפות—עברית ואנגלית.',
        },
        support: {
          kind: 'metric',
          value: '140 / 16 / 2',
          label: {
            en: '140 definitions · 16 published tools · 2 languages',
            he: '140 הגדרות · 16 כלים שפורסמו · 2 שפות',
          },
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
      en: 'Learning and practice only',
      he: 'למידה ותרגול בלבד'
    },
    seoTitle: {
      en: 'Emergency Protocol — Learning and Practice Only | Evyatar Hazan',
      he: 'Emergency Protocol — למידה ותרגול בלבד | אביתר חזן'
    },
    seoDescription: {
      en: 'Explore a BLS pathway for learning and practice only, with sign-in and discussion. Not for use during emergencies; no medical validation is claimed.',
      he: 'היכרות עם מסלול BLS ללמידה ולתרגול בלבד, עם התחברות ודיון. לא לשימוש בזמן חירום וללא טענה לאימות רפואי.'
    },
    overview: {
      en: [
        'This is a learning and practice product for studying a BLS pathway. It is not intended for use during an emergency, does not replace professional guidance, and makes no claim of medical validation.',
        'The learning challenge is to make a dense, branching protocol easier to follow, revisit, and discuss without losing track of the current step or where each decision leads.'
      ],
      he: [
        'זהו מוצר ללמידה ולתרגול של מסלול BLS. הוא אינו מיועד לשימוש בזמן חירום, אינו מחליף הנחיה מקצועית ואינו מציג טענה לאימות רפואי.',
        'הקושי הלימודי הוא לעקוב אחר פרוטוקול צפוף ומסועף, לחזור אליו ולדון בו בלי לאבד את השלב הנוכחי או את היעד של כל החלטה.'
      ]
    },
    audience: {
      en: 'Learners who want to explore and discuss a BLS pathway for learning and practice only—not emergency use.',
      he: 'לומדים שרוצים להכיר מסלול BLS ולדון בו ללמידה ולתרגול בלבד — לא לשימוש בזמן חירום.'
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
      en: 'On October 29, 2026, the live health endpoint returned HTTP 200. This proves only that the checked production health route was reachable and responded at that moment; it does not prove clinical effectiveness, emergency performance, medical safety, or medical validation. The pinned source identifies Cloudflare Pages Functions and D1 as production, while Express and Prisma remain local development only.',
      he: 'ב־29 באוקטובר 2026 נקודת הקצה החיה לבדיקת תקינות החזירה HTTP 200. הדבר מוכיח רק שנתיב התקינות שנבדק בפרודקשן היה נגיש והגיב באותו רגע; הוא אינו מוכיח יעילות קלינית, תפקוד בשעת חירום, בטיחות רפואית או אימות רפואי. המקור המקובע מזהה את Cloudflare Pages Functions ו־D1 כפרודקשן, בעוד Express ו־Prisma נשארים לפיתוח מקומי בלבד.'
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
          en: 'The evidence check verified one limited runtime fact: the production health route was reachable and returned HTTP 200 on October 29, 2026. It did not test a clinical or emergency outcome.',
          he: 'בדיקת הראיות אימתה עובדת runtime מוגבלת אחת: נתיב התקינות בפרודקשן היה נגיש והחזיר HTTP 200 ב־29 באוקטובר 2026. היא לא בדקה תוצאה קלינית או תוצאה בשעת חירום.',
        },
        support: {
          kind: 'metric',
          value: 'HTTP 200',
          label: { en: 'health-route response at evidence check', he: 'תגובת נתיב התקינות בזמן בדיקת הראיות' },
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
      en: 'Public site and branch-managed content',
      he: 'אתר ציבורי ותוכן בניהול עצמאי של הסניף'
    },
    seoTitle: {
      en: 'United Hatzalah Shoham Branch Case Study | Evyatar Hazan',
      he: 'קייס סטאדי: איחוד הצלה שוהם | אביתר חזן'
    },
    seoDescription: {
      en: 'How a public branch site and admin workflow let the Shoham team manage routine content and media without code edits, with no measured time-saving claim.',
      he: 'איך אתר סניף ציבורי וזרימת ניהול מאפשרים לצוות שוהם לערוך תוכן ומדיה שוטפים בלי שינויי קוד, ללא טענה לחיסכון בזמן שנמדד.'
    },
    overview: {
      en: [
        'When the branch needs to publish a new activity update or replace a photo, the content itself is simple—but getting it onto the public site can still become a developer task.',
        'The goal was to remove that bottleneck by pairing the public branch website with an admin workflow, so the team can manage content, media, and operational data without editing code.'
      ],
      he: [
        'כשהסניף צריך לפרסם עדכון על פעילות או להחליף תמונה, התוכן עצמו פשוט — אבל העלאתו לאתר הציבורי עדיין עלולה להפוך למשימת פיתוח.',
        'היעד היה להסיר את צוואר הבקבוק הזה באמצעות חיבור אתר הסניף הציבורי לזרימת ניהול, כדי שהצוות יוכל לנהל תוכן, מדיה ונתונים תפעוליים בלי לערוך קוד.'
      ]
    },
    audience: {
      en: 'Branch teams that need a reliable public site and an admin path for routine content and media updates.',
      he: 'צוותי סניף שצריכים אתר ציבורי אמין ונתיב ניהול לעדכוני תוכן ומדיה שוטפים.'
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
      en: 'The pinned repository documents a public website, admin workflow, and backend API as linked capabilities for publishing, routine editing, and structured content operations.',
      he: 'מאגר הקוד המקובע מתעד אתר ציבורי, זרימת ניהול ו־Backend API כיכולות מחוברות לפרסום, לעריכה שוטפת ולתפעול תוכן מובנה.'
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
        'I implemented the content and media workflow so branch stakeholders can publish routine updates without touching the codebase.',
        'I structured the data layer to keep changing nonprofit information explicit and maintainable.',
        'I treated public trust as a product constraint by separating the public experience from administrative editing.'
      ],
      he: [
        'מימשתי את זרימת התוכן והמדיה כך שבעלי העניין בסניף יוכלו לפרסם עדכונים שוטפים בלי לגעת בקוד.',
        'בניתי שכבת data מובנית כדי לשמור מידע משתנה של העמותה מפורש וניתן לתחזוקה.',
        'התייחסתי לאמון הציבורי כאילוץ מוצר באמצעות הפרדה בין החוויה הציבורית לעריכה הניהולית.'
      ]
    },
    outcomes: [
      {
        statement: {
          en: 'The public website, admin workflow, and API provide distinct capabilities to publish information, update content, and manage structured operations.',
          he: 'האתר הציבורי, זרימת הניהול וה־API מספקים יכולות נפרדות לפרסום מידע, לעדכון תוכן ולניהול פעולות מובנות.',
        },
        support: {
          kind: 'source',
          value: { en: 'Publish · update · operate', he: 'פרסום · עדכון · תפעול' },
          label: { en: 'documented delivery capabilities', he: 'יכולות מסירה מתועדות' },
          source: {
            label: { en: 'Pinned repository README', he: 'README בגרסה מקובעת' },
            url: 'https://github.com/Evyatar-Hazan/united-hatzalah-shoham-branch/tree/8b373a20d40e0dd80721e43d5fff9fe4ac78a5d3',
          },
        },
      },
      {
        statement: {
          en: 'The live public site has its own route, while the documented admin workflow keeps routine content and media updates out of code changes.',
          he: 'לאתר הציבורי החי יש נתיב משלו, וזרימת הניהול המתועדת מאפשרת לבצע עדכוני תוכן ומדיה שוטפים בלי לשנות קוד.',
        },
        support: {
          kind: 'source',
          value: { en: 'Public + admin paths', he: 'נתיבים ציבורי וניהולי' },
          label: { en: 'independent update capability', he: 'יכולת עדכון עצמאית' },
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
