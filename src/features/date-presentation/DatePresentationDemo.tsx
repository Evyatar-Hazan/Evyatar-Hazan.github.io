import { useId, useState } from 'react';
import type {
  LocalizedPathBuilder,
  PortfolioSlotProps,
} from '../../contracts/portfolio';
import { datePresentationCopy } from './datePresentationCopy';
import { presentCalendarDate } from './presentCalendarDate';

export type DatePresentationDemoProps = PortfolioSlotProps & {
  buildLocalizedPath: LocalizedPathBuilder;
  initialValue?: string;
};

export const DatePresentationDemo = ({
  language,
  className = '',
  buildLocalizedPath,
  initialValue = '2026-09-13',
}: DatePresentationDemoProps) => {
  const copy = datePresentationCopy[language];
  const [input, setInput] = useState(initialValue);
  const inputId = useId();
  const hintId = useId();
  const statusId = useId();
  const presentation = presentCalendarDate(input, {
    language,
    fallback: copy.fallback,
  });
  const statusText = copy[presentation.status];
  const sourceHref = buildLocalizedPath(language, {
    route: 'article',
    id: 'one-bad-date-should-not-blank-a-screen',
  });

  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border border-neutral-300 bg-neutral-50 text-neutral-950 shadow-2xl shadow-neutral-950/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white ${className}`}
      dir={language === 'he' ? 'rtl' : 'ltr'}
      lang={language}
      aria-labelledby={`${inputId}-title`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(14,165,233,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.08)_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden="true"
      />
      <div className="relative grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)]">
        <div className="p-6 sm:p-10 lg:p-12">
          <p className="mb-5 font-mono text-xs font-semibold tracking-[0.24em] text-primary-700 dark:text-primary-300">
            {copy.eyebrow}
          </p>
          <h2 id={`${inputId}-title`} className="max-w-2xl text-3xl font-black tracking-[-0.04em] sm:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-300 sm:text-lg">
            {copy.intro}
          </p>

          <div className="mt-10">
            <label htmlFor={inputId} className="block text-sm font-bold">
              {copy.inputLabel}
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id={inputId}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                aria-describedby={`${hintId} ${statusId}`}
                className="min-h-12 min-w-0 flex-1 rounded-xl border-2 border-neutral-400 bg-white px-4 font-mono text-base tracking-[0.08em] text-neutral-950 outline-none transition focus:border-primary-600 focus:ring-4 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:focus:border-primary-400"
              />
              <div className="flex flex-wrap gap-2" aria-label={copy.presetsLabel}>
                {copy.presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setInput(preset.value)}
                    className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-xs font-bold transition hover:border-primary-500 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-primary-300"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            <p id={hintId} className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              {copy.inputHint}
            </p>
          </div>

          <div
            className="mt-8 rounded-2xl border border-neutral-300 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900 sm:p-6"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-xs font-semibold tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                {copy.outputLabel}
              </span>
              <span
                id={statusId}
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  presentation.status === 'valid'
                    ? 'bg-success-50 text-success-700 dark:bg-success-950 dark:text-success-300'
                    : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
                }`}
              >
                {statusText}
              </span>
            </div>
            <div className="mt-8 min-h-16 text-3xl font-black tracking-[-0.035em] sm:text-5xl">
              {presentation.status === 'valid' ? (
                <time dateTime={presentation.dateTime ?? undefined}>{presentation.text}</time>
              ) : (
                <span>{presentation.text}</span>
              )}
            </div>
          </div>
        </div>

        <aside className="border-t border-neutral-300 bg-neutral-950 p-6 text-white dark:border-neutral-700 sm:p-10 lg:border-s lg:border-t-0 lg:p-12">
          <p className="font-mono text-xs font-semibold tracking-[0.2em] text-primary-300">{copy.apiLabel}</p>
          <pre className="mt-5 overflow-x-auto rounded-xl border border-neutral-700 bg-black/50 p-4 text-start text-sm leading-7 text-neutral-200"><code>{`presentCalendarDate(value, {
  language: '${language}',
  style: 'long',
  fallback: '${copy.fallback}'
})`}</code></pre>

          <h3 className="mt-8 text-lg font-black">{copy.contractTitle}</h3>
          <ul className="mt-4 space-y-3 text-sm text-neutral-300">
            {copy.contract.map((item, index) => (
              <li key={item} className="grid grid-cols-[1.5rem_1fr] gap-2">
                <span className="font-mono text-primary-300" aria-hidden="true">0{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-lg font-black">{copy.limitsTitle}</h3>
          <p className="mt-3 text-sm leading-6 text-neutral-300">{copy.limits}</p>

          <a
            href={sourceHref}
            className="mt-9 inline-flex min-h-11 items-center border-b border-primary-300 py-2 text-sm font-bold text-primary-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-400/40"
          >
            {copy.source}
          </a>
        </aside>
      </div>
    </section>
  );
};
