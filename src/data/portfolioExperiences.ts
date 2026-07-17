import type { LocalizedList, LocalizedText } from './profile';

export type ProjectExperience = {
  category: LocalizedText;
  lead: LocalizedText;
  problem: LocalizedText;
  productDecision: LocalizedText;
  userJourney: LocalizedList;
  systemDecision: LocalizedText;
  publishingFlow: LocalizedList;
  tradeoffs: LocalizedList;
  contribution: LocalizedList;
  outcome: LocalizedText;
  relatedWritingPath: string;
};

export const portfolioExperiences: Partial<Record<string, ProjectExperience>> = {
  nis_boutique: {
    category: {
      en: 'Business & Conversion',
      he: 'עסק והמרה'
    },
    lead: {
      en: 'A live catering experience built to turn appetite, trust, and fit into one clear conversation.',
      he: 'חוויית קייטרינג חיה שנבנתה כדי להפוך תיאבון, אמון והתאמה לשיחה אחת ברורה.'
    },
    problem: {
      en: 'A local service business needs to communicate quality, build trust, and lead to a clear inquiry without burying visitors in clutter or price lists.',
      he: 'עסק שירות מקומי צריך להציג איכות, לבנות אמון ולהוביל לפנייה ברורה — בלי לקבור את המבקרים בעומס או במחירונים.'
    },
    productDecision: {
      en: 'Make WhatsApp the primary conversion path, then use hierarchy, real food media, service framing, and practical answers to support that single action.',
      he: 'להגדיר את WhatsApp כנתיב ההמרה הראשי, ואז להשתמש בהיררכיה, במדיית אוכל אמיתית, במסגור השירות ובתשובות מעשיות כדי לתמוך בפעולה אחת.'
    },
    userJourney: {
      en: [
        'Introduce the service and visual promise.',
        'Build confidence with real food, service options, and practical answers.',
        'Keep a direct WhatsApp action within reach.'
      ],
      he: [
        'מציגים את השירות ואת ההבטחה החזותית.',
        'בונים ביטחון בעזרת אוכל אמיתי, אפשרויות שירות ותשובות מעשיות.',
        'שומרים פעולה ישירה ל־WhatsApp בהישג יד.'
      ]
    },
    systemDecision: {
      en: 'Keep the public experience fast and static, while a private Content Studio uses Google Sheets and Drive as structured sources with a shared schema and controlled CI publishing.',
      he: 'לשמור את החוויה הציבורית מהירה וסטטית, בזמן ש־Content Studio פרטי משתמש ב־Google Sheets וב־Drive כמקורות מובנים עם schema משותף ופרסום מבוקר דרך CI.'
    },
    publishingFlow: {
      en: [
        'Save a draft in the private studio.',
        'Publish validated content.',
        'Build a static snapshot in CI.',
        'Deploy the public site on Cloudflare Pages.'
      ],
      he: [
        'שומרים טיוטה ב־Studio הפרטי.',
        'מפרסמים תוכן שעבר אימות.',
        'בונים snapshot סטטי דרך CI.',
        'פורסים את האתר הציבורי ב־Cloudflare Pages.'
      ]
    },
    tradeoffs: {
      en: [
        'A focused inquiry path instead of feature and pricing clutter.',
        'No instant browser-to-production publish; validation, rollback, and a clear boundary between editing and production take priority.'
      ],
      he: [
        'נתיב פנייה ממוקד במקום עומס של פיצ׳רים ומחירים.',
        'אין פרסום מיידי מהדפדפן לפרודקשן; אימות, rollback וגבול ברור בין עריכה לפרודקשן קודמים למהירות.'
      ]
    },
    contribution: {
      en: [
        'Discovery and conversion framing',
        'Copy, UX, and RTL interface design',
        'Content architecture and the editing-to-publishing workflow',
        'Testing and deployment'
      ],
      he: [
        'מחקר ומסגור ההמרה',
        'קופי, חוויית משתמש ועיצוב ממשק RTL',
        'ארכיטקטורת תוכן ותהליך מעריכה לפרסום',
        'בדיקות ופריסה'
      ]
    },
    outcome: {
      en: 'A live site on a custom domain, with an owner workflow for managing drafts and content without turning every update into manual code work.',
      he: 'אתר חי בדומיין מותאם, עם תהליך שמאפשר לבעלת העסק לנהל טיוטות ותוכן בלי להפוך כל עדכון לעבודת קוד ידנית.'
    },
    relatedWritingPath: '/blog/catering-whatsapp/'
  },
  online_converter: {
    category: {
      en: 'Growth & Discovery',
      he: 'צמיחה וגילוי'
    },
    lead: {
      en: 'A privacy-first browser utility turned into a bilingual discovery system with 124 useful entry points.',
      he: 'כלי דפדפן שומר פרטיות שהפך למערכת גילוי דו־לשונית עם 124 נקודות כניסה שימושיות.'
    },
    problem: {
      en: 'A useful converter is easy to build and hard to discover. The product needed to scale across tools and languages without duplicating pages or weakening trust.',
      he: 'קל לבנות ממיר שימושי וקשה לגרום לאנשים למצוא אותו. המוצר היה צריך לצמוח בין כלים ושפות בלי לשכפל עמודים ובלי להחליש אמון.'
    },
    productDecision: {
      en: 'Treat SEO as product architecture: one typed registry drives bilingual tool pages, categories, metadata, related paths, examples, and quality checks.',
      he: 'להתייחס ל־SEO כארכיטקטורת מוצר: registry טיפוסי אחד מניע עמודי כלים דו־לשוניים, קטגוריות, metadata, מסלולים קשורים, דוגמאות ובדיקות איכות.'
    },
    userJourney: {
      en: [
        'Arrive from a precise search intent.',
        'Convert locally in the browser without uploading the input.',
        'Continue through related tools and bilingual category paths.'
      ],
      he: [
        'מגיעים מתוך כוונת חיפוש מדויקת.',
        'ממירים מקומית בדפדפן בלי להעלות את הקלט.',
        'ממשיכים לכלים קשורים ולמסלולי קטגוריה דו־לשוניים.'
      ]
    },
    systemDecision: {
      en: 'Generate static Astro pages for every tool and category, hydrate only the React converter island, and guard canonical, hreflang, sitemap, links, and performance in the build.',
      he: 'לייצר עמודי Astro סטטיים לכל כלי וקטגוריה, להפעיל בצד לקוח רק את אי ה־React של הממיר, ולשמור על canonical, hreflang, sitemap, קישורים וביצועים כחלק מה־build.'
    },
    publishingFlow: {
      en: [
        'Register one typed converter definition.',
        'Generate English and Hebrew static routes.',
        'Run unit, SEO, and browser checks.',
        'Deploy the verified dist to Cloudflare Pages.'
      ],
      he: [
        'רושמים הגדרת ממיר טיפוסית אחת.',
        'מייצרים נתיבים סטטיים באנגלית ובעברית.',
        'מריצים בדיקות יחידה, SEO ודפדפן.',
        'פורסים את ה־dist המאומת ל־Cloudflare Pages.'
      ]
    },
    tradeoffs: {
      en: [
        'Registry discipline instead of hand-authored freedom on every page.',
        'Action analytics without collecting the private content users convert.'
      ],
      he: [
        'משמעת של registry במקום חופש ידני בכל עמוד.',
        'אנליטיקה של פעולות בלי לאסוף את התוכן הפרטי שהמשתמשים ממירים.'
      ]
    },
    contribution: {
      en: [
        'Product and information architecture',
        'Converter registry and bilingual content model',
        'Privacy-safe interaction and analytics boundaries',
        'SEO, testing, and Cloudflare deployment gates'
      ],
      he: [
        'חשיבת מוצר וארכיטקטורת מידע',
        'Registry של ממירים ומודל תוכן דו־לשוני',
        'אינטראקציה שומרת פרטיות וגבולות אנליטיקה',
        'שערי SEO, בדיקות ופריסה ל־Cloudflare'
      ]
    },
    outcome: {
      en: 'A live Astro product with 124 bilingual tools, static discovery surfaces, local conversion, and repeatable quality gates.',
      he: 'מוצר Astro חי עם 124 כלים דו־לשוניים, משטחי גילוי סטטיים, המרה מקומית ושערי איכות שניתן להריץ שוב.'
    },
    relatedWritingPath: '/blog/seo-discovery-is-product-work/'
  },
  emergency_protocol: {
    category: {
      en: 'Complexity & Learning',
      he: 'מורכבות ולמידה'
    },
    lead: {
      en: 'A dense emergency protocol reshaped into a Hebrew-first, step-by-step learning and discussion surface.',
      he: 'פרוטוקול חירום צפוף שעוצב מחדש כמרחב למידה ודיון מדורג, בעברית תחילה.'
    },
    problem: {
      en: 'A static protocol document makes complex branching logic difficult to scan, learn, discuss, and maintain—especially on a phone.',
      he: 'מסמך פרוטוקול סטטי מקשה לסרוק, ללמוד, לדון ולתחזק לוגיקה מסועפת — במיוחד בטלפון.'
    },
    productDecision: {
      en: 'Make the next decision legible. Reveal the protocol step by step, preserve clinical context, and keep community discussion secondary to the learning flow.',
      he: 'להפוך את ההחלטה הבאה לברורה. לחשוף את הפרוטוקול שלב אחר שלב, לשמור הקשר קליני ולהשאיר את הדיון הקהילתי משני לזרימת הלמידה.'
    },
    userJourney: {
      en: [
        'Choose a scenario and orient around the current state.',
        'Follow one decision at a time with supporting vital-sign context.',
        'Open discussion only when clarification or collaboration is useful.'
      ],
      he: [
        'בוחרים תרחיש ומתמקמים במצב הנוכחי.',
        'עוקבים אחרי החלטה אחת בכל פעם עם הקשר תומך של מדדים חיוניים.',
        'פותחים דיון רק כשנדרשים הבהרה או שיתוף פעולה.'
      ]
    },
    systemDecision: {
      en: 'Keep protocol content in maintainable structured sources, serve the learning client statically, and use Cloudflare Pages Functions with D1 for live comments, likes, views, and health checks.',
      he: 'לשמור את תוכן הפרוטוקול במקורות מובנים ותחזוקתיים, להגיש את לקוח הלמידה סטטית, ולהשתמש ב־Cloudflare Pages Functions עם D1 לתגובות, לייקים, צפיות ובדיקות תקינות.'
    },
    publishingFlow: {
      en: [
        'Update and validate structured protocol content.',
        'Build the React learning client and API workspace.',
        'Mirror the client output to the Pages dist.',
        'Serve production collaboration through Functions and D1.'
      ],
      he: [
        'מעדכנים ומאמתים תוכן פרוטוקול מובנה.',
        'בונים את לקוח הלמידה ב־React ואת סביבת ה־API.',
        'משקפים את פלט הלקוח ל־dist של Pages.',
        'מגישים את שכבת השיתוף בפרודקשן דרך Functions ו־D1.'
      ]
    },
    tradeoffs: {
      en: [
        'Guided learning clarity instead of exposing the entire diagram at once.',
        'Production Functions + D1 coexist with an Express + Prisma local workspace, so parity is explicitly tested and documented.'
      ],
      he: [
        'בהירות של למידה מודרכת במקום חשיפת כל הדיאגרמה בבת אחת.',
        'Functions + D1 בפרודקשן מתקיימים לצד סביבת Express + Prisma מקומית, ולכן parity נבדק ומתועד במפורש.'
      ]
    },
    contribution: {
      en: [
        'Learning-flow and interaction design',
        'Hebrew-first responsive product interface',
        'Structured protocol and community architecture',
        'Production Functions, D1, testing, and deployment'
      ],
      he: [
        'עיצוב זרימת למידה ואינטראקציה',
        'ממשק מוצר רספונסיבי בעברית תחילה',
        'ארכיטקטורת פרוטוקול ושכבת קהילה',
        'Functions, D1, בדיקות ופריסה לפרודקשן'
      ]
    },
    outcome: {
      en: 'A live learning workspace that makes branching protocol logic easier to follow and supports production discussion through Cloudflare Functions and D1.',
      he: 'סביבת למידה חיה שמקלה לעקוב אחרי לוגיקה מסועפת ותומכת בדיון חי דרך Cloudflare Functions ו־D1.'
    },
    relatedWritingPath: '/blog/small-project-architecture/'
  }
};
