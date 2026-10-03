import type { PortfolioRouteTarget } from '../contracts/portfolio';

export type CurrentFocusLanguage = 'en' | 'he';

type LocalizedText = Readonly<Record<CurrentFocusLanguage, string>>;

export type CurrentFocusItem = {
  /** Stable content identifier; never derive identity from translated copy. */
  id: 'project-evidence' | 'reliability-notes';
  title: LocalizedText;
  summary: LocalizedText;
  outcome: {
    label: LocalizedText;
    target: PortfolioRouteTarget;
  };
};

type CurrentFocusItems =
  | readonly [CurrentFocusItem]
  | readonly [CurrentFocusItem, CurrentFocusItem];

export type CurrentFocusRecord = {
  /** Date on which every statement and linked public outcome was last checked. */
  verifiedOn: `${number}-${number}-${number}`;
  /** After this date the UI keeps the evidence visible but stops calling it current. */
  reviewAfter: `${number}-${number}-${number}`;
  items: CurrentFocusItems;
};

/**
 * A deliberately small, manually reviewed record. Updating the focus requires
 * rechecking every public outcome and moving both dates forward explicitly.
 */
export const currentFocus = {
  verifiedOn: '2026-10-01',
  reviewAfter: '2026-11-01',
  items: [
    {
      id: 'project-evidence',
      title: {
        en: 'Sharper project evidence',
        he: 'הוכחות פרויקט חדות יותר',
      },
      summary: {
        en: 'I am refining how each case study connects a real need, a product decision, and a result that can already be inspected.',
        he: 'אני מחדד את החיבור בכל קייס סטאדי בין צורך אמיתי, החלטת מוצר ותוצאה שכבר אפשר לבחון.',
      },
      outcome: {
        label: {
          en: 'See the Online Converter case study',
          he: 'לקייס סטאדי של Online Converter',
        },
        target: { route: 'project', id: 'online_converter' },
      },
    },
    {
      id: 'reliability-notes',
      title: {
        en: 'Reliability lessons from shipped work',
        he: 'לקחי אמינות מעבודה שכבר פורסמה',
      },
      summary: {
        en: 'I turn verified implementation lessons into public engineering notes without exposing private project context.',
        he: 'אני הופך לקחים מאומתים מהיישום לרשומות הנדסיות ציבוריות, בלי לחשוף הקשר פרטי של פרויקטים.',
      },
      outcome: {
        label: {
          en: 'Read the latest reliability note',
          he: 'לרשומת האמינות האחרונה',
        },
        target: { route: 'article', id: 'one-bad-date-should-not-blank-a-screen' },
      },
    },
  ],
} as const satisfies CurrentFocusRecord;

export const currentFocusSectionId = 'current-focus';

const isoDateAtUtcEndOfDay = (date: string) => new Date(`${date}T23:59:59.999Z`);

export const isCurrentFocusFresh = (
  record: CurrentFocusRecord,
  referenceDate = new Date(),
) => referenceDate.getTime() <= isoDateAtUtcEndOfDay(record.reviewAfter).getTime();
