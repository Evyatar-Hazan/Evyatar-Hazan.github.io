import type {
  LocalizedPathBuilder,
  PortfolioSlotProps,
} from '../../contracts/portfolio';
import { getServiceEngagements } from '../../data/serviceEngagements';

type ServiceEngagementsProps = PortfolioSlotProps & {
  buildPath: LocalizedPathBuilder;
};

const sectionCopy = {
  en: {
    eyebrow: '03 / Engagement types',
    title: 'Three ways to move a product forward.',
    intro: 'Choose the starting point closest to the current need. Each path connects the work to a relevant public example.',
    audience: 'Intended audience',
    deliverables: 'Typical deliverables',
    proof: 'Relevant proof',
  },
  he: {
    eyebrow: '03 / סוגי התקשרות',
    title: 'שלוש דרכים לקדם מוצר.',
    intro: 'בחרו את נקודת הפתיחה הקרובה ביותר לצורך הנוכחי. כל מסלול מחבר את העבודה לדוגמה ציבורית רלוונטית.',
    audience: 'למי זה מתאים',
    deliverables: 'תוצרים אופייניים',
    proof: 'הוכחה רלוונטית',
  },
} as const;

const joinClassNames = (...values: Array<string | undefined>) => values.filter(Boolean).join(' ');

export const ServiceEngagements = ({
  language,
  buildPath,
  className,
}: ServiceEngagementsProps) => {
  const copy = sectionCopy[language];
  const engagements = getServiceEngagements(language);

  return (
    <section
      id="service-engagements"
      aria-labelledby="service-engagements-title"
      className={joinClassNames(
        'relative overflow-hidden border-b border-neutral-200/80 px-5 py-16 dark:border-neutral-800/80 sm:px-8 sm:py-24 lg:px-12',
        className,
      )}
    >
      <div className="mx-auto max-w-[1480px]">
        <header className="grid gap-5 border-b border-neutral-300/80 pb-8 dark:border-neutral-800 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)] lg:items-end">
          <div>
            <p className="flex items-center gap-3 font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-400">
              <span className="h-px w-9 bg-primary-500" aria-hidden="true" />
              {copy.eyebrow}
            </p>
            <h2
              id="service-engagements-title"
              className="mt-5 max-w-[15ch] text-[clamp(2.45rem,5.5vw,5.5rem)] font-black leading-[0.92] tracking-[-0.055em] text-neutral-950 dark:text-white"
            >
              {copy.title}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-lg lg:justify-self-end">
            {copy.intro}
          </p>
        </header>

        <ol className="mt-8 grid border-t border-neutral-300/80 dark:border-neutral-800 lg:grid-cols-3">
          {engagements.map((engagement, index) => {
            const number = String(index + 1).padStart(2, '0');
            const titleId = `service-engagement-${engagement.id}`;

            return (
              <li
                key={engagement.id}
                className="border-b border-neutral-300/80 dark:border-neutral-800 lg:border-e lg:last:border-e-0"
              >
                <article aria-labelledby={titleId} className="flex h-full flex-col px-1 py-8 sm:px-5 lg:px-7 lg:py-10">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] text-primary-700 dark:text-primary-400">
                      Entry / {number}
                    </p>
                    <span className="font-mono text-4xl font-black tracking-[-0.08em] text-neutral-200 dark:text-neutral-800" aria-hidden="true">
                      {number}
                    </span>
                  </div>

                  <h3 id={titleId} className="mt-5 text-2xl font-black leading-tight tracking-[-0.035em] text-neutral-950 dark:text-white">
                    {engagement.title}
                  </h3>

                  <div className="mt-8">
                    <h4 className="font-mono text-[0.62rem] font-black uppercase tracking-[0.14em] text-neutral-500">
                      {copy.audience}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {engagement.audience}
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-mono text-[0.62rem] font-black uppercase tracking-[0.14em] text-neutral-500">
                      {copy.deliverables}
                    </h4>
                    <ul className="mt-3 space-y-2.5">
                      {engagement.deliverables.map((deliverable) => (
                        <li key={deliverable} className="grid grid-cols-[0.55rem_1fr] gap-2.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                          <span className="mt-[0.62rem] h-1 w-1 rounded-full bg-primary-500" aria-hidden="true" />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 border-s-2 border-primary-500 ps-4">
                    <h4 className="font-mono text-[0.62rem] font-black uppercase tracking-[0.14em] text-neutral-500">
                      {copy.proof}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {engagement.proof.summary}
                    </p>
                    <a
                      href={buildPath(language, { route: 'project', id: engagement.proof.projectId })}
                      className="mt-3 inline-flex min-h-11 items-center text-sm font-black text-primary-700 underline decoration-primary-300 underline-offset-4 transition-colors hover:text-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-primary-300 dark:decoration-primary-700 dark:focus-visible:ring-offset-neutral-950"
                    >
                      {engagement.proof.label}
                    </a>
                  </div>

                  <a
                    href={buildPath(language, engagement.cta.target)}
                    className="mt-8 inline-flex min-h-12 w-full items-center justify-between gap-4 border border-neutral-900 px-4 py-3 text-sm font-black text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:border-neutral-200 dark:text-white dark:hover:bg-white dark:hover:text-neutral-950 dark:focus-visible:ring-offset-neutral-950"
                  >
                    <span>{engagement.cta.label}</span>
                    <span aria-hidden="true" className="font-mono text-primary-600 dark:text-primary-400 rtl:-scale-x-100">→</span>
                  </a>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default ServiceEngagements;
