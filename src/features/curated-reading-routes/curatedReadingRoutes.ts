import { blogPostMetadataByKey } from '../../content/blog/metadata';
import type { PortfolioContentRef, ProjectId } from '../../contracts/portfolio';
import type { PortfolioLanguage } from '../../data/portfolioCapabilities';
import { projects } from '../../data/profile';

type LocalizedText = Record<PortfolioLanguage, string>;

export const curatedReadingRouteIds = [
  'reliability-data',
  'browser-privacy',
  'shipping-product',
] as const;

export type CuratedReadingRouteId = (typeof curatedReadingRouteIds)[number];
export type ReadingRouteContentRef = Extract<
  PortfolioContentRef,
  { kind: 'article' | 'project' }
>;

export type CuratedReadingRouteItem = {
  ref: ReadingRouteContentRef;
  rationale: LocalizedText;
};

export type CuratedReadingRoute = {
  id: CuratedReadingRouteId;
  title: LocalizedText;
  rationale: LocalizedText;
  items: readonly CuratedReadingRouteItem[];
};

/**
 * Human-curated, deterministic reading sequences. Stable content identifiers
 * are shared with Tasks 07 and 09; localized labels and URLs are resolved by
 * their canonical registries at render time.
 */
export const curatedReadingRoutes = [
  {
    id: 'reliability-data',
    title: { en: 'Reliability and data', he: 'אמינות ונתונים' },
    rationale: {
      en: 'Follow a failure from one malformed field through data integrity and honest verification, then see those disciplines applied to a larger operational system.',
      he: 'עקבו אחר כשל משדה פגום אחד, דרך שלמות נתונים ואימות אמין, ועד ליישום העקרונות האלה במערכת תפעולית גדולה יותר.',
    },
    items: [
      {
        ref: { kind: 'article', id: 'one-bad-date-should-not-blank-a-screen' },
        rationale: {
          en: 'Start with the smallest useful reliability boundary: contain one bad value instead of losing the whole task.',
          he: 'מתחילים בגבול האמינות הקטן והשימושי ביותר: לבודד ערך פגום במקום לאבד את המשימה כולה.',
        },
      },
      {
        ref: { kind: 'article', id: 'retries-should-not-duplicate-data' },
        rationale: {
          en: 'Move from display failures to data guarantees, where retrying an intent must not create duplicate state.',
          he: 'עוברים מכשלי תצוגה להבטחות נתונים, שבהן ניסיון חוזר על כוונה אינו יוצר מצב כפול.',
        },
      },
      {
        ref: { kind: 'article', id: 'tests-need-honest-environments' },
        rationale: {
          en: 'Add the proof layer: a passing test is useful only when its environment tells the truth about what ran.',
          he: 'מוסיפים את שכבת ההוכחה: בדיקה שעוברת מועילה רק כשהסביבה שלה מספרת בכנות מה באמת רץ.',
        },
      },
      {
        ref: { kind: 'project', id: 'emergency_protocol' },
        rationale: {
          en: 'Finish with a full-stack case where structured data, permissions, and validation support complex operational knowledge.',
          he: 'מסיימים בקייס Full Stack שבו נתונים מובנים, הרשאות ואימות תומכים בידע תפעולי מורכב.',
        },
      },
    ],
  },
  {
    id: 'browser-privacy',
    title: { en: 'Browser privacy', he: 'פרטיות בדפדפן' },
    rationale: {
      en: 'Start with a product that keeps data in the browser, then trace how measurement, discovery, and monetization can respect that promise.',
      he: 'מתחילים במוצר ששומר את הנתונים בדפדפן, ואז בוחנים כיצד מדידה, גילוי ומונטיזציה יכולים לכבד את ההבטחה הזאת.',
    },
    items: [
      {
        ref: { kind: 'project', id: 'online_converter' },
        rationale: {
          en: 'Start with the product promise: convert common formats without sending the content to an external server.',
          he: 'מתחילים בהבטחת המוצר: להמיר פורמטים נפוצים בלי לשלוח את התוכן לשרת חיצוני.',
        },
      },
      {
        ref: { kind: 'article', id: 'privacy-safe-product-analytics' },
        rationale: {
          en: 'Separate useful product measurement from reading the private content being processed.',
          he: 'מפרידים בין מדידת מוצר שימושית לבין קריאת התוכן הפרטי שמעובד בו.',
        },
      },
      {
        ref: { kind: 'article', id: 'seo-discovery-is-product-work' },
        rationale: {
          en: 'See how structured discovery and internal links can grow usefulness without profiling a visitor.',
          he: 'רואים כיצד גילוי מובנה וקישורים פנימיים יכולים להרחיב שימושיות בלי לבנות פרופיל של המבקר.',
        },
      },
      {
        ref: { kind: 'article', id: 'monetization-needs-product-guardrails' },
        rationale: {
          en: 'Finish at the business boundary, where revenue goals need explicit rules that preserve navigation, content, and trust.',
          he: 'מסיימים בגבול העסקי, שבו יעדי הכנסה צריכים כללים מפורשים ששומרים על ניווט, תוכן ואמון.',
        },
      },
    ],
  },
  {
    id: 'shipping-product',
    title: { en: 'Shipping a product', he: 'להוציא מוצר לאוויר' },
    rationale: {
      en: 'Move from a focused customer outcome through architecture and real URLs to the final discipline of treating deployment as product work.',
      he: 'מתקדמים מתוצאה ממוקדת ללקוח, דרך ארכיטקטורה וכתובות אמיתיות, ועד למשמעת הסופית של התייחסות לפריסה כחלק מעבודת המוצר.',
    },
    items: [
      {
        ref: { kind: 'article', id: 'catering-whatsapp' },
        rationale: {
          en: 'Start by defining the outcome around one useful customer action instead of accumulating features.',
          he: 'מתחילים בהגדרת התוצאה סביב פעולה שימושית אחת של הלקוח, במקום לצבור פיצ׳רים.',
        },
      },
      {
        ref: { kind: 'project', id: 'nis_boutique' },
        rationale: {
          en: 'Inspect the live business case that connects positioning, evidence, and a direct inquiry path.',
          he: 'בוחנים את הקייס העסקי החי שמחבר בין מיצוב, הוכחות ומסלול ישיר לפנייה.',
        },
      },
      {
        ref: { kind: 'article', id: 'small-project-architecture' },
        rationale: {
          en: 'Give a small product clear boundaries so it stays understandable as content and behavior expand.',
          he: 'נותנים למוצר קטן גבולות ברורים כדי שיישאר מובן כשהתוכן וההתנהגות מתרחבים.',
        },
      },
      {
        ref: { kind: 'article', id: 'spa-routes-need-real-http' },
        rationale: {
          en: 'Turn client-side screens into public URLs that work for direct visits, crawlers, and link previews.',
          he: 'הופכים מסכי צד לקוח לכתובות ציבוריות שעובדות בכניסה ישירה, לסורקים ולתצוגות מקדימות של קישורים.',
        },
      },
      {
        ref: { kind: 'article', id: 'deployment-is-product' },
        rationale: {
          en: 'Finish with delivery itself: a product is not complete until people can reliably reach and use it.',
          he: 'מסיימים במסירה עצמה: מוצר אינו שלם עד שאנשים יכולים להגיע אליו ולהשתמש בו באופן אמין.',
        },
      },
    ],
  },
] as const satisfies readonly CuratedReadingRoute[];

