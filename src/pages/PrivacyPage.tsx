import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageSeo } from '../hooks/usePageSeo';
import { localizedPath } from '../routing/portfolioRoutes';
import { presentCalendarDate } from '../features/date-presentation/presentCalendarDate';
import { getStaticRouteSeo } from '../data/routeSeo';

const PRIVACY_LAST_UPDATED = '2026-11-27';

const PrivacyPage = () => {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const language = isHebrew ? 'he' : 'en';
  const lastUpdated = presentCalendarDate(PRIVACY_LAST_UPDATED, { language });

  usePageSeo(getStaticRouteSeo('privacy', language));

  const sections = isHebrew
    ? [
        {
          title: 'מה האתר הזה עושה',
          body: 'האתר הזה מציג עבודות, קייס סטאדיז, כתיבה מקצועית ודרכי יצירת קשר. אין בו אזור משתמשים, אין העלאת קבצים פרטיים, ואין תהליך רכישה.'
        },
        {
          title: 'יצירת קשר וטופס הפנייה',
          body: 'המידע בסעיף הזה נוצר רק כשבחרת לפנות דרך WhatsApp, אימייל, LinkedIn או טופס האתר. FormSubmit מעבדת את הטופס ומעבירה לאימייל של בעל האתר את השם, כתובת האימייל וההודעה שבחרת למסור, כדי לאפשר מענה. פרטי הפנייה אינם נכתבים ב-Cloudflare Analytics Engine, והאתר אינו יוצר מהם חשבון משתמש או מאגר לידים נפרד. FormSubmit מצהירה שהיא שומרת הגשות למשך 30 יום; עותק שמגיע באימייל נשמר בהתאם להגדרות של ספק תיבת הדואר ושל בעל האתר.'
        },
        {
          title: 'מדידה והעדפות מקומיות',
          body: 'מקור המדידה הוא חמש פעולות בלבד בתהליך יצירת הקשר: צפייה באזור, פתיחת בונה התקציר, ניסיון שליחה, הצלחת שליחה ושגיאת שליחה. מטרתן היא לזהות נשירה, והן נכתבות ב-Cloudflare Analytics Engine ללא שם, אימייל, תוכן הודעה או שדות טופס, מזהה משתמש או מכשיר, כתובת IP, user agent או cookie. Cloudflare שומרת את אירועי המדידה האלה למשך שלושה חודשים. בנפרד, בחירות השפה וערכת הנושא נועדו לזכור את העדפות התצוגה שלך ונשמרות רק בדפדפן שלך עד לשינוי או למחיקה; הן אינן נכתבות ב-Analytics Engine.'
        },
        {
          title: 'אין מודעות בפורטפוליו הזה',
          body: 'הפורטפוליו, כולל העמוד הזה, אינו טוען מודעות או Google AdSense. Google AdSense פועל במוצר הנפרד Online Converter בכתובת online-converter.evyatarhazan.com; עמודי הכלים שעברו בדיקה במוצר עשויים להציג מודעות. כאשר מודעות מוצגות שם, Google וספקי צד שלישי עשויים להשתמש ב-cookies, מזהי מכשיר ונתוני שימוש כדי למסור, להתאים ולמדוד פרסום בהתאם להגדרות שלך, להסכמה הנדרשת ולדין החל.'
        },
        {
          title: 'הבחירות שלך ובקשות פרטיות',
          body: 'אפשר לחסום או למחוק cookies, העדפות שפה וערכת נושא ונתוני אתר דרך הדפדפן. הגדרות המודעות של Google רלוונטיות רק ל-Online Converter, ואפשר לנהל אותן בקישור שבהמשך. לבקשה בנוגע למידע שנשלח בטופס או ישירות באימייל, אפשר לפנות ל-evyatarhazan3.14@gmail.com.'
        }
      ]
    : [
        {
          title: 'What this site does',
          body: 'This site presents portfolio work, case studies, technical writing, and direct contact paths. It does not provide user accounts, private file uploads, or checkout flows.'
        },
        {
          title: 'Direct contact and the contact form',
          body: 'The information in this section is created only when you choose to make contact through WhatsApp, email, LinkedIn, or the site form. FormSubmit processes the submission and forwards the name, email address, and message you choose to provide to the site owner by email for a response. Contact details are not written to Cloudflare Analytics Engine, and this site does not turn them into a user account or a separate lead database. FormSubmit states that it retains submissions for 30 days; any copy delivered by email is retained according to the mailbox provider\'s and site owner\'s settings.'
        },
        {
          title: 'Measurement and local preferences',
          body: 'The measurement source is limited to five actions in the contact flow: contact view, brief builder start, submit attempt, submit success, and submit error. They are recorded in Cloudflare Analytics Engine to identify drop-off, without a name, email address, message or form-field content, user or device identifier, IP address, user agent, or cookie. Cloudflare retains these measurement events for three months. Separately, your language and theme choices are used to remember display preferences and stay only in your browser until you change or delete them; they are not written to Analytics Engine.'
        },
        {
          title: 'No ads on this portfolio',
          body: 'This portfolio, including this page, does not load ads or Google AdSense. Google AdSense operates in the separate Online Converter product at online-converter.evyatarhazan.com; its reviewed tool pages may display ads. When ads are shown there, Google and other third-party vendors may use cookies, device identifiers, and usage data to deliver, personalize, and measure advertising, subject to your settings, required consent, and applicable law.'
        },
        {
          title: 'Your choices and privacy requests',
          body: 'You can block or delete cookies, language and theme preferences, and site data through your browser. Google ad settings apply only to Online Converter, and you can manage them using the link below. For a request about information submitted through the form or sent directly by email, contact evyatarhazan3.14@gmail.com.'
        }
      ];

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen pb-20 pt-32">
      <div className="content-container">
        <section className="mx-auto min-w-0 max-w-4xl rounded-[2rem] border border-neutral-200 bg-white/80 p-8 [overflow-wrap:anywhere] shadow-sm backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/70 md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-sm font-semibold text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
          <ShieldCheck className="h-4 w-4 text-primary-500" />
          {isHebrew ? 'פרטיות' : 'Privacy'}
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-neutral-950 dark:text-white md:text-5xl">
          {isHebrew
            ? 'מה אתר הפורטפוליו מתעד בגלישה — ומה נשלח רק מבחירתך'
            : 'What the portfolio records as you browse — and what you send by choice'}
        </h1>
        <p className="body-copy mt-5 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
          {isHebrew
            ? 'בגלישה באתר הפורטפוליו נשמרות בדפדפן העדפות השפה וערכת הנושא; בתהליך יצירת הקשר נמדדים חמישה אירועי שימוש בלי שם, אימייל, תוכן הודעה או מזהה משתמש. שם, אימייל והודעה נמסרים רק אם בחרת לשלוח אותם בטופס או בפנייה ישירה.'
            : 'As you browse the portfolio, language and theme preferences are stored in your browser; the contact flow measures five usage events without your name, email, message content, or a user identifier. Your name, email, and message are provided only when you choose to send them through the form or direct contact.'}
        </p>
        <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {isHebrew ? 'עודכן לאחרונה: ' : 'Last updated: '}
          <time dateTime={lastUpdated.dateTime ?? undefined}>{lastUpdated.text}</time>
        </p>

        <div className="mt-10 grid min-w-0 gap-5">
          {sections.map((section) => (
            <section key={section.title} className="min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-950/70">
              <h2 className="text-xl font-bold text-neutral-950 dark:text-white">{section.title}</h2>
              <p className="body-copy mt-3 text-base leading-8 text-neutral-700 dark:text-neutral-300">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950/70">
          <h2 className="text-lg font-bold text-neutral-950 dark:text-white">
            {isHebrew ? 'הפורטפוליו ללא מודעות — בחירות ומדיניות של צד שלישי' : 'Ad-free portfolio — third-party choices and policies'}
          </h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              {isHebrew ? 'השימוש של Google במידע — Online Converter בלבד' : 'Google data use — Online Converter only'}
            </a>
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              {isHebrew ? 'הגדרות המודעות של Google — Online Converter בלבד' : 'Google ad settings — Online Converter only'}
            </a>
            <a
              href="https://formsubmit.co/privacy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              {isHebrew ? 'מדיניות הפרטיות של FormSubmit' : 'FormSubmit privacy policy'}
            </a>
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              {isHebrew ? 'מדיניות הפרטיות של Cloudflare' : 'Cloudflare privacy policy'}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to={localizedPath(language, { route: 'contact' })}
            className="inline-flex items-center rounded-full bg-primary-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-500"
          >
            {isHebrew ? 'שאלה על פרטיות' : 'Ask about privacy'}
          </Link>
          <Link
            to={localizedPath(language, { route: 'blog' })}
            className="inline-flex items-center rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-300 dark:hover:text-white"
          >
            {isHebrew ? 'לכתיבה מקצועית' : 'Go to writing'}
          </Link>
        </div>
        </section>
      </div>
    </main>
  );
};

export default PrivacyPage;
