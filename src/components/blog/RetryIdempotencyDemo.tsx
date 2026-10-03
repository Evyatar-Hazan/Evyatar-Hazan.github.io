import { useId, useState } from 'react';
import type { PortfolioSlotProps } from '../../contracts/portfolio';
import styles from './RetryIdempotencyDemo.module.css';

type DemoPhase = 0 | 1 | 2;

type DemoCopy = {
  title: string;
  description: string;
  syntheticNote: string;
  intentLabel: string;
  intent: string;
  firstAttempt: string;
  retry: string;
  reset: string;
  records: string;
  deliveries: string;
  eventLog: string;
  waiting: string;
  unprotected: {
    title: string;
    summary: string;
    firstEvents: readonly string[];
    retryEvents: readonly string[];
  };
  protected: {
    title: string;
    summary: string;
    firstEvents: readonly string[];
    retryEvents: readonly string[];
  };
  announcements: readonly string[];
};

const copy: Record<PortfolioSlotProps['language'], DemoCopy> = {
  en: {
    title: 'Retry the same intent',
    description: 'Run one synthetic invitation twice and compare the resulting records.',
    syntheticNote: 'Local simulation only — no message is sent and no personal data is used.',
    intentLabel: 'Synthetic intent',
    intent: 'Invite demo@example.test to workspace DEMO-01',
    firstAttempt: 'Run first attempt',
    retry: 'Retry same intent',
    reset: 'Reset demo',
    records: 'Records',
    deliveries: 'Delivery attempts',
    eventLog: 'Event log',
    waiting: 'Waiting for an action.',
    unprotected: {
      title: 'Without protection',
      summary: 'Every attempt runs create again.',
      firstEvents: ['Created record MEMBER-101.', 'Simulated delivery failed.'],
      retryEvents: ['Created record MEMBER-102.', 'Simulated delivery succeeded.', 'Duplicate business record detected.'],
    },
    protected: {
      title: 'With idempotency',
      summary: 'The normalized business key reuses one record.',
      firstEvents: ['Created canonical record MEMBER-101.', 'Simulated delivery failed.'],
      retryEvents: ['Reused canonical record MEMBER-101.', 'Simulated delivery succeeded.', 'No duplicate record created.'],
    },
    announcements: [
      'Demo reset. No attempts have run.',
      'First attempt complete. Both paths contain one record and delivery failed.',
      'Retry complete. The unprotected path has two records; the protected path still has one.',
    ],
  },
  he: {
    title: 'ניסיון חוזר לאותה כוונה',
    description: 'הריצו הזמנה סינתטית אחת פעמיים והשוו בין הרשומות שנוצרו.',
    syntheticNote: 'הדמיה מקומית בלבד — לא נשלחת הודעה ולא נעשה שימוש במידע אישי.',
    intentLabel: 'כוונה סינתטית',
    intent: 'הזמנת demo@example.test למרחב DEMO-01',
    firstAttempt: 'הרצת הניסיון הראשון',
    retry: 'ניסיון חוזר לאותה כוונה',
    reset: 'איפוס ההדגמה',
    records: 'רשומות',
    deliveries: 'ניסיונות מסירה',
    eventLog: 'יומן אירועים',
    waiting: 'ממתין לפעולה.',
    unprotected: {
      title: 'ללא הגנה',
      summary: 'כל ניסיון מפעיל שוב את פעולת היצירה.',
      firstEvents: ['נוצרה הרשומה MEMBER-101.', 'המסירה הסינתטית נכשלה.'],
      retryEvents: ['נוצרה הרשומה MEMBER-102.', 'המסירה הסינתטית הצליחה.', 'זוהתה רשומה עסקית כפולה.'],
    },
    protected: {
      title: 'עם idempotency',
      summary: 'המפתח העסקי המנורמל משתמש שוב ברשומה אחת.',
      firstEvents: ['נוצרה הרשומה הקנונית MEMBER-101.', 'המסירה הסינתטית נכשלה.'],
      retryEvents: ['נעשה שימוש חוזר ברשומה MEMBER-101.', 'המסירה הסינתטית הצליחה.', 'לא נוצרה רשומה כפולה.'],
    },
    announcements: [
      'ההדגמה אופסה. עדיין לא בוצע ניסיון.',
      'הניסיון הראשון הסתיים. בשני המסלולים יש רשומה אחת והמסירה נכשלה.',
      'הניסיון החוזר הסתיים. במסלול ללא הגנה יש שתי רשומות ובמסלול המוגן עדיין יש אחת.',
    ],
  },
};

