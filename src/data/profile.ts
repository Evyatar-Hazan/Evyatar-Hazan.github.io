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
  proof: LocalizedText;
  decisions: LocalizedList;
  outcomes: LocalizedList;
};

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

const caseStudies: Partial<Record<string, ProjectCaseStudy>> = {
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
    proof: {
      en: 'The live site is deployed on a custom domain, keeps the CTA visible, and frames the business around a direct conversation instead of generic filler.',
      he: 'האתר החי יושב על דומיין מותאם, שומר על CTA גלוי, ומציג את העסק סביב שיחה ישירה במקום סביב טקסט גנרי.'
    },
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
    outcomes: {
      en: [
        'A stronger first impression for referrals and direct traffic.',
        'A reusable content structure that can grow without rewriting the whole site.',
        'A clearer conversion story that matches how the business actually closes leads.'
      ],
      he: [
        'רושם ראשוני חזק יותר עבור הפניות ותנועה ישירה.',
        'מבנה תוכן שניתן להרחיב בלי לכתוב מחדש את כל האתר.',
        'סיפור המרה ברור יותר שמתאים לאופן שבו העסק באמת סוגר לידים.'
      ]
    }
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
    proof: {
      en: 'The live product now includes a large bilingual converter registry, analytics dashboard, SEO build checks, and production smoke validation.',
      he: 'המוצר החי כולל היום מאגר ממירים דו-לשוני גדול, דשבורד אנליטיקה, בדיקות SEO בבילד ואימות production רציף.'
    },
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
    outcomes: {
      en: [
        'A much broader search surface without giving up the fast client-side experience.',
        'A content model that supports ongoing expansion instead of hand-building each tool page.',
        'A stronger base for organic traffic and future ad monetization.'
      ],
      he: [
        'משטח חיפוש רחב הרבה יותר בלי לוותר על חוויית client-side מהירה.',
        'מודל תוכן שמאפשר להרחיב את המוצר לאורך זמן בלי לבנות כל עמוד ידנית.',
        'בסיס חזק יותר לטראפיק אורגני ולמונטיזציה עתידית מפרסומות.'
      ]
    }
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
      en: 'How I turned a complex emergency protocol into a structured full-stack workspace with auth, comments, and maintainable flows.',
      he: 'איך הפכתי פרוטוקול חירום מורכב למרחב עבודה Full Stack מסודר עם אימות, תגובות וזרימות תחזוקה.'
    },
    overview: {
      en: [
        'This project is about taking information that normally lives as a hard-to-read document and reshaping it into a product people can navigate, discuss, and maintain.',
        'The core value is not only the diagram itself. It is the shift from static documentation toward a permissioned workflow with clear ownership and iteration paths.'
      ],
      he: [
        'הפרויקט הזה עוסק בלקחת מידע שבדרך כלל חי כמסמך קשה לקריאה ולהפוך אותו למוצר שאנשים יכולים לנווט בו, לדון בו ולתחזק אותו.',
        'הערך המרכזי הוא לא רק הדיאגרמה עצמה, אלא המעבר מתיעוד סטטי ל-workflow עם הרשאות, בעלות ברורה ויכולת איטרציה.'
      ]
    },
    audience: {
      en: 'Teams that need to understand, update, and discuss complex operational logic instead of leaving it trapped in a static file.',
      he: 'צוותים שצריכים להבין, לעדכן ולדון בלוגיקה תפעולית מורכבת במקום להשאיר אותה כלואה בקובץ סטטי.'
    },
    proof: {
      en: 'The live system combines a React client, Express API, Prisma models, Google OAuth, and collaborative layers such as comments and user handling.',
      he: 'המערכת החיה משלבת לקוח React, שרת Express, מודלי Prisma, Google OAuth ושכבות שיתופיות כמו תגובות וניהול משתמשים.'
    },
    decisions: {
      en: [
        'Separated client, API, auth, and data responsibilities so future protocol changes do not collapse into one fragile layer.',
        'Focused on interaction clarity because the product only matters if users can actually follow the protocol path under pressure.',
        'Added maintainable backend structure so collaboration features remain grounded in clear models rather than ad hoc state.'
      ],
      he: [
        'הפרדתי בין אחריות של client, API, auth ו-data כדי ששינויים עתידיים בפרוטוקול לא יקרסו לשכבה שבירה אחת.',
        'התמקדתי בבהירות האינטראקציה, כי המוצר חשוב רק אם משתמשים באמת יכולים לעקוב אחרי הנתיב גם תחת לחץ.',
        'הוספתי מבנה backend תחזוקתי כדי שפיצ׳רי שיתוף יישבו על מודלים ברורים ולא על state מאולתר.'
      ]
    },
    outcomes: {
      en: [
        'A clearer operational surface than a raw protocol document.',
        'A system that can support discussion, permissions, and future updates.',
        'A concrete example of product thinking inside a full-stack workflow.'
      ],
      he: [
        'משטח עבודה תפעולי ברור יותר ממסמך פרוטוקול גולמי.',
        'מערכת שיכולה לתמוך בדיון, הרשאות ועדכונים עתידיים.',
        'דוגמה מוחשית לחשיבה מוצרית בתוך workflow של Full Stack.'
      ]
    }
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
    proof: {
      en: 'The project combines React, Express, Prisma, Cloudinary, and structured deployment so the public layer and admin layer can move together.',
      he: 'הפרויקט משלב React, Express, Prisma, Cloudinary ופריסה מסודרת, כך שהשכבה הציבורית והשכבה הניהולית יכולות להתקדם יחד.'
    },
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
    outcomes: {
      en: [
        'A more maintainable branch website and admin flow.',
        'Less dependency on developers for simple operational updates.',
        'A stronger foundation for future branch content and media growth.'
      ],
      he: [
        'אתר סניף וזרימת ניהול תחזוקתיים יותר.',
        'פחות תלות במפתחים עבור עדכונים תפעוליים פשוטים.',
        'בסיס חזק יותר לצמיחה עתידית של תוכן ומדיה בסניף.'
      ]
    }
  }
};

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
    tags: ['React', 'Express', 'Prisma', 'Google OAuth', 'CI'],
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
