import type { PortfolioLanguage } from './portfolioCapabilities';
import type { PortfolioProjectId } from './portfolioProjects';

export const PRODUCT_VISUAL_MAX_BYTES = 120_000;
export const PRODUCT_VISUAL_ROUTE_MAX_BYTES = 300_000;

type LocalizedCopy = Record<PortfolioLanguage, string>;

export type ProductVisual = {
  id: string;
  src: `/${string}`;
  width: number;
  height: number;
  byteSize: number;
  alt: LocalizedCopy;
  caption: LocalizedCopy;
  provenance: {
    kind: 'public-product-capture';
    sourceUrl: `https://${string}`;
    reviewedAt: string;
  };
};

type ProductVisualCollection = {
  heading: LocalizedCopy;
  sourceLabel: LocalizedCopy;
  visuals: readonly [ProductVisual, ProductVisual];
};

export const productVisualsByProject = {
  nis_boutique: {
    heading: { en: 'Public product views', he: 'תצוגות מוצר ציבוריות' },
    sourceLabel: { en: 'View the public product', he: 'צפייה במוצר הציבורי' },
    visuals: [
      {
        id: 'nis-public-home-desktop',
        src: '/project-nis-boutique.webp',
        width: 1440,
        height: 900,
        byteSize: 81_180,
        alt: {
          en: 'Desktop view of the public Nis Boutique Catering homepage with its catering offer and WhatsApp action',
          he: 'תצוגת דסקטופ של עמוד הבית הציבורי של Nis Boutique Catering עם הצעת הקייטרינג ופעולת WhatsApp',
        },
        caption: {
          en: 'The public desktop homepage pairs the catering offer with a direct path to a WhatsApp conversation.',
          he: 'עמוד הבית הציבורי בדסקטופ מחבר את הצעת הקייטרינג למסלול ישיר לשיחת WhatsApp.',
        },
        provenance: {
          kind: 'public-product-capture',
          sourceUrl: 'https://nisboutiquecatering.com/',
          reviewedAt: '2026-10-03',
        },
      },
      {
        id: 'nis-public-home-mobile',
        src: '/case-studies/nis-boutique/mobile-home.webp',
        width: 390,
        height: 844,
        byteSize: 28_962,
        alt: {
          en: 'Mobile view of the public Nis Boutique Catering homepage with service categories and contact actions',
          he: 'תצוגת מובייל של עמוד הבית הציבורי של Nis Boutique Catering עם קטגוריות שירות ופעולות ליצירת קשר',
        },
        caption: {
          en: 'The public mobile layout keeps the brand, service categories, and contact actions in one compact path.',
          he: 'הפריסה הציבורית במובייל שומרת את המותג, קטגוריות השירות ופעולות הקשר במסלול קומפקטי אחד.',
        },
        provenance: {
          kind: 'public-product-capture',
          sourceUrl: 'https://nisboutiquecatering.com/',
          reviewedAt: '2026-10-03',
        },
      },
    ],
  },
  online_converter: {
    heading: { en: 'Public product views', he: 'תצוגות מוצר ציבוריות' },
    sourceLabel: { en: 'View the public product', he: 'צפייה במוצר הציבורי' },
    visuals: [
      {
        id: 'converter-public-home-desktop',
        src: '/project-online-converter.webp',
        width: 1440,
        height: 900,
        byteSize: 29_318,
        alt: {
          en: 'Desktop view of the public Online Converter landing page with English and Hebrew entry points',
          he: 'תצוגת דסקטופ של עמוד הנחיתה הציבורי של Online Converter עם כניסה לכלים באנגלית ובעברית',
        },
        caption: {
          en: 'The public landing page makes the bilingual entry points and no-upload promise visible before a tool is opened.',
          he: 'עמוד הנחיתה הציבורי מציג את נקודות הכניסה הדו־לשוניות ואת הבטחת אי־ההעלאה עוד לפני פתיחת כלי.',
        },
        provenance: {
          kind: 'public-product-capture',
          sourceUrl: 'https://online-converter.evyatarhazan.com/',
          reviewedAt: '2026-10-03',
        },
      },
      {
        id: 'converter-public-home-mobile',
        src: '/case-studies/online-converter/mobile-home.webp',
        width: 390,
        height: 844,
        byteSize: 16_832,
        alt: {
          en: 'Mobile view of the public Online Converter landing page with bilingual tool buttons and the no-uploads indicator',
          he: 'תצוגת מובייל של עמוד הנחיתה הציבורי של Online Converter עם כפתורי כלים דו־לשוניים ומדד ללא העלאות',
        },
        caption: {
          en: 'The public mobile layout preserves both language choices and the privacy message in a single-column flow.',
          he: 'הפריסה הציבורית במובייל שומרת את שתי אפשרויות השפה ואת מסר הפרטיות בזרימה של עמודה אחת.',
        },
        provenance: {
          kind: 'public-product-capture',
          sourceUrl: 'https://online-converter.evyatarhazan.com/',
          reviewedAt: '2026-10-03',
        },
      },
    ],
  },
  emergency_protocol: {
    heading: { en: 'Public learning-product views', he: 'תצוגות ציבוריות של מוצר הלמידה' },
    sourceLabel: { en: 'View the public learning product', he: 'צפייה במוצר הלמידה הציבורי' },
    visuals: [
      {
        id: 'protocol-public-path-desktop',
        src: '/project-emergency-protocol.webp',
        width: 1440,
        height: 900,
        byteSize: 35_100,
        alt: {
          en: 'Desktop view of the public BLS learning tool showing one practice step, guidance, and review questions',
          he: 'תצוגת דסקטופ של כלי הלמידה הציבורי למסלול BLS עם שלב תרגול, הנחיות ושאלות חזרה',
        },
        caption: {
          en: 'The public interface presents one learning-and-practice step with guidance and questions; it is not emergency or medical guidance.',
          he: 'הממשק הציבורי מציג שלב למידה ותרגול עם הנחיות ושאלות; הוא אינו הנחיה לשעת חירום או ייעוץ רפואי.',
        },
        provenance: {
          kind: 'public-product-capture',
          sourceUrl: 'https://bls-protocol.evyatarhazan.com/',
          reviewedAt: '2026-10-03',
        },
      },
      {
        id: 'protocol-public-path-mobile',
        src: '/case-studies/emergency-protocol/mobile-path.webp',
        width: 390,
        height: 844,
        byteSize: 18_378,
        alt: {
          en: 'Mobile view of the public BLS learning tool with the current practice step and supporting questions',
          he: 'תצוגת מובייל של כלי הלמידה הציבורי למסלול BLS עם שלב התרגול הנוכחי ושאלות תומכות',
        },
        caption: {
          en: 'The public mobile layout preserves the step-by-step learning context without exposing accounts, comments, or user data.',
          he: 'הפריסה הציבורית במובייל שומרת את הקשר הלמידה המדורג בלי לחשוף חשבונות, תגובות או נתוני משתמשים.',
        },
        provenance: {
          kind: 'public-product-capture',
          sourceUrl: 'https://bls-protocol.evyatarhazan.com/',
          reviewedAt: '2026-10-03',
        },
      },
    ],
  },
} as const satisfies Partial<Record<PortfolioProjectId, ProductVisualCollection>>;

export type ProductVisualProjectId = keyof typeof productVisualsByProject;

export const getProductVisualCollection = (projectId: PortfolioProjectId) => (
  projectId in productVisualsByProject
    ? productVisualsByProject[projectId as ProductVisualProjectId]
    : null
);
