import { ExternalLink, FileText, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import type {
  LocalizedPathBuilder,
  PortfolioSlotProps,
} from '../contracts/portfolio';
import {
  getProjectArchiveEntries,
  type ProjectArchiveEntry,
  type ProjectArchiveLifecycle,
} from '../data/projectArchive';
import type { PortfolioLanguage } from '../data/portfolioCapabilities';

export type ProjectArchiveMode = 'short' | 'full';

export type ProjectArchiveProps = PortfolioSlotProps & {
  buildLocalizedPath: LocalizedPathBuilder;
  mode?: ProjectArchiveMode;
};

const copy = {
  en: {
    eyebrow: 'Project record / 07',
    title: 'Project archive',
    description: 'A compact record of seven public projects. Undocumented dates and lifecycle states stay visibly undocumented.',
    featured: 'Flagship story',
    period: 'Period',
    periodUnknown: 'Year not documented',
    category: 'Category',
    role: 'Role',
    verification: 'Lifecycle',
    verificationUnknown: 'Verification undocumented',
    verified: 'Verified',
    links: 'Links',
    caseStudy: 'Case study',
    live: 'Live site',
    code: 'Code',
    evidence: 'Evidence',
    lifecycle: {
      active: 'Active',
      maintained: 'Maintained',
      archived: 'Archived',
      historical: 'Historical',
    },
  },
  he: {
    eyebrow: 'רשומת פרויקטים / 07',
    title: 'ארכיון פרויקטים',
    description: 'רשומה תמציתית של שבעה פרויקטים ציבוריים. תאריכים ומצבי תחזוקה שלא תועדו נשארים גלויים כלא מתועדים.',
    featured: 'סיפור דגל',
    period: 'תקופה',
    periodUnknown: 'השנה לא תועדה',
    category: 'קטגוריה',
    role: 'תפקיד',
    verification: 'מצב מחזור חיים',
    verificationUnknown: 'האימות לא תועד',
    verified: 'אומת',
    links: 'קישורים',
    caseStudy: 'קייס סטאדי',
    live: 'אתר חי',
    code: 'קוד',
    evidence: 'ראיה',
    lifecycle: {
      active: 'פעיל',
      maintained: 'מתוחזק',
      archived: 'בארכיון',
      historical: 'היסטורי',
    },
  },
} as const;

const formatPeriod = (
  period: ProjectArchiveEntry['period'],
  labels: (typeof copy)[PortfolioLanguage],
) => {
  if (!period) return labels.periodUnknown;
  if (period.endYear === period.startYear) return String(period.startYear);
  return period.endYear === null
    ? `${period.startYear}–`
    : `${period.startYear}–${period.endYear}`;
};

const formatVerificationDate = (date: string, language: PortfolioLanguage) => (
  new Intl.DateTimeFormat(language === 'he' ? 'he-IL' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00.000Z`))
);

const ProjectArchiveLinks = ({
  entry,
  language,
}: {
  entry: ProjectArchiveEntry;
  language: PortfolioLanguage;
}) => {
  const labels = copy[language];
  const linkClass = 'inline-flex min-h-11 items-center gap-2 border border-neutral-300 px-3 py-2 text-xs font-black text-neutral-700 transition-[border-color,color,background-color] duration-200 hover:border-primary-500 hover:bg-white hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white';

  return (
    <div className="flex flex-wrap gap-2" aria-label={`${labels.links}: ${entry.title}`}>
      {entry.caseStudyUrl && (
        <Link className={linkClass} to={entry.caseStudyUrl}>
          <FileText className="h-4 w-4" aria-hidden="true" />
          {labels.caseStudy}
        </Link>
      )}
      {entry.liveUrl && (
        <a className={linkClass} href={entry.liveUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          {labels.live}
        </a>
      )}
      <a className={linkClass} href={entry.codeUrl} target="_blank" rel="noopener noreferrer">
        <Github className="h-4 w-4" aria-hidden="true" />
        {labels.code}
      </a>
    </div>
  );
};

const ProjectArchiveVerification = ({
  entry,
  language,
}: {
  entry: ProjectArchiveEntry;
  language: PortfolioLanguage;
}) => {
  const labels = copy[language];

  if (entry.verification.status === 'undocumented') {
    return (
      <p className="text-sm font-bold text-warning-800 dark:text-warning-300">
        {labels.verificationUnknown}
      </p>
    );
  }

  const lifecycle = labels.lifecycle[entry.verification.lifecycle as ProjectArchiveLifecycle];

  return (
    <div className="space-y-2">
      <p className="text-sm font-black text-success-800 dark:text-success-300">
        {lifecycle} · {labels.verified}{' '}
        <time dateTime={entry.verification.verifiedAt}>
          {formatVerificationDate(entry.verification.verifiedAt, language)}
        </time>
      </p>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {entry.verification.evidenceLinks.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-primary-700 underline decoration-primary-300 underline-offset-4 hover:text-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-primary-300"
          >
            {labels.evidence}: {link.label[language]}
          </a>
        ))}
      </div>
    </div>
  );
};

export const ProjectArchive = ({
  language,
  className = '',
  buildLocalizedPath,
  mode = 'short',
}: ProjectArchiveProps) => {
  const labels = copy[language];
  const entries = getProjectArchiveEntries(language, buildLocalizedPath);

  return (
    <section
      id="project-archive"
      dir={language === 'he' ? 'rtl' : 'ltr'}
      className={`border border-neutral-300/80 bg-white/55 p-5 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/55 md:p-8 ${className}`.trim()}
      aria-labelledby="project-archive-title"
    >
      <header className="grid gap-3 border-b border-neutral-300/80 pb-6 dark:border-neutral-800 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <div>
          <p className="mb-2 font-mono text-[0.6rem] font-black uppercase tracking-[0.16em] text-primary-700 dark:text-primary-400">
            {labels.eyebrow}
          </p>
          <h3 id="project-archive-title" className="text-2xl font-black tracking-tight text-neutral-950 dark:text-white">
            {labels.title}
          </h3>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {labels.description}
        </p>
      </header>

      <ol className="divide-y divide-neutral-300/80 dark:divide-neutral-800">
        {entries.map((entry, index) => {
          const entryTitleId = `project-archive-${entry.id}-title`;

          return (
            <li
              key={entry.id}
              id={`project-archive-${entry.id}`}
              data-project-id={entry.id}
              className="grid gap-5 py-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(14rem,0.8fr)] lg:items-start"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[0.62rem] font-black text-primary-700 dark:text-primary-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h4 id={entryTitleId} className="text-lg font-black text-neutral-950 dark:text-white">
                    {entry.title}
                  </h4>
                  {entry.featured && (
                    <span className="border border-primary-300 px-2 py-0.5 font-mono text-[0.56rem] font-black uppercase tracking-[0.08em] text-primary-700 dark:border-primary-800 dark:text-primary-300">
                      {labels.featured}
                    </span>
                  )}
                </div>
                {mode === 'full' && (
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {entry.summary}
                  </p>
                )}
                <div className="mt-4">
                  <ProjectArchiveLinks entry={entry} language={language} />
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                <div>
                  <dt className="font-mono text-[0.58rem] font-black uppercase tracking-[0.1em] text-neutral-500">{labels.period}</dt>
                  <dd className="mt-1 font-bold text-neutral-800 dark:text-neutral-200">{formatPeriod(entry.period, labels)}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.58rem] font-black uppercase tracking-[0.1em] text-neutral-500">{labels.category}</dt>
                  <dd className="mt-1 font-bold text-neutral-800 dark:text-neutral-200">{entry.category}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-mono text-[0.58rem] font-black uppercase tracking-[0.1em] text-neutral-500">{labels.role}</dt>
                  <dd className="mt-1 leading-relaxed text-neutral-700 dark:text-neutral-300">{entry.role}</dd>
                </div>
                {mode === 'full' && (
                  <div className="col-span-2 flex flex-wrap gap-x-3 gap-y-1.5" aria-label={`${entry.title} technologies`}>
                    {entry.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.06em] text-neutral-500">
                        <span className="me-1 text-primary-500">+</span>{tag}
                      </span>
                    ))}
                  </div>
                )}
              </dl>

              <div aria-labelledby={entryTitleId}>
                <p className="mb-2 font-mono text-[0.58rem] font-black uppercase tracking-[0.1em] text-neutral-500">
                  {labels.verification}
                </p>
                <ProjectArchiveVerification entry={entry} language={language} />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default ProjectArchive;
