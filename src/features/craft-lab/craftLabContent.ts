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
    title: 'Small states. Serious product decisions.',
    introduction: 'Three original interface studies about recovery, trust, and making system behavior understandable.',
    disclosure: 'These are self-initiated experiments built with synthetic scenarios. They are not delivered client products, customer data, or claims of production use.',
    syntheticLabel: 'Synthetic scenario',
    deliveredWork: 'View delivered work',
    discussProject: 'Discuss a real project',
    reset: 'Reset experiment',
    error: {
      number: '01',
      title: 'An error that protects the work',
      summary: 'A useful failure explains the problem, confirms what remains safe, and offers a next step.',
      workspaceLabel: 'Report',
      workspaceValue: 'Fictional studio inventory',
      dateLabel: 'Period',
      dateValue: 'September · Sample data',
      run: 'Generate sample report',
      alertTitle: 'The report could not be generated.',
      alertBody: 'The sample service stopped before creating the file.',
      preserved: 'Your report filters are still here. Nothing needs to be entered again.',
      retry: 'Retry safely',
      alternative: 'Use sample CSV instead',
      recovered: 'Sample report ready. The original filters were preserved.',
    },
    upload: {
      number: '02',
      title: 'Upload progress without ambiguity',
      summary: 'The interface separates transfer, processing, failure, and completion instead of hiding them behind one spinner.',
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
        empty: 'Load the synthetic media sample to inspect the flow.',
        queued: 'Sample queued. Nothing has been transmitted.',
        uploading: 'Simulated transfer is 48% complete.',
        processing: 'Transfer complete. Simulating media processing.',
        ready: 'Synthetic preview ready for review.',
        failed: 'Simulation interrupted at 48%. The sample remains available to retry.',
      },
    },
    diagram: {
      number: '03',
      title: 'A diagram that explains the decision',
      summary: 'Select any node to inspect why it exists and what it protects in a fictional release workflow.',
      label: 'Interactive fictional release workflow',
      selectedLabel: 'Selected node',
      nodes: [
        { id: 'request', step: 'Input', title: 'Release request', short: 'A team proposes publishing a sample campaign asset.', detail: 'Capture the goal, intended audience, and owner before work starts.', outcome: 'The request has enough context to evaluate instead of becoming an unowned task.' },
        { id: 'guardrail', step: 'Check', title: 'Rights check', short: 'The sample asset must have a documented source and usage boundary.', detail: 'Block publication when ownership or consent is unknown; keep the draft intact.', outcome: 'A clear stop state protects both the team and the people represented by the media.' },
        { id: 'decision', step: 'Choice', title: 'Publish or revise', short: 'A named owner chooses the next valid path.', detail: 'Show the reason for revision and return the work to the exact step that needs attention.', outcome: 'The workflow remains accountable without forcing the team to restart.' },
        { id: 'outcome', step: 'Output', title: 'Traceable release', short: 'The synthetic asset reaches a reviewable final state.', detail: 'Record the decision state and approved boundary, not personal viewer behavior.', outcome: 'Stakeholders can understand what was approved without adding surveillance or hidden data.' },
      ],
    },
  },
  he: {
    eyebrow: 'מעבדת ממשקים / 03 ניסויים',
    title: 'מצבים קטנים. החלטות מוצר רציניות.',
    introduction: 'שלושה ניסויי ממשק מקוריים על התאוששות, אמון והפיכת התנהגות מערכת למובנת.',
    disclosure: 'אלה ניסויים עצמאיים שנבנו מתרחישים סינתטיים. הם אינם מוצרי לקוח שנמסרו, מידע של לקוחות או טענה לשימוש בפרודקשן.',
    syntheticLabel: 'תרחיש סינתטי',
    deliveredWork: 'לצפייה בעבודות שנמסרו',
    discussProject: 'לשיחה על פרויקט אמיתי',
    reset: 'איפוס הניסוי',
    error: {
      number: '01',
      title: 'שגיאה ששומרת על העבודה',
      summary: 'כשל שימושי מסביר מה קרה, מאשר מה נשמר ומציע צעד ברור להמשך.',
      workspaceLabel: 'דוח',
      workspaceValue: 'מלאי סטודיו בדיוני',
      dateLabel: 'תקופה',
      dateValue: 'ספטמבר · מידע לדוגמה',
      run: 'יצירת דוח לדוגמה',
      alertTitle: 'לא ניתן היה ליצור את הדוח.',
      alertBody: 'שירות הדוגמה נעצר לפני יצירת הקובץ.',
      preserved: 'מסנני הדוח עדיין כאן. אין צורך להזין דבר מחדש.',
      retry: 'ניסיון חוזר בטוח',
      alternative: 'שימוש ב־CSV לדוגמה',
      recovered: 'הדוח לדוגמה מוכן. המסננים המקוריים נשמרו.',
    },
    upload: {
      number: '02',
      title: 'התקדמות העלאה בלי עמימות',
      summary: 'הממשק מפריד בין העברה, עיבוד, כשל והשלמה במקום להסתיר הכול מאחורי spinner אחד.',
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
        empty: 'טענו את דוגמת המדיה הסינתטית כדי לבחון את הזרימה.',
        queued: 'הדוגמה בתור. שום דבר לא הועבר.',
        uploading: 'ההעברה המדומה הושלמה ב־48%.',
        processing: 'ההעברה הושלמה. מתבצעת סימולציית עיבוד מדיה.',
        ready: 'התצוגה הסינתטית מוכנה לבדיקה.',
        failed: 'הסימולציה נקטעה ב־48%. הדוגמה נשמרה לניסיון חוזר.',
      },
    },
    diagram: {
      number: '03',
      title: 'דיאגרמה שמסבירה את ההחלטה',
      summary: 'בחרו צומת כדי להבין למה הוא קיים ועל מה הוא מגן בתהליך פרסום בדיוני.',
      label: 'תהליך פרסום בדיוני אינטראקטיבי',
      selectedLabel: 'הצומת שנבחר',
      nodes: [
        { id: 'request', step: 'קלט', title: 'בקשת פרסום', short: 'צוות מציע לפרסם נכס לדוגמה עבור קמפיין.', detail: 'מגדירים יעד, קהל ובעלים לפני שהעבודה מתחילה.', outcome: 'יש מספיק הקשר להערכת הבקשה, במקום להפוך אותה למשימה ללא בעלים.' },
        { id: 'guardrail', step: 'בדיקה', title: 'בדיקת זכויות', short: 'לנכס לדוגמה חייבים להיות מקור וגבולות שימוש מתועדים.', detail: 'עוצרים פרסום כשהבעלות או ההסכמה אינן ידועות, בלי למחוק את הטיוטה.', outcome: 'מצב עצירה ברור מגן על הצוות ועל האנשים שמיוצגים במדיה.' },
        { id: 'decision', step: 'בחירה', title: 'פרסום או תיקון', short: 'בעלים מוגדר בוחר את המסלול התקין הבא.', detail: 'מציגים את סיבת התיקון ומחזירים את העבודה בדיוק לשלב שדורש טיפול.', outcome: 'התהליך נשאר אחראי בלי לחייב את הצוות להתחיל מחדש.' },
        { id: 'outcome', step: 'פלט', title: 'פרסום שניתן לעקוב אחריו', short: 'הנכס הסינתטי מגיע למצב סופי שניתן לבדיקה.', detail: 'שומרים את מצב ההחלטה ואת גבול האישור, לא התנהגות אישית של צופים.', outcome: 'בעלי העניין מבינים מה אושר בלי להוסיף מעקב או מידע נסתר.' },
      ],
    },
  },
} as const satisfies Record<PortfolioLanguage, CraftLabContent>;
