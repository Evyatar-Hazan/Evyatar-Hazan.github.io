import { ArrowLeft, ArrowRight, BookOpen, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageSeo } from '../hooks/usePageSeo';

const NotFoundPage = () => {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const ArrowIcon = isHebrew ? ArrowLeft : ArrowRight;

  usePageSeo({
    title: isHebrew ? 'העמוד לא נמצא | אביתר חזן' : 'Page not found | Evyatar Hazan',
    description: isHebrew
      ? 'הכתובת שביקשת אינה קיימת. אפשר לחזור לעמוד הבית או לעבור לכתיבה המקצועית.'
      : 'The requested page does not exist. Return to the home page or browse the technical writing.',
    robots: 'noindex, follow'
  });

  return (
    <main className="flex min-h-screen items-center px-6 pb-20 pt-32">
      <section className="mx-auto w-full max-w-3xl rounded-[2rem] border border-neutral-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/70 md:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-500">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-950 dark:text-white md:text-6xl">
          {isHebrew ? 'העמוד הזה לא נמצא' : 'This page could not be found'}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-400">
          {isHebrew
            ? 'יכול להיות שהקישור השתנה או שהכתובת הוקלדה לא נכון. אין כאן תוכן או מודעות — רק נתיב ברור חזרה לאתר.'
            : 'The link may have changed or the address may be incorrect. There is no content or advertising here, only a clear route back into the site.'}
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-500"
          >
            <Home className="h-4 w-4" />
            {isHebrew ? 'חזרה לעמוד הבית' : 'Back to the home page'}
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-6 py-3 text-sm font-bold text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-300 dark:hover:text-white"
          >
            <BookOpen className="h-4 w-4" />
            {isHebrew ? 'לכתיבה המקצועית' : 'Browse the writing'}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