type OutcomeCardProps = {
  copy: DemoCopy['unprotected'];
  deliveries: number;
  eventLogLabel: string;
  phase: DemoPhase;
  records: readonly string[];
  recordsLabel: string;
  deliveriesLabel: string;
  waitingLabel: string;
  protectedPath?: boolean;
};

const OutcomeCard = ({
  copy: cardCopy,
  deliveries,
  eventLogLabel,
  phase,
  records,
  recordsLabel,
  deliveriesLabel,
  waitingLabel,
  protectedPath = false,
}: OutcomeCardProps) => {
  const headingId = useId();
  const events = phase === 0
    ? []
    : phase === 1
      ? cardCopy.firstEvents
      : [...cardCopy.firstEvents, ...cardCopy.retryEvents];

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.outcome} ${protectedPath ? styles.protected : styles.unprotected}`}
    >
      <header className={styles.outcomeHeader}>
        <div id={headingId} role="heading" aria-level={4}>{cardCopy.title}</div>
        <p>{cardCopy.summary}</p>
      </header>

      <dl className={styles.metrics}>
        <div>
          <dt>{recordsLabel}</dt>
          <dd>{records.length}</dd>
        </div>
        <div>
          <dt>{deliveriesLabel}</dt>
          <dd>{deliveries}</dd>
        </div>
      </dl>

      <div className={styles.records} aria-label={recordsLabel}>
        {records.map((record, index) => (
          <code key={`${record}-${index}`}>{record}</code>
        ))}
      </div>

      <div className={styles.log}>
        <span>{eventLogLabel}</span>
        {events.length > 0 ? (
          <ol>
            {events.map((event, index) => <li key={`${event}-${index}`}>{event}</li>)}
          </ol>
        ) : <p>{waitingLabel}</p>}
      </div>
    </section>
  );
};

const RetryIdempotencyDemo = ({ language, className }: PortfolioSlotProps) => {
  const [phase, setPhase] = useState<DemoPhase>(0);
  const headingId = useId();
  const text = copy[language];
  const deliveries = phase;
  const unprotectedRecords = phase === 0
    ? []
    : phase === 1
      ? ['MEMBER-101']
      : ['MEMBER-101', 'MEMBER-102'];
  const protectedRecords = phase === 0 ? [] : ['MEMBER-101'];

  return (
    <section
      aria-labelledby={headingId}
      className={[styles.demo, className].filter(Boolean).join(' ')}
      data-phase={phase}
    >
      <header className={styles.header}>
        <span aria-hidden="true">RETRY LAB / 01</span>
        <div id={headingId} role="heading" aria-level={3}>{text.title}</div>
        <p>{text.description}</p>
        <p className={styles.note}>{text.syntheticNote}</p>
      </header>

      <div className={styles.intent}>
        <span>{text.intentLabel}</span>
        <code>{text.intent}</code>
      </div>

      <div className={styles.controls}>
        <button type="button" onClick={() => setPhase(1)} disabled={phase !== 0}>
          {text.firstAttempt}
        </button>
        <button type="button" onClick={() => setPhase(2)} disabled={phase !== 1}>
          {text.retry}
        </button>
        <button type="button" className={styles.reset} onClick={() => setPhase(0)} disabled={phase === 0}>
          {text.reset}
        </button>
      </div>

      <div className={styles.comparison}>
        <OutcomeCard
          copy={text.unprotected}
          deliveries={deliveries}
          eventLogLabel={text.eventLog}
          phase={phase}
          records={unprotectedRecords}
          recordsLabel={text.records}
          deliveriesLabel={text.deliveries}
          waitingLabel={text.waiting}
        />
        <OutcomeCard
          copy={text.protected}
          deliveries={deliveries}
          eventLogLabel={text.eventLog}
          phase={phase}
          records={protectedRecords}
          recordsLabel={text.records}
          deliveriesLabel={text.deliveries}
          waitingLabel={text.waiting}
          protectedPath
        />
      </div>

      <p className={styles.announcement} aria-live="polite" aria-atomic="true">
        {text.announcements[phase]}
      </p>
    </section>
  );
};

export default RetryIdempotencyDemo;
