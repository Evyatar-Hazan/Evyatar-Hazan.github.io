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
          title: 'יצירת קשר',
          body: 'אם יוצרים קשר דרך WhatsApp, אימייל או LinkedIn, המידע שנשלח הוא המידע שבחרת לשלוח ישירות. אין באתר טופס שמסתיר לאן הפרטים הולכים.'
        },
        {
          title: 'מדידה ותפעול',
          body: 'המדידה באתר נועדה להבין שימוש בסיסי, תקינות וביצועים, ולא לקרוא תוכן אישי או מסמכים רגישים של מבקרים.'
        }
      ]
    : [
        {
          title: 'What this site does',
          body: 'This site presents portfolio work, case studies, technical writing, and direct contact paths. It does not provide user accounts, private file uploads, or checkout flows.'
        },
        {
          title: 'Direct contact',
          body: 'If you reach out through WhatsApp, email, or LinkedIn, the information shared is whatever you choose to send directly. There is no hidden lead pipeline behind the site.'
        },
        {
          title: 'Measurement and operations',
          body: 'Site measurement is meant for basic usage, stability, and performance understanding rather than reading personal visitor content or private project files.'
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

        <div className="mt-10 grid gap-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-950/70">
              <h2 className="text-xl font-bold text-neutral-950 dark:text-white">{section.title}</h2>
              <p className="mt-3 text-base leading-8 text-neutral-700 dark:text-neutral-300">{section.body}</p>
            </section>
          ))}
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
