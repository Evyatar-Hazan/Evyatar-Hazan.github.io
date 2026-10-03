import type { CaseStudyEvidence } from '../../data/caseStudyEvidence';
import type { PortfolioLanguage } from '../../data/portfolioCapabilities';
import type {
  PortfolioSlotId,
  PortfolioTaskId,
  ProjectId,
} from '../../contracts/portfolio';

export const AI_PROVENANCE_TASK_ID = 't14' satisfies PortfolioTaskId;
export const AI_PROVENANCE_SLOT_ID = 'content.aiProvenance' satisfies PortfolioSlotId;
export const AI_PROVENANCE_PROJECT_ID = 'nis_boutique' satisfies ProjectId;

export type AiProvenanceMode = 'short' | 'full';

export type AiProvenanceItemId =
  | 'assistance'
  | 'humanChecks'
  | 'corrections'
  | 'limitations';

type LocalizedCopy = Record<PortfolioLanguage, string>;

export type AiProvenanceItem = {
  id: AiProvenanceItemId;
  label: LocalizedCopy;
  short: LocalizedCopy;
  full: LocalizedCopy;
};

export const aiProvenanceEvidence = {
  evidenceStatus: 'verified',
  verifiedAt: '2026-07-22',
  evidenceLinks: [
    {
      label: {
        en: 'Production cutover record',
        he: 'תיעוד המעבר לפרודקשן',
      },
      url: 'https://github.com/Evyatar-Hazan/nis-boutique-catering/blob/main/migration/legacy-google/20260720T080523Z/production-cutover-checklist.md',
    },
    {
      label: {
        en: 'Implementation and verification tracker',
        he: 'מעקב המימוש והאימות',
      },
      url: 'https://github.com/Evyatar-Hazan/nis-boutique-catering/blob/main/docs/public-site-redesign-tracker.md',
    },
  ],
} as const satisfies CaseStudyEvidence;

export const aiProvenanceCopy = {
  eyebrow: {
    en: 'AI provenance / documented work',
    he: 'שקיפות AI / עבודה מתועדת',
  },
  title: {
    en: 'Where AI assisted—and where human control stayed essential',
    he: 'איפה AI סייע—ואיפה נשארה שליטה אנושית הכרחית',
  },
  introduction: {
    en: 'This disclosure covers the documented migration and release work from July 20–22, 2026. It does not describe every part of the project.',
    he: 'הגילוי הזה מתייחס לעבודת ההגירה והשחרור המתועדת מ־20–22 ביולי 2026. הוא אינו מתאר כל חלק בפרויקט.',
  },
  projectLink: {
    en: 'Read the Nis Boutique Catering case study',
    he: 'לקריאת הקייס סטאדי של Nis Boutique Catering',
  },
  evidence: {
    sources: {
      en: 'Public evidence sources',
      he: 'מקורות ראיה ציבוריים',
    },
    verifiedOn: {
      en: 'Evidence documented through',
      he: 'הראיות מתועדות עד',
    },
    unknown: {
      en: 'Public verification is not documented.',
      he: 'אימות ציבורי אינו מתועד.',
    },
  },
} as const;

export const aiProvenanceItems = [
  {
    id: 'assistance',
    label: {
      en: 'What AI assisted with',
      he: 'במה AI סייע',
    },
    short: {
      en: 'Codex assisted with the authorized content migration, validation, browser checks, production verification, and rollback preparation.',
      he: 'Codex סייע בהגירת התוכן שאושרה, באימות, בבדיקות דפדפן, באימות פרודקשן ובהכנת חזרה לאחור.',
    },
    full: {
      en: 'Codex executed the owner-authorized migration plan from the legacy Google content workflow to Cloudflare D1 and R2. The documented work included guarded import runs, parity checks, browser smoke tests, production verification, cleanup, and rollback preparation.',
      he: 'Codex ביצע את תוכנית ההגירה שאישר בעל הפרויקט, מתהליך התוכן הישן של Google אל Cloudflare D1 ו־R2. העבודה המתועדת כללה ייבוא מוגן, בדיקות התאמה, בדיקות דפדפן, אימות פרודקשן, ניקוי והכנת rollback.',
    },
  },
  {
    id: 'humanChecks',
    label: {
      en: 'Human control and checks',
      he: 'שליטה ובדיקות אנושיות',
    },
    short: {
      en: 'The owner approved execution; infrastructure activation stayed human-gated, and direct feedback changed the gallery and motion direction.',
      he: 'בעל הפרויקט אישר את הביצוע; הפעלת התשתית נשארה מאחורי אישור אנושי, ומשוב ישיר שינה את כיוון הגלריה והתנועה.',
    },
    full: {
      en: 'The project owner explicitly authorized the execution scope. R2 activation remained blocked until separate human approval, and later user feedback requested removing the gallery video and strengthening the scroll motion before that direction moved forward.',
      he: 'בעל הפרויקט אישר במפורש את ההיקף לביצוע. הפעלת R2 נשארה חסומה עד לאישור אנושי נפרד, ובהמשך משוב המשתמש ביקש להסיר את סרטון הגלריה ולחזק את אנימציית הגלילה לפני המשך הכיוון.',
    },
  },
  {
    id: 'corrections',
    label: {
      en: 'Corrections made after verification',
      he: 'תיקונים שבוצעו לאחר אימות',
    },
    short: {
      en: 'Verification exposed stale draft state, keyboard-focus gaps, fast-scroll reveal failures, and mobile CTA overlap; each received a targeted fix and regression coverage.',
      he: 'האימות חשף טיוטה לא מעודכנת, פערי focus במקלדת, כשלי reveal בגלילה מהירה וחפיפת CTA במובייל; כל אחד קיבל תיקון ממוקד וכיסוי רגרסיה.',
    },
    full: {
      en: 'The recorded checks found and corrected stale draft state between save and publish, keyboard-focus problems, reveal elements that could remain hidden after a fast scroll jump, and a mobile sticky CTA that obscured the final link. The tracker records targeted fixes, regression tests, and repeated browser verification.',
      he: 'הבדיקות המתועדות מצאו ותיקנו מצב טיוטה לא מעודכן בין save ל־publish, בעיות focus במקלדת, אלמנטי reveal שיכלו להישאר מוסתרים אחרי קפיצת גלילה מהירה, ו־CTA דביק במובייל שהסתיר את הקישור האחרון. המעקב מתעד תיקונים ממוקדים, בדיקות רגרסיה ואימות חוזר בדפדפן.',
    },
  },
  {
    id: 'limitations',
    label: {
      en: 'Remaining limitations',
      he: 'מגבלות שנשארו',
    },
    short: {
      en: 'The records do not establish a model/version, prompt history, AI-authored code percentage, or independent human review of every change.',
      he: 'הרשומות אינן מוכיחות דגם וגרסה, היסטוריית prompts, אחוז קוד שנכתב בידי AI או ביקורת אנושית עצמאית של כל שינוי.',
    },
    full: {
      en: 'The public records do not establish which individual lines were generated by AI, the model or version used, the prompt history, or an independent human review of every change. This disclosure therefore makes no claim about those points or about AI authorship of the project as a whole.',
      he: 'הרשומות הציבוריות אינן מוכיחות אילו שורות ספציפיות נוצרו בעזרת AI, באיזה דגם או גרסה נעשה שימוש, מה הייתה היסטוריית ה־prompts, או שכל שינוי עבר ביקורת אנושית עצמאית. לכן הגילוי אינו טוען את הדברים האלה או מייחס ל־AI את יצירת הפרויקט כולו.',
    },
  },
] as const satisfies readonly AiProvenanceItem[];
