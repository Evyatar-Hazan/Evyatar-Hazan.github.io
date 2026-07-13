import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageSeo } from '../hooks/usePageSeo';

const PrivacyPage = () => {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';

  usePageSeo({
    title: isHebrew ? 'פרטיות | אביתר חזן' : 'Privacy | Evyatar Hazan',
    description: isHebrew
      ? 'מידע בסיסי על פרטיות באתר הפורטפוליו של אביתר חזן, כולל יצירת קשר, שימוש מינימלי במדידה וציפיות טיפול בנתונים.'
      : 'Basic privacy information for Evyatar Hazan portfolio visitors, including contact paths, minimal measurement, and data-handling expectations.',
    path: '/privacy/'
  });

  const sections = isHebrew
    ? [
        {
          title: 'מה האתר הזה עושה',
          body: 'האתר הזה מציג עבודות, קייס סטאדיז, כתיבה מקצועית ודרכי יצירת קשר. אין בו אזור משתמשים, אין העלאת קבצים פרטיים, ואין תהליך רכישה.'
        },
        {
          title: 'יצירת קשר וטופס הפנייה',
          body: 'אפשר ליצור קשר דרך WhatsApp, אימייל, LinkedIn או טופס הפנייה באתר. בטופס נשלחים השם, כתובת האימייל ותוכן ההודעה שבחרת למסור. הטופס מעובד באמצעות FormSubmit ומועבר לאימייל של בעל האתר; האתר עצמו אינו מפעיל חשבון משתמש או מאגר לידים נפרד.'
        },
        {
          title: 'מדידה ותפעול',
          body: 'השרת וספקי האירוח עשויים לעבד נתוני בקשה טכניים לצורכי אבטחה, תקינות וביצועים. העדפות שפה וערכת נושא נשמרות בדפדפן שלך. המדידה אינה מיועדת לקרוא תוכן אישי או מסמכים רגישים של מבקרים.'
        },
        {
          title: 'פרסום ו-Google AdSense',
          body: 'האתר כולל קוד של Google AdSense. לאחר אישור האתר, Google ושותפי פרסום עשויים להשתמש ב-cookies, מזהי מכשיר ונתוני שימוש כדי להציג, להתאים ולמדוד מודעות, בהתאם להגדרות המשתמש, להסכמה הנדרשת ולדין החל. ניתן לנהל התאמה אישית דרך הגדרות המודעות של Google והגדרות הדפדפן.'
        },
        {
          title: 'בחירה ובקשות פרטיות',
          body: 'אפשר לחסום או למחוק cookies ונתוני אתר דרך הדפדפן. לבקשה בנוגע למידע שנשלח בטופס או ישירות באימייל, אפשר לפנות ל-evyatarhazan3.14@gmail.com.'
        }
      ]
    : [
        {
          title: 'What this site does',
          body: 'This site presents portfolio work, case studies, technical writing, and direct contact paths. It does not provide user accounts, private file uploads, or checkout flows.'
        },
        {
          title: 'Direct contact and the contact form',
          body: 'You can contact me through WhatsApp, email, LinkedIn, or the site contact form. The form sends the name, email address, and message you choose to provide. FormSubmit processes the submission and forwards it to the site owner by email; this site does not operate user accounts or a separate lead database.'
        },
        {
          title: 'Measurement and operations',
          body: 'Hosting and infrastructure providers may process technical request data for security, reliability, and performance. Language and theme preferences are stored in your browser. Measurement is not intended to read personal visitor content or private project files.'
        },
        {
          title: 'Advertising and Google AdSense',
          body: 'This site includes Google AdSense code. After the site is approved, Google and its advertising partners may use cookies, device identifiers, and usage data to deliver, personalize, and measure ads, subject to user settings, required consent, and applicable law. You can manage personalization through Google Ads Settings and your browser controls.'
        },
        {
          title: 'Your choices and privacy requests',
          body: 'You can block or delete cookies and site data through your browser. For a request about information submitted through the form or sent directly by email, contact evyatarhazan3.14@gmail.com.'
        }
      ];

  return (
    <main className="min-h-screen px-6 pb-20 pt-32">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-neutral-200 bg-white/80 p-8 shadow-sm backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/70 md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-sm font-semibold text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
          <ShieldCheck className="h-4 w-4 text-primary-500" />
          {isHebrew ? 'פרטיות' : 'Privacy'}
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-neutral-950 dark:text-white md:text-5xl">
          {isHebrew ? 'פרטיות ושקיפות בסיסית' : 'Basic privacy and transparency'}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-400">
          {isHebrew
            ? 'העמוד הזה נועד להסביר בפשטות איך האתר הזה פועל, אילו נתיבים יש ליצירת קשר, ואיפה עובר הגבול בין שימוש רגיל באתר לבין שיתוף מידע ביוזמתך.'
            : 'This page explains in plain language how the site works, which contact paths exist, and where the boundary sits between normal browsing and information you intentionally choose to share.'}
        </p>
        <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {isHebrew ? 'עודכן לאחרונה: 14 ביולי 2026' : 'Last updated: July 14, 2026'}
        </p>

        <div className="mt-10 grid gap-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-950/70">
              <h2 className="text-xl font-bold text-neutral-950 dark:text-white">{section.title}</h2>
              <p className="mt-3 text-base leading-8 text-neutral-700 dark:text-neutral-300">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950/70">
          <h2 className="text-lg font-bold text-neutral-950 dark:text-white">
            {isHebrew ? 'מידע נוסף על שירותי צד שלישי' : 'More about third-party services'}
          </h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              {isHebrew ? 'איך Google משתמשת במידע מאתרים שותפים' : 'How Google uses information from partner sites'}
            </a>
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              {isHebrew ? 'הגדרות המודעות של Google' : 'Google Ads Settings'}
            </a>
            <a
              href="https://formsubmit.co/privacy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              {isHebrew ? 'מדיניות הפרטיות של FormSubmit' : 'FormSubmit privacy policy'}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center rounded-full bg-primary-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-500"
          >
            {isHebrew ? 'מעבר ליצירת קשר' : 'Go to contact'}
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-300 dark:hover:text-white"
          >
            {isHebrew ? 'לכתיבה מקצועית' : 'Go to writing'}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPage;
