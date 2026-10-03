import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LocalizedPathBuilder, PortfolioSlotProps } from '../../contracts/portfolio';
import {
  currentFocus,
  currentFocusSectionId,
  isCurrentFocusFresh,
  type CurrentFocusLanguage,
} from '../../data/currentFocus';

const copy = {
  en: {
    eyebrow: 'Current focus',
    staleEyebrow: 'Last verified focus',
    title: 'What I am working to make clearer now.',
    intro: 'Two active areas, each connected to a public outcome you can inspect today.',
    staleIntro: 'These areas were verified on the date shown. Their status may have changed, but the linked public outcomes remain available.',
    verified: 'Evidence checked',
    freshNote: 'This status is reviewed manually. It does not describe a client roadmap or promise a future result.',
    staleNote: 'Freshness review is due. Treat these as last verified, not as a claim about today.',
    outcomePrefix: 'Published outcome',
  },
  he: {
    eyebrow: 'המיקוד הנוכחי',
    staleEyebrow: 'המיקוד שאומת לאחרונה',
    title: 'מה אני עובד לחדד עכשיו.',
    intro: 'שני תחומים פעילים, וכל אחד מחובר לתוצאה ציבורית שאפשר לבחון כבר היום.',
    staleIntro: 'התחומים האלה אומתו בתאריך שמוצג. ייתכן שהמצב השתנה, אך התוצאות הציבוריות המקושרות עדיין זמינות.',
    verified: 'הראיות נבדקו',
    freshNote: 'הסטטוס נבדק ידנית. הוא אינו מתאר מפת דרכים של לקוח ואינו מבטיח תוצאה עתידית.',
    staleNote: 'נדרשת בדיקת רעננות. יש לקרוא זאת כמצב שאומת לאחרונה, לא כטענה על היום.',
    outcomePrefix: 'תוצאה שפורסמה',
  },
} as const;

const formatVerifiedDate = (date: string, language: CurrentFocusLanguage) =>
  new Intl.DateTimeFormat(language === 'he' ? 'he-IL' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));

export type CurrentFocusProps = PortfolioSlotProps & {
  localizedPathBuilder: LocalizedPathBuilder;
  /** Test/preview seam; production should rely on the current clock. */
  referenceDate?: Date;
};

const CurrentFocus = ({
  className = '',
  language,
  localizedPathBuilder,
  referenceDate,
}: CurrentFocusProps) => {
  const languageCopy = copy[language];
  const fresh = isCurrentFocusFresh(currentFocus, referenceDate);
  const headingId = `${currentFocusSectionId}-heading`;

  return (
    <section
      id={currentFocusSectionId}
      aria-labelledby={headingId}
      data-freshness={fresh ? 'current' : 'last-verified'}
      className={`border-y border-neutral-200/80 bg-white/55 px-5 py-14 dark:border-neutral-800/80 dark:bg-neutral-950/45 sm:px-8 sm:py-18 lg:px-12 ${className}`.trim()}
    >
      <div className="mx-auto max-w-[1480px]">
        <header className="grid gap-6 border-b border-neutral-200 pb-8 dark:border-neutral-800 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:items-end">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-400">
              {fresh ? languageCopy.eyebrow : languageCopy.staleEyebrow}
            </p>
            <p className="mt-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
              {languageCopy.verified}{' '}
              <time dateTime={currentFocus.verifiedOn}>
                {formatVerifiedDate(currentFocus.verifiedOn, language)}
              </time>
            </p>
          </div>

          <div>
            <h2
              id={headingId}
              className="max-w-3xl text-balance text-3xl font-black tracking-[-0.035em] text-neutral-950 dark:text-white sm:text-4xl"
            >
              {languageCopy.title}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-neutral-600 dark:text-neutral-300">
              {fresh ? languageCopy.intro : languageCopy.staleIntro}
            </p>
          </div>
        </header>

        <ol className="grid gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 md:grid-cols-2">
          {currentFocus.items.map((item, index) => (
            <li
              key={item.id}
              data-focus-id={item.id}
              className="flex min-h-64 flex-col bg-neutral-50 p-6 dark:bg-neutral-950 sm:p-8"
            >
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                {String(index + 1).padStart(2, '0')} / {languageCopy.outcomePrefix}
              </p>
              <h3 className="mt-8 text-2xl font-black tracking-[-0.025em] text-neutral-950 dark:text-white">
                {item.title[language]}
              </h3>
              <p className="mt-3 max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-300">
                {item.summary[language]}
              </p>
              <Link
                to={localizedPathBuilder(language, item.outcome.target)}
                className="group mt-auto inline-flex w-fit items-center gap-2 pt-8 text-sm font-bold text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-4 dark:text-primary-300 dark:decoration-primary-700 dark:hover:text-primary-100 dark:focus-visible:ring-offset-neutral-950"
              >
                <span>{item.outcome.label[language]}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>

        <p
          className={`mt-5 max-w-4xl text-sm leading-6 ${fresh ? 'text-neutral-500 dark:text-neutral-400' : 'font-semibold text-amber-800 dark:text-amber-300'}`}
          role={fresh ? undefined : 'status'}
        >
          {fresh ? languageCopy.freshNote : languageCopy.staleNote}
        </p>
      </div>
    </section>
  );
};

export default CurrentFocus;
