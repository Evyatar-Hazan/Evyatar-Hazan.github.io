import { ArrowLeft, ArrowRight, BookOpen, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageSeo } from '../hooks/usePageSeo';
import { localizedPath } from '../routing/portfolioRoutes';

const NotFoundPage = () => {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const language = isHebrew ? 'he' : 'en';
  const ArrowIcon = isHebrew ? ArrowLeft : ArrowRight;

  usePageSeo({
    title: isHebrew ? 'קישור שבור — ממשיכים מכאן | אביתר חזן' : 'Broken link — continue from here | Evyatar Hazan',
    description: isHebrew
      ? 'ייתכן שהעמוד הועבר, שהקישור התיישן או שנפלה טעות בכתובת. אפשר לחזור לעמוד הבית או להמשיך לכתיבה המקצועית.'
      : 'The page may have moved, the link may be outdated, or the address may be mistyped. Return home or continue to the technical writing.',
    robots: 'noindex, follow'
  });

  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-screen items-center pb-20 pt-32">
      <div className="content-container">
        <section className="mx-auto w-full max-w-3xl rounded-[2rem] border border-neutral-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/70 md:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-500">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-950 dark:text-white md:text-6xl">
          {isHebrew ? 'הקישור נשבר, אבל אפשר להמשיך מכאן' : 'This link broke, but you can keep exploring'}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-400">
          {isHebrew
            ? 'ייתכן שהעמוד הועבר, שהקישור התיישן או שנפלה טעות בכתובת. אפשר לחזור לעמוד הבית כדי להכיר את העבודה והפרויקטים, או להמשיך לכתיבה המקצועית.'
            : 'The page may have moved, the link may be outdated, or the address may be mistyped. Return home to explore my work and projects, or continue to the technical writing.'}
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to={localizedPath(language, { route: 'home' })}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-500"
          >
            <Home className="h-4 w-4" />
            {isHebrew ? 'לעמוד הבית ולפרויקטים' : 'Explore the home page'}
          </Link>
          <Link
            to={localizedPath(language, { route: 'blog' })}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-6 py-3 text-sm font-bold text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-300 dark:hover:text-white"
          >
            <BookOpen className="h-4 w-4" />
            {isHebrew ? 'לקריאת הכתיבה המקצועית' : 'Read the technical writing'}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
        </section>
      </div>
    </main>
  );
};

export default NotFoundPage;
