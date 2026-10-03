import { useId, useMemo, useState, type FormEvent } from 'react';
import { ArrowUpLeft, ArrowUpRight, CheckCircle2, Linkedin, Mail, MessageCircle, Send, XCircle } from 'lucide-react';
import type { LocalizedPathBuilder, PortfolioSlotProps } from '../../contracts/portfolio';
import { profileLinks } from '../../data/profile';
import {
  buildContactBriefMessage,
  buildContactEmailHref,
  buildContactWhatsappHref,
  contactBriefCopy,
  emptyContactBrief,
  type ContactBriefValues,
  type PreferredContactChannel,
} from './contactBrief';

const formEndpoint = 'https://formsubmit.co/ajax/evyatarhazan3.14@gmail.com';

const localizedUi = {
  en: {
    eyebrow: 'PROJECT HANDOFF / 01',
    title: 'Start with a direct conversation.',
    description: 'Choose the simplest channel, or prepare a short brief before you reach out.',
    directTitle: 'Direct contact',
    directDescription: 'No brief is required. A short message is enough to begin.',
    whatsapp: 'WhatsApp',
    email: 'Email',
    linkedin: 'LinkedIn',
    builderToggle: 'Build a short project brief (optional)',
    builderTitle: 'Shape the context before sending',
    builderDescription: 'Nothing is sent or stored while you write. Blank answers are left out of the message.',
    fields: {
      need: { label: 'What do you need?', placeholder: 'A website, product flow, internal tool…' },
      existingSituation: { label: 'What exists today?', placeholder: 'A short description of the current situation' },
      issue: { label: 'What is not working?', placeholder: 'The main blocker or problem to solve' },
      timeframe: { label: 'What is the timeframe?', placeholder: 'For example: exploring, this quarter, flexible' },
      preferredChannel: { label: 'Preferred channel', placeholder: 'No preference' },
    },
    previewTitle: 'Message preview',
    previewDescription: 'Review the exact text before choosing where to use it.',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    formAction: 'Send with the existing form',
    sending: 'Sending…',
    emailAction: 'Open email draft',
    whatsappAction: 'Open WhatsApp draft',
    privacyPrefix: 'The form is processed by FormSubmit and forwarded by email.',
    privacyLink: 'Read the privacy notice',
    success: 'Message sent successfully. I will get back to you soon.',
    error: 'Message delivery failed. You can still use email or WhatsApp.',
  },
  he: {
    eyebrow: 'PROJECT HANDOFF / 01',
    title: 'מתחילים בשיחה ישירה.',
    description: 'בוחרים את הערוץ הפשוט ביותר, או מכינים תקציר קצר לפני הפנייה.',
    directTitle: 'יצירת קשר ישירה',
    directDescription: 'לא חייבים למלא תקציר. הודעה קצרה מספיקה כדי להתחיל.',
    whatsapp: 'WhatsApp',
    email: 'אימייל',
    linkedin: 'LinkedIn',
    builderToggle: 'הכנת תקציר פרויקט קצר (לא חובה)',
    builderTitle: 'מסדרים את ההקשר לפני השליחה',
    builderDescription: 'בזמן הכתיבה דבר לא נשלח או נשמר. תשובות ריקות לא יופיעו בהודעה.',
    fields: {
      need: { label: 'מה צריך?', placeholder: 'אתר, תהליך מוצר, כלי פנימי…' },
      existingSituation: { label: 'מה קיים היום?', placeholder: 'תיאור קצר של המצב הנוכחי' },
      issue: { label: 'מה לא עובד?', placeholder: 'החסם או הבעיה המרכזית שצריך לפתור' },
      timeframe: { label: 'מה לוח הזמנים?', placeholder: 'לדוגמה: בבדיקה, ברבעון הקרוב, גמיש' },
      preferredChannel: { label: 'ערוץ מועדף', placeholder: 'אין העדפה' },
    },
    previewTitle: 'תצוגה מקדימה של ההודעה',
    previewDescription: 'אפשר לבדוק את הטקסט המדויק לפני שבוחרים איפה להשתמש בו.',
    nameLabel: 'שם',
    namePlaceholder: 'השם שלך',
    emailLabel: 'כתובת אימייל',
    emailPlaceholder: 'you@example.com',
    formAction: 'שליחה בטופס הקיים',
    sending: 'שולח…',
    emailAction: 'פתיחת טיוטת אימייל',
    whatsappAction: 'פתיחת טיוטת WhatsApp',
    privacyPrefix: 'הטופס מעובד באמצעות FormSubmit ומועבר באימייל.',
    privacyLink: 'למידע נוסף בעמוד הפרטיות',
    success: 'ההודעה נשלחה בהצלחה. אחזור אליך בהקדם.',
    error: 'שליחת ההודעה נכשלה. עדיין אפשר להשתמש באימייל או ב-WhatsApp.',
  },
} as const;