const refKey = (ref: ReadingRouteContentRef) => `${ref.kind}:${ref.id}`;
const localizedValuesArePresent = (copy: LocalizedText) =>
  copy.en.trim().length > 0 && copy.he.trim().length > 0;

const caseStudyProjectIds = new Set<ProjectId>(
  projects.filter((project) => project.caseStudy).map((project) => project.id as ProjectId),
);

export const getCuratedReadingRouteErrors = (
  routes: readonly CuratedReadingRoute[] = curatedReadingRoutes,
) => {
  const errors: string[] = [];
  const seenRouteIds = new Set<string>();

  if (routes.length !== curatedReadingRouteIds.length) {
    errors.push(`Expected ${curatedReadingRouteIds.length} curated reading routes; received ${routes.length}.`);
  }

  for (const route of routes) {
    if (seenRouteIds.has(route.id)) errors.push(`${route.id}: duplicate route id.`);
    seenRouteIds.add(route.id);

    if (!localizedValuesArePresent(route.title)) errors.push(`${route.id}: missing localized title.`);
    if (!localizedValuesArePresent(route.rationale)) errors.push(`${route.id}: missing localized rationale.`);
    if (route.items.length < 3) errors.push(`${route.id}: a reading route needs at least three steps.`);

    const seenRefs = new Set<string>();
    for (const item of route.items) {
      const key = refKey(item.ref);
      if (seenRefs.has(key)) errors.push(`${route.id}: duplicate item ${key}.`);
      seenRefs.add(key);

      if (!localizedValuesArePresent(item.rationale)) {
        errors.push(`${route.id}:${key}: missing localized rationale.`);
      }

      if (item.ref.kind === 'article') {
        for (const language of ['en', 'he'] as const) {
          if (!(`${item.ref.id}:${language}` in blogPostMetadataByKey)) {
            errors.push(`${route.id}:${key}: missing ${language} article metadata.`);
          }
        }
      } else if (!caseStudyProjectIds.has(item.ref.id)) {
        errors.push(`${route.id}:${key}: project must have a published case study.`);
      }
    }
  }

  for (const routeId of curatedReadingRouteIds) {
    if (!seenRouteIds.has(routeId)) errors.push(`${routeId}: required route is missing.`);
  }

  return errors;
};

export const assertCuratedReadingRoutes = (
  routes: readonly CuratedReadingRoute[] = curatedReadingRoutes,
) => {
  const errors = getCuratedReadingRouteErrors(routes);
  if (errors.length > 0) {
    throw new Error(`Curated reading route contract failed:\n${errors.join('\n')}`);
  }
};

assertCuratedReadingRoutes();

export type ReadingRouteMembership = {
  routeId: CuratedReadingRouteId;
  step: number;
  totalSteps: number;
};

/** Item-level integration point for Task 07. */
export const getReadingRouteMemberships = (
  ref: ReadingRouteContentRef,
): readonly ReadingRouteMembership[] => {
  const key = refKey(ref);
  return curatedReadingRoutes.flatMap((route) => {
    const index = route.items.findIndex((item) => refKey(item.ref) === key);
    return index < 0
      ? []
      : [{ routeId: route.id, step: index + 1, totalSteps: route.items.length }];
  });
};
