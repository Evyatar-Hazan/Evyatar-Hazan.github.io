import type { PortfolioLanguage } from '../../data/portfolioCapabilities';

type CraftLabContent = {
  eyebrow: string;
  title: string;
  introduction: string;
  disclosure: string;
  syntheticLabel: string;
  deliveredWork: string;
  discussProject: string;
  reset: string;
  error: {
    number: string;
    title: string;
    summary: string;
    workspaceLabel: string;
    workspaceValue: string;
    dateLabel: string;
    dateValue: string;
    run: string;
    alertTitle: string;
    alertBody: string;
    preserved: string;
    retry: string;
    alternative: string;
    recovered: string;
  };
  upload: {
    number: string;
    title: string;
    summary: string;
    fileName: string;
    fileMeta: string;
    loadSample: string;
    start: string;
    advance: string;
    fail: string;
    retry: string;
    remove: string;
    privacy: string;
    progressLabel: string;
    states: Record<'empty' | 'queued' | 'uploading' | 'processing' | 'ready' | 'failed', string>;
    status: Record<'empty' | 'queued' | 'uploading' | 'processing' | 'ready' | 'failed', string>;
  };
  diagram: {
    number: string;
    title: string;
    summary: string;
    label: string;
    selectedLabel: string;
    nodes: readonly {
      id: 'request' | 'guardrail' | 'decision' | 'outcome';
      step: string;
      title: string;
      short: string;
      detail: string;
      outcome: string;
    }[];
  };
};