export type ContactBriefFeatureProps = PortfolioSlotProps & {
  buildLocalizedPath: LocalizedPathBuilder;
  id?: string;
  titleAs?: 'h1' | 'h2';
};

const fieldClassName = 'rounded-2xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-700 dark:bg-neutral-950/70';
const inputClassName = 'mt-2 min-h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-950 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white';
const actionClassName = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-bold text-neutral-900 transition hover:border-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-neutral-700 dark:text-white';

const ContactBriefFeature = ({
  language,
  className = '',
  buildLocalizedPath,
  id = 'contact',
  titleAs = 'h2',
}: ContactBriefFeatureProps) => {
  const ui = localizedUi[language];
  const content = contactBriefCopy[language];
  const Title = titleAs;
  const reactId = useId();
  const builderId = `${reactId}-builder`;
  const titleId = `${reactId}-title`;
  const statusId = `${reactId}-status`;
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [brief, setBrief] = useState<ContactBriefValues>(emptyContactBrief);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const ArrowIcon = language === 'he' ? ArrowUpLeft : ArrowUpRight;

  const message = useMemo(
    () => buildContactBriefMessage(language, brief),
    [brief, language],
  );
  const whatsappHref = buildContactWhatsappHref(profileLinks.whatsapp, message);
  const emailHref = buildContactEmailHref(profileLinks.email, language, message);
  const privacyHref = buildLocalizedPath(language, { route: 'privacy' });

  const updateBrief = <Key extends keyof ContactBriefValues>(
    key: Key,
    value: ContactBriefValues[Key],
  ) => setBrief((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setIsSubmitting(true);
    setFormStatus('idle');
    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      setFormStatus(response.ok ? 'success' : 'error');
      if (response.ok) form.reset();
    } catch {
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`relative overflow-hidden bg-[var(--effect-contact-surface)] px-5 py-20 sm:px-8 lg:px-12 ${className}`.trim()}
    >
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="font-mono text-xs font-bold tracking-[0.18em] text-primary-700 dark:text-primary-300">{ui.eyebrow}</p>
          <Title id={titleId} className="mt-4 text-4xl font-black tracking-tight text-neutral-950 dark:text-white sm:text-5xl">{ui.title}</Title>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">{ui.description}</p>
        </header>

        <div className="mt-10 rounded-[2rem] border border-neutral-200 bg-white/75 p-5 shadow-xl shadow-neutral-950/5 backdrop-blur sm:p-7 dark:border-neutral-800 dark:bg-neutral-950/75">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-neutral-950 dark:text-white">{ui.directTitle}</h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">{ui.directDescription}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className={`${actionClassName} border-primary-700 bg-primary-700 text-white hover:bg-primary-800 dark:border-primary-500`} href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" className="h-4 w-4" />{ui.whatsapp}
              </a>
              <a className={actionClassName} href={emailHref}>
                <Mail aria-hidden="true" className="h-4 w-4" />{ui.email}
              </a>
              <a className={actionClassName} href={profileLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin aria-hidden="true" className="h-4 w-4" />{ui.linkedin}
              </a>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:bg-white dark:text-neutral-950"
          aria-expanded={isBuilderOpen}
          aria-controls={builderId}
          onClick={() => setIsBuilderOpen((open) => !open)}
        >
          {ui.builderToggle}<ArrowIcon aria-hidden="true" className="h-4 w-4" />
        </button>

        {isBuilderOpen && (
          <div id={builderId} className="mt-6 grid gap-6 rounded-[2rem] border border-neutral-200 bg-neutral-50/85 p-5 sm:p-7 lg:grid-cols-[1fr_0.9fr] dark:border-neutral-800 dark:bg-neutral-900/75">
            <div>
              <h3 className="text-2xl font-bold text-neutral-950 dark:text-white">{ui.builderTitle}</h3>
              <p className="mt-2 leading-7 text-neutral-600 dark:text-neutral-400">{ui.builderDescription}</p>

              <div className="mt-6 grid gap-4">
                {(['need', 'existingSituation', 'issue', 'timeframe'] as const).map((key) => (
                  <div key={key} className={fieldClassName}>
                    <label htmlFor={`${reactId}-${key}`} className="text-sm font-bold text-neutral-900 dark:text-white">{ui.fields[key].label}</label>
                    <textarea
                      id={`${reactId}-${key}`}
                      rows={key === 'timeframe' ? 2 : 3}
                      value={brief[key]}
                      placeholder={ui.fields[key].placeholder}
                      onChange={(event) => updateBrief(key, event.target.value)}
                      className={inputClassName}
                    />
                  </div>
                ))}

                <div className={fieldClassName}>
                  <label htmlFor={`${reactId}-preferred-channel`} className="text-sm font-bold text-neutral-900 dark:text-white">{ui.fields.preferredChannel.label}</label>
                  <select
                    id={`${reactId}-preferred-channel`}
                    value={brief.preferredChannel}
                    onChange={(event) => updateBrief('preferredChannel', event.target.value as PreferredContactChannel)}
                    className={inputClassName}
                  >
                    <option value="">{ui.fields.preferredChannel.placeholder}</option>
                    <option value="form">{content.channelLabels.form}</option>
                    <option value="email">{content.channelLabels.email}</option>
                    <option value="whatsapp">{content.channelLabels.whatsapp}</option>
                  </select>
                </div>
              </div>
            </div>

            <form noValidate onSubmit={handleSubmit} className="rounded-[1.5rem] border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-950">
              <h3 className="text-xl font-bold text-neutral-950 dark:text-white">{ui.previewTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{ui.previewDescription}</p>
              <label htmlFor={`${reactId}-preview`} className="sr-only">{ui.previewTitle}</label>
              <textarea
                id={`${reactId}-preview`}
                name="message"
                value={message}
                readOnly
                dir="auto"
                rows={10}
                className={`${inputClassName} resize-y font-mono text-sm leading-6`}
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div>
                  <label htmlFor={`${reactId}-name`} className="text-sm font-bold text-neutral-900 dark:text-white">{ui.nameLabel}</label>
                  <input id={`${reactId}-name`} name="name" required autoComplete="name" placeholder={ui.namePlaceholder} className={inputClassName} />
                </div>
                <div>
                  <label htmlFor={`${reactId}-email`} className="text-sm font-bold text-neutral-900 dark:text-white">{ui.emailLabel}</label>
                  <input id={`${reactId}-email`} name="email" type="email" required autoComplete="email" placeholder={ui.emailPlaceholder} className={inputClassName} />
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <button type="submit" disabled={isSubmitting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-wait disabled:opacity-60">
                  {isSubmitting ? ui.sending : ui.formAction}<Send aria-hidden="true" className="h-4 w-4" />
                </button>
                <a className={actionClassName} href={emailHref}><Mail aria-hidden="true" className="h-4 w-4" />{ui.emailAction}</a>
                <a className={actionClassName} href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" className="h-4 w-4" />{ui.whatsappAction}</a>
              </div>

              <p className="mt-5 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                {ui.privacyPrefix}{' '}<a className="font-bold underline underline-offset-2" href={privacyHref}>{ui.privacyLink}</a>
              </p>
              <div id={statusId} aria-live="polite" className="mt-3 min-h-6 text-sm font-semibold">
                {formStatus === 'success' && <p className="flex items-center gap-2 text-success-700 dark:text-success-400"><CheckCircle2 aria-hidden="true" className="h-4 w-4" />{ui.success}</p>}
                {formStatus === 'error' && <p className="flex items-center gap-2 text-danger-600 dark:text-danger-400"><XCircle aria-hidden="true" className="h-4 w-4" />{ui.error}</p>}
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactBriefFeature;