export const craftLabContent = {
  en: {
    eyebrow: 'Interface craft lab / 03 experiments',
    title: 'Product thinking, tested in the smallest states.',
    introduction: 'Three original interface studies showing how I turn failure, progress, and workflow decisions into clear next steps — evidence of the product judgment behind the screens.',
    disclosure: 'Self-initiated studies using synthetic scenarios and sample data. They demonstrate product thinking; they are not client work, customer data, production systems, or evidence of production results.',
    syntheticLabel: 'Synthetic scenario',
    deliveredWork: 'View delivered work',
    discussProject: 'Discuss a real project',
    reset: 'Reset experiment',
    error: {
      number: '01',
      title: 'An error that protects the work',
      summary: 'A sample report fails to generate before export. The interface keeps the filters, offers two recovery paths, and confirms when the report is ready.',
      workspaceLabel: 'Report',
      workspaceValue: 'Fictional studio inventory',
      dateLabel: 'Period',
      dateValue: 'September · Sample data',
      run: 'Generate sample report',
      alertTitle: 'The report could not be generated.',
      alertBody: 'The sample export stopped before a file was created, so no partial report was saved.',
      preserved: 'Your fictional inventory filters are preserved exactly as selected—there is nothing to rebuild.',
      retry: 'Retry the sample export',
      alternative: 'Open the sample CSV instead',
      recovered: 'Recovery complete: the sample report is ready, with the original fictional filters preserved.',
    },
    upload: {
      number: '02',
      title: 'Make every system state clear',
      summary: 'A trustworthy workflow separates transfer, processing, failure, and completion so people know what happened, what remains safe, and what to do next.',
      fileName: 'sample-launch-cut.mp4',
      fileMeta: 'Synthetic media · 24 MB · 00:38',
      loadSample: 'Load synthetic sample',
      start: 'Start simulation',
      advance: 'Advance state',
      fail: 'Simulate failure',
      retry: 'Retry simulation',
      remove: 'Remove sample',
      privacy: 'Simulation only — no file is selected, stored, or sent.',
      progressLabel: 'Simulated upload progress',
      states: { empty: 'Empty', queued: 'Queued', uploading: 'Uploading', processing: 'Processing', ready: 'Ready', failed: 'Needs attention' },
      status: {
        empty: 'Load the synthetic sample to inspect the upload flow.',
        queued: 'Synthetic sample queued. No transfer has started.',
        uploading: 'Simulated transfer is 48% complete.',
        processing: 'Simulated transfer complete. Processing the sample.',
        ready: 'Synthetic preview ready for review.',
        failed: 'Simulated transfer stopped at 48%. The sample is available to retry.',
      },
    },
    diagram: {
      number: '03',
      title: 'Show the decision, not just the flow',
      summary: 'Each synthetic step exposes its owner, guardrail, and outcome so stakeholders can understand why the workflow moves, stops, or returns for revision.',
      label: 'Interactive fictional release workflow',
      selectedLabel: 'Selected node',
      nodes: [
        { id: 'request', step: 'Input', title: 'Release request', short: 'A team proposes publishing a sample campaign asset.', detail: 'Capture the goal, intended audience, and owner before work starts.', outcome: 'The synthetic request is decision-ready because its goal, audience, and owner are visible.' },
        { id: 'guardrail', step: 'Check', title: 'Rights check', short: 'The sample asset must have a documented source and usage boundary.', detail: 'Block publication when ownership or consent is unknown; keep the draft intact.', outcome: 'The synthetic workflow stops transparently when evidence is missing while preserving the draft for recovery.' },
        { id: 'decision', step: 'Choice', title: 'Publish or revise', short: 'A named owner chooses the next valid path.', detail: 'Show the reason for revision and return the work to the exact step that needs attention.', outcome: 'The named owner can explain the next action and return the sample only to the step that needs revision.' },
        { id: 'outcome', step: 'Output', title: 'Traceable release', short: 'The synthetic asset reaches a reviewable final state.', detail: 'Record the decision state and approved boundary, not personal viewer behavior.', outcome: 'Stakeholders can audit what was approved and why without surveillance or hidden personal data.' },
      ],
    },
  },
  he: {
    eyebrow: 'מעבדת ממשקים / 03 ניסויים',
    title: 'חשיבה מוצרית, במבחן של המצבים הקטנים.',
    introduction: 'שלושה ניסויי ממשק מקוריים שמראים איך אני הופך כשל, התקדמות והחלטות בתהליך לצעדים ברורים להמשך — עדות לשיקול הדעת המוצרי שמאחורי המסכים.',
    disclosure: 'ניסויים עצמאיים המבוססים על תרחישים סינתטיים ומידע לדוגמה. הם מדגימים חשיבה מוצרית; הם אינם עבודת לקוח, מידע של לקוחות, מערכות פרודקשן או ראיה לתוצאות בפרודקשן.',
    syntheticLabel: 'תרחיש סינתטי',
    deliveredWork: 'לצפייה בעבודות שנמסרו',
    discussProject: 'לשיחה על פרויקט אמיתי',
    reset: 'איפוס הניסוי',
    error: {
      number: '01',
      title: 'שגיאה ששומרת על העבודה',
      summary: 'יצירת דוח לדוגמה נעצרת לפני הייצוא. הממשק שומר את המסננים, מציע שתי דרכי התאוששות ומאשר כשהדוח מוכן.',
      workspaceLabel: 'דוח',
      workspaceValue: 'מלאי סטודיו בדיוני',
      dateLabel: 'תקופה',
      dateValue: 'ספטמבר · מידע לדוגמה',
      run: 'יצירת דוח לדוגמה',
      alertTitle: 'לא ניתן היה ליצור את הדוח.',
      alertBody: 'ייצוא הדוגמה נעצר לפני שנוצר קובץ, ולכן לא נשמר דוח חלקי.',
      preserved: 'מסנני המלאי הבדיוני נשמרו בדיוק כפי שנבחרו — אין צורך לבנות אותם מחדש.',
      retry: 'ניסיון חוזר לייצוא הדוגמה',
      alternative: 'פתיחת ה־CSV לדוגמה במקום',
      recovered: 'ההתאוששות הושלמה: הדוח לדוגמה מוכן, עם המסננים הבדיוניים המקוריים שנשמרו.',
    },
    upload: {
      number: '02',
      title: 'להבהיר כל מצב במערכת',
      summary: 'תהליך אמין מפריד בין העברה, עיבוד, כשל והשלמה, כדי שיהיה ברור מה קרה, מה נשאר בטוח ומה הצעד הבא.',
      fileName: 'sample-launch-cut.mp4',
      fileMeta: 'מדיה סינתטית · 24 MB · 00:38',
      loadSample: 'טעינת דוגמה סינתטית',
      start: 'התחלת הסימולציה',
      advance: 'קידום המצב',
      fail: 'הדמיית כשל',
      retry: 'ניסיון סימולציה חוזר',
      remove: 'הסרת הדוגמה',
      privacy: 'סימולציה בלבד — שום קובץ לא נבחר, נשמר או נשלח.',
      progressLabel: 'התקדמות העלאה מדומה',
      states: { empty: 'ריק', queued: 'בתור', uploading: 'בהעלאה', processing: 'בעיבוד', ready: 'מוכן', failed: 'דורש טיפול' },
      status: {
        empty: 'טענו את הדוגמה הסינתטית כדי לבדוק את תהליך ההעלאה.',
        queued: 'הדוגמה הסינתטית בתור. ההעברה טרם התחילה.',
        uploading: 'ההעברה המדומה הושלמה ב־48%.',
        processing: 'ההעברה המדומה הושלמה. הדוגמה בעיבוד.',
        ready: 'התצוגה הסינתטית מוכנה לבדיקה.',
        failed: 'ההעברה המדומה נעצרה ב־48%. הדוגמה זמינה לניסיון חוזר.',
      },
    },
    diagram: {
      number: '03',
      title: 'להציג את ההחלטה, לא רק את הזרימה',
      summary: 'כל שלב סינתטי חושף בעלים, גבול ותוצאה, כדי שבעלי העניין יבינו למה התהליך מתקדם, נעצר או חוזר לתיקון.',
      label: 'תהליך פרסום בדיוני אינטראקטיבי',
      selectedLabel: 'הצומת שנבחר',
      nodes: [
        { id: 'request', step: 'קלט', title: 'בקשת פרסום', short: 'צוות מציע לפרסם נכס לדוגמה עבור קמפיין.', detail: 'מגדירים יעד, קהל ובעלים לפני שהעבודה מתחילה.', outcome: 'הבקשה הסינתטית מוכנה להחלטה כי היעד, הקהל והבעלים שלה גלויים.' },
        { id: 'guardrail', step: 'בדיקה', title: 'בדיקת זכויות', short: 'לנכס לדוגמה חייבים להיות מקור וגבולות שימוש מתועדים.', detail: 'עוצרים פרסום כשהבעלות או ההסכמה אינן ידועות, בלי למחוק את הטיוטה.', outcome: 'התהליך הסינתטי נעצר בשקיפות כשחסרה ראיה, והטיוטה נשמרת להתאוששות.' },
        { id: 'decision', step: 'בחירה', title: 'פרסום או תיקון', short: 'בעלים מוגדר בוחר את המסלול התקין הבא.', detail: 'מציגים את סיבת התיקון ומחזירים את העבודה בדיוק לשלב שדורש טיפול.', outcome: 'הבעלים המוגדר יכול להסביר את הפעולה הבאה ולהחזיר את הדוגמה רק לשלב שדורש תיקון.' },
        { id: 'outcome', step: 'פלט', title: 'פרסום שניתן לעקוב אחריו', short: 'הנכס הסינתטי מגיע למצב סופי שניתן לבדיקה.', detail: 'שומרים את מצב ההחלטה ואת גבול האישור, לא התנהגות אישית של צופים.', outcome: 'בעלי העניין יכולים לבדוק מה אושר ולמה, בלי מעקב או מידע אישי נסתר.' },
      ],
    },
  },
} as const satisfies Record<PortfolioLanguage, CraftLabContent>;
