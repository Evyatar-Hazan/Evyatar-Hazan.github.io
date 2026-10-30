import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  CheckCircle2,
  Linkedin,
  Mail,
  MessageCircle,
  RotateCcw,
  Send,
  XCircle,
} from 'lucide-react';
import type { LocalizedPathBuilder, PortfolioSlotProps } from '../../contracts/portfolio';
import { profileLinks } from '../../data/profile';
import { HomeSectionHeader } from '../../components/sections/HomeSectionPrimitives';
import { cardSurfaceClassName } from '../../components/cardSurface';
import {
  buildContactBriefMessage,
  buildContactEmailHref,
  buildContactWhatsappHref,
  contactBriefCopy,
  contactBriefLimits,
  contactInquiryTypeIds,
  emptyContactBrief,
  getContactInquiryEmailSubject,
  getContactInquiryFields,
  type ContactBriefValues,
  type ContactBriefTextField,
  type ContactInquiryTypeId,
  type PreferredContactChannel,
} from './contactBrief';
import {
  contactIntentOptions,
  contactProjectOptions,
  generalContactContext,
  getContactContextDetails,
  type ContactContext,
  type ContactIntentId,
} from './contactIntent';

export const contactFormEndpoint = 'https://formsubmit.co/ajax/evyatarhazan3.14@gmail.com';
const submissionTimeoutMs = 12_000;

const localizedUi = {
  en: {
    eyebrow: 'PROJECT HANDOFF / 01',
    title: 'Start a project conversation.',
    description: 'Keep the portfolio context intact, use a direct channel immediately, or shape a short optional brief before you choose how to send it.',
    contextTitle: 'Conversation context',
    contextDescription: 'This public context came from the portfolio. No personal details are stored in the URL.',
    contextLabel: 'Starting point',
    projectLabel: 'Related project',
    clearContext: 'Clear context',
    directTitle: 'Direct contact',
    directDescription: 'No brief is required. A short message is enough to begin.',
    directSteps: [
      {
        label: '01 / Send',
        title: 'The need, the current situation, and the result you want.',
        description: 'Three concise points are enough. Links or screenshots are welcome when they add useful context.',
      },
      {
        label: '02 / Next',
        title: 'I will reply with focused questions and a recommended next step.',
        description: 'If there is a fit, we will turn the conversation into a short scope and a practical work plan.',
      },
    ],
    whatsapp: 'WhatsApp',
    email: 'Email',
    linkedin: 'LinkedIn',
    builderToggle: 'Build a short project brief (optional)',
    builderTitle: 'Shape the handoff before sending',
    builderDescription: 'Nothing is sent or stored while you write. Blank answers are left out of the message.',
    inquiryTypeLegend: 'What would you like to discuss?',
    fields: {
      need: { label: 'What do you need?', placeholder: 'A website, product flow, internal tool…' },
      existingSituation: { label: 'What exists today?', placeholder: 'A short description of the current situation' },
      issue: { label: 'What is not working?', placeholder: 'The main blocker or problem to solve' },
      desiredOutcome: { label: 'What outcome would make this successful?', placeholder: 'The change you want people or the team to experience' },
      timeframe: { label: 'What is the timeframe?', placeholder: 'For example: exploring, this quarter, flexible' },
      preferredChannel: { label: 'Preferred channel', placeholder: 'No preference' },
    },
    previewTitle: 'Message review',
    previewDescription: 'This exact message is used for the email and WhatsApp drafts.',
    formIdentityTitle: 'Details used only for form delivery',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    requiredHint: 'Required only when sending through the form.',
    nameRequired: 'Enter your name to send through the form.',
    emailRequired: 'Enter your email address to send through the form.',
    emailInvalid: 'Enter a valid email address.',
    errorSummary: 'Please fix the following fields:',
    formAction: 'Send with FormSubmit',
    sending: 'Sending…',
    emailAction: 'Open email draft',
    whatsappAction: 'Open WhatsApp draft',
    privacyTitle: 'Privacy and recovery',
    privacyPrefix: 'FormSubmit receives your name, email, and the reviewed message only after you press send. A hidden honeypot filters automated submissions without tracking or a CAPTCHA. The site does not save the brief locally.',
    privacyLink: 'Read the privacy notice',
    success: 'FormSubmit confirmed delivery. Your message is on its way.',
    successNextLabel: 'What happens next',
    successNext: 'I will review the context and reply with focused questions or a recommended next step. There is no fixed response-time promise.',
    error: 'Delivery was not confirmed. Your brief is still here; retry or use a draft instead.',
    timeout: 'The request timed out before delivery was confirmed. Your brief is still here.',
    retry: 'Retry form delivery',
  },
  he: {
    eyebrow: 'PROJECT HANDOFF / 01',
    title: 'פותחים שיחת פרויקט.',
    description: 'שומרים על ההקשר מהפורטפוליו, פונים מיד בערוץ ישיר או מסדרים תקציר קצר ולא־מחייב לפני שבוחרים איך להשתמש בו.',
    contextTitle: 'הקשר השיחה',
    contextDescription: 'זהו הקשר ציבורי שהגיע מהפורטפוליו. פרטים אישיים אינם נשמרים בכתובת.',
    contextLabel: 'נקודת פתיחה',
    projectLabel: 'פרויקט קשור',
    clearContext: 'ניקוי ההקשר',
    directTitle: 'יצירת קשר ישירה',
    directDescription: 'לא חייבים למלא תקציר. הודעה קצרה מספיקה כדי להתחיל.',
    directSteps: [
      {
        label: '01 / מה שולחים',
        title: 'את הצורך, המצב הנוכחי והתוצאה שרוצים להשיג.',
        description: 'שלוש נקודות קצרות מספיקות. אפשר לצרף קישור או צילום מסך אם הם מוסיפים הקשר.',
      },
      {
        label: '02 / מה קורה אחר כך',
        title: 'אחזור עם שאלות ממוקדות והמלצה לצעד הבא.',
        description: 'אם יש התאמה, נהפוך את השיחה לאפיון קצר ולתוכנית עבודה מעשית.',
      },
    ],
    whatsapp: 'WhatsApp',
    email: 'אימייל',
    linkedin: 'LinkedIn',
    builderToggle: 'הכנת תקציר פרויקט קצר (לא חובה)',
    builderTitle: 'מסדרים את ההעברה לפני השליחה',
    builderDescription: 'בזמן הכתיבה דבר לא נשלח או נשמר. תשובות ריקות לא יופיעו בהודעה.',
    inquiryTypeLegend: 'על מה תרצו לדבר?',
    fields: {
      need: { label: 'מה צריך?', placeholder: 'אתר, תהליך מוצר, כלי פנימי…' },
      existingSituation: { label: 'מה קיים היום?', placeholder: 'תיאור קצר של המצב הנוכחי' },
      issue: { label: 'מה לא עובד?', placeholder: 'החסם או הבעיה המרכזית שצריך לפתור' },
      desiredOutcome: { label: 'מהי התוצאה הרצויה?', placeholder: 'השינוי הרצוי עבור המשתמשים או הצוות' },
      timeframe: { label: 'מה לוח הזמנים?', placeholder: 'לדוגמה: בבדיקה, ברבעון הקרוב, גמיש' },
      preferredChannel: { label: 'ערוץ מועדף', placeholder: 'אין העדפה' },
    },
    previewTitle: 'בדיקת ההודעה',
    previewDescription: 'זהו הטקסט המדויק שישמש בטיוטות האימייל וה־WhatsApp.',
    formIdentityTitle: 'פרטים שנדרשים רק לשליחה דרך הטופס',
    nameLabel: 'שם',
    namePlaceholder: 'השם שלך',
    emailLabel: 'כתובת אימייל',
    emailPlaceholder: 'you@example.com',
    requiredHint: 'נדרש רק עבור שליחה דרך הטופס.',
    nameRequired: 'יש להזין שם כדי לשלוח דרך הטופס.',
    emailRequired: 'יש להזין כתובת אימייל כדי לשלוח דרך הטופס.',
    emailInvalid: 'יש להזין כתובת אימייל תקינה.',
    errorSummary: 'יש לתקן את השדות הבאים:',
    formAction: 'שליחה באמצעות FormSubmit',
    sending: 'שולח…',
    emailAction: 'פתיחת טיוטת אימייל',
    whatsappAction: 'פתיחת טיוטת WhatsApp',
    privacyTitle: 'פרטיות והתאוששות',
    privacyPrefix: 'FormSubmit מקבל את השם, האימייל וההודעה שנבדקה רק לאחר לחיצה על שליחה. שדה מלכודת מוסתר מסנן שליחות אוטומטיות בלי מעקב ובלי CAPTCHA. האתר אינו שומר את התקציר מקומית.',
    privacyLink: 'למידע נוסף בעמוד הפרטיות',
    success: 'FormSubmit אישר את המסירה. ההודעה בדרך.',
    successNextLabel: 'מה קורה עכשיו',
    successNext: 'אעבור על ההקשר ואחזור עם שאלות ממוקדות או המלצה לצעד הבא. אין כאן התחייבות לזמן תגובה קבוע.',
    error: 'המסירה לא אושרה. התקציר נשמר כאן; אפשר לנסות שוב או להשתמש בטיוטה.',
    timeout: 'הבקשה הסתיימה לפני שהמסירה אושרה. התקציר נשמר כאן.',
    retry: 'ניסיון שליחה נוסף',
  },
} as const;

const inquiryFieldPlaceholders = {
  en: {
    job: {
      need: 'For example: Full Stack Engineer or product engineering lead',
      existingSituation: 'Company, team, or hiring context',
      desiredOutcome: 'The experience or strengths that make this worth discussing',
      timeframe: 'For example: immediate, this quarter, flexible',
    },
    collaboration: {
      need: 'The idea, format, or topic you want to explore together',
      issue: 'What makes this the right moment to collaborate?',
      desiredOutcome: 'What should both sides create or learn?',
      timeframe: 'For example: one session, this quarter, flexible',
    },
  },
  he: {
    job: {
      need: 'לדוגמה: Full Stack Engineer או הובלת הנדסת מוצר',
      existingSituation: 'החברה, הצוות או הקשר הגיוס',
      desiredOutcome: 'הניסיון או החוזקות שבגללם כדאי לדבר',
      timeframe: 'לדוגמה: מיידי, ברבעון הקרוב, גמיש',
    },
    collaboration: {
      need: 'הרעיון, הפורמט או הנושא שכדאי לבדוק יחד',
      issue: 'מה הופך את זה לזמן הנכון לשתף פעולה?',
      desiredOutcome: 'מה שני הצדדים אמורים ליצור או ללמוד?',
      timeframe: 'לדוגמה: מפגש אחד, הרבעון הקרוב, גמיש',
    },
  },
} as const;

type FormErrors = Partial<Record<'name' | 'email', string>>;
type FormErrorField = keyof FormErrors;
type FormStatus = 'idle' | 'success' | 'error' | 'timeout';

export type ContactBriefFeatureProps = PortfolioSlotProps & {
  buildLocalizedPath: LocalizedPathBuilder;
  context?: ContactContext;
  id?: string;
  onContextChange?: (context: ContactContext) => void;
  titleAs?: 'h1' | 'h2';
};

const fieldClassName = 'contact-workspace-field';
const inputClassName = 'contact-workspace-input';
const actionClassName = 'home-action home-action--secondary';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

const ContactBriefFeature = ({
  language,
  className = '',
  buildLocalizedPath,
  context = generalContactContext,
  id = 'contact',
  onContextChange,
  titleAs = 'h2',
}: ContactBriefFeatureProps) => {
  const ui = localizedUi[language];
  const content = contactBriefCopy[language];
  const Title = titleAs;
  const SectionHeading = titleAs === 'h1' ? 'h2' : 'h3';
  const reactId = useId();
  const builderId = `${reactId}-builder`;
  const titleId = `${reactId}-title`;
  const statusId = `${reactId}-status`;
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState<ContactInquiryTypeId>('project');
  const [briefs, setBriefs] = useState<Record<ContactInquiryTypeId, ContactBriefValues>>({
    project: { ...emptyContactBrief },
    job: { ...emptyContactBrief },
    collaboration: { ...emptyContactBrief },
  });
  const brief = briefs[inquiryType];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const ArrowIcon = language === 'he' ? ArrowUpLeft : ArrowUpRight;
  const contextDetails = useMemo(
    () => getContactContextDetails(language, context),
    [context, language],
  );
  const intentOptions = useMemo(() => contactIntentOptions(language), [language]);
  const projectOptions = useMemo(() => contactProjectOptions(language), [language]);
  const inquiryFields = getContactInquiryFields(language, inquiryType);
  const inquiryCopy = content.inquiryTypes[inquiryType];
  const inquiryLabels = inquiryCopy.labels as Partial<Record<ContactBriefTextField, string>>;

  const message = useMemo(
    () => buildContactBriefMessage(language, brief, context, inquiryType),
    [brief, context, inquiryType, language],
  );
  const whatsappHref = buildContactWhatsappHref(profileLinks.whatsapp, message);
  const emailHref = buildContactEmailHref(profileLinks.email, language, message, context, inquiryType);
  const privacyHref = buildLocalizedPath(language, { route: 'privacy' });

  const focusErrorField = (field: FormErrorField) => {
    document.getElementById(`${reactId}-${field}`)?.focus();
  };

  useEffect(() => {
    if (formStatus === 'idle') return;
    statusRef.current?.focus();
  }, [formStatus]);

  const updateBrief = <Key extends keyof ContactBriefValues>(
    key: Key,
    value: ContactBriefValues[Key],
  ) => {
    setFormStatus('idle');
    setBriefs((current) => ({
      ...current,
      [inquiryType]: { ...current[inquiryType], [key]: value },
    }));
  };

  const updateIntent = (intent: ContactIntentId) => {
    if (!onContextChange) return;
    if (intent !== 'project') {
      onContextChange({ intent });
      return;
    }

    onContextChange({
      intent: 'project',
      projectId: context.intent === 'project' ? context.projectId : projectOptions[0]!.id,
    });
  };

  const validateIdentity = () => {
    const nextErrors: FormErrors = {};
    if (!name.trim()) nextErrors.name = ui.nameRequired;
    if (!email.trim()) nextErrors.email = ui.emailRequired;
    else if (!emailPattern.test(email.trim())) nextErrors.email = ui.emailInvalid;
    setErrors(nextErrors);
    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validateIdentity();
    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    setIsSubmitting(true);
    setFormStatus('idle');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), submissionTimeoutMs);

    try {
      const body = new FormData();
      body.set('name', name.trim());
      body.set('email', email.trim());
      body.set('message', message);
      body.set('_subject', getContactInquiryEmailSubject(language, inquiryType, context));
      body.set('_honey', honeypot);
      body.set('_captcha', 'false');

      const response = await fetch(contactFormEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => null) as { success?: boolean | string } | null;
      const confirmed = response.ok && (payload?.success === true || payload?.success === 'true');
      setFormStatus(confirmed ? 'success' : 'error');
    } catch (error) {
      setFormStatus(error instanceof DOMException && error.name === 'AbortError' ? 'timeout' : 'error');
    } finally {
      window.clearTimeout(timeout);
      setIsSubmitting(false);
    }
  };

  const statusMessage = formStatus === 'success'
    ? ui.success
    : formStatus === 'timeout'
      ? ui.timeout
      : ui.error;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      data-reader-journey-stage="contact"
      className={`home-section home-section--contact contact-workspace relative overflow-hidden ${className}`.trim()}
    >
      <div className="content-container home-section__inner">
        {Title === 'h2' ? (
          <HomeSectionHeader
            index="04"
            eyebrow={ui.eyebrow}
            titleId={titleId}
            title={ui.title}
            description={<p>{ui.description}</p>}
          />
        ) : (
          <header className="home-contact-page-header">
            <p className="home-section-label">{ui.eyebrow}</p>
            <Title id={titleId}>{ui.title}</Title>
            <p>{ui.description}</p>
          </header>
        )}

        {onContextChange && (
          <section className={cardSurfaceClassName('muted', 'contact-context-card')} aria-labelledby={`${reactId}-context-title`}>
            <div className="contact-context-card__copy">
              <p className="home-detail-label">{ui.contextTitle}</p>
              <SectionHeading id={`${reactId}-context-title`}>{contextDetails.title}</SectionHeading>
              <p>{contextDetails.description}</p>
              <small>{ui.contextDescription}</small>
            </div>
            <fieldset className="contact-context-card__controls">
              <legend className="sr-only">{ui.contextTitle}</legend>
              <label htmlFor={`${reactId}-intent`}>{ui.contextLabel}</label>
              <select
                id={`${reactId}-intent`}
                value={context.intent}
                onChange={(event) => updateIntent(event.target.value as ContactIntentId)}
              >
                {intentOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
              {context.intent === 'project' && (
                <>
                  <label htmlFor={`${reactId}-project`}>{ui.projectLabel}</label>
                  <select
                    id={`${reactId}-project`}
                    value={context.projectId}
                    onChange={(event) => onContextChange({
                      intent: 'project',
                      projectId: event.target.value as typeof context.projectId,
                    })}
                  >
                    {projectOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                </>
              )}
              {context.intent !== 'general' && (
                <button type="button" onClick={() => onContextChange(generalContactContext)}>
                  <RotateCcw aria-hidden="true" />{ui.clearContext}
                </button>
              )}
            </fieldset>
          </section>
        )}

        <section className={cardSurfaceClassName('raised', 'home-contact-panel')} aria-labelledby={`${reactId}-direct-title`}>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionHeading id={`${reactId}-direct-title`} className="text-2xl font-bold text-neutral-950 dark:text-white">{ui.directTitle}</SectionHeading>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">{ui.directDescription}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="home-action home-action--primary" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" className="h-4 w-4" />{ui.whatsapp}
              </a>
              <a className="home-action home-action--secondary" href={emailHref}>
                <Mail aria-hidden="true" className="h-4 w-4" />{ui.email}
              </a>
              <a className="home-action home-action--secondary" href={profileLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin aria-hidden="true" className="h-4 w-4" />{ui.linkedin}
              </a>
            </div>
          </div>
          <ol className="home-contact-steps" aria-label={ui.directTitle}>
            {ui.directSteps.map((step) => (
              <li key={step.label}>
                <span>{step.label}</span>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <button
          type="button"
          className="home-contact-disclosure"
          aria-expanded={isBuilderOpen}
          aria-controls={builderId}
          onClick={() => setIsBuilderOpen((open) => !open)}
        >
          {ui.builderToggle}<ArrowIcon aria-hidden="true" className="h-4 w-4" />
        </button>

        {isBuilderOpen && (
          <div id={builderId} className={cardSurfaceClassName('muted', 'contact-brief-layout')}>
            <section aria-labelledby={`${reactId}-builder-title`}>
              <SectionHeading id={`${reactId}-builder-title`} className="text-2xl font-bold text-neutral-950 dark:text-white">{ui.builderTitle}</SectionHeading>
              <p className="mt-2 leading-7 text-neutral-600 dark:text-neutral-400">{ui.builderDescription}</p>

              <fieldset className="contact-inquiry-type mt-6">
                <legend>{ui.inquiryTypeLegend}</legend>
                <div>
                  {contactInquiryTypeIds.map((type) => (
                    <label key={type} className={inquiryType === type ? 'is-selected' : ''}>
                      <input
                        type="radio"
                        name={`${reactId}-inquiry-type`}
                        value={type}
                        checked={inquiryType === type}
                        onChange={() => { setInquiryType(type); setFormStatus('idle'); }}
                      />
                      <span>{content.inquiryTypes[type].label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-6 grid gap-4">
                <legend className="sr-only">{ui.builderTitle}</legend>
                {inquiryFields.map((key) => (
                  <div key={key} className={fieldClassName}>
                    <label htmlFor={`${reactId}-${key}`}>
                      {inquiryType === 'project' ? ui.fields[key].label : inquiryLabels[key]}
                    </label>
                    <textarea
                      id={`${reactId}-${key}`}
                      rows={key === 'timeframe' ? 2 : 3}
                      maxLength={contactBriefLimits[key]}
                      value={brief[key]}
                      placeholder={inquiryType === 'project'
                        ? ui.fields[key].placeholder
                        : (inquiryFieldPlaceholders[language][inquiryType] as Partial<Record<ContactBriefTextField, string>>)[key]}
                      onChange={(event) => updateBrief(key, event.target.value)}
                      className={inputClassName}
                    />
                  </div>
                ))}

                <div className={fieldClassName}>
                  <label htmlFor={`${reactId}-preferred-channel`}>{ui.fields.preferredChannel.label}</label>
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
              </fieldset>
            </section>

            <form noValidate onSubmit={handleSubmit} className={cardSurfaceClassName('raised', 'contact-message-review')}>
              <input
                type="text"
                name="_honey"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                hidden
              />
              <SectionHeading className="text-xl font-bold text-neutral-950 dark:text-white">{ui.previewTitle}</SectionHeading>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{ui.previewDescription}</p>
              <label htmlFor={`${reactId}-preview`} className="sr-only">{ui.previewTitle}</label>
              <textarea
                id={`${reactId}-preview`}
                value={message}
                readOnly
                dir="auto"
                rows={12}
                className={`${inputClassName} resize-y font-mono text-sm leading-6`}
              />

              <fieldset className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <legend className="col-span-full mb-1 text-sm font-black text-neutral-950 dark:text-white">{ui.formIdentityTitle}</legend>
                <div>
                  <label htmlFor={`${reactId}-name`} className="text-sm font-bold text-neutral-900 dark:text-white">{ui.nameLabel}</label>
                  <input
                    id={`${reactId}-name`}
                    name="name"
                    required
                    maxLength={100}
                    autoComplete="name"
                    placeholder={ui.namePlaceholder}
                    value={name}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={`${reactId}-identity-hint`}
                    aria-errormessage={errors.name ? `${reactId}-name-error` : undefined}
                    onChange={(event) => { setName(event.target.value); setErrors((current) => ({ ...current, name: undefined })); }}
                    className={inputClassName}
                  />
                  {errors.name && <p id={`${reactId}-name-error`} className="contact-field-error">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor={`${reactId}-email`} className="text-sm font-bold text-neutral-900 dark:text-white">{ui.emailLabel}</label>
                  <input
                    id={`${reactId}-email`}
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    inputMode="email"
                    dir="ltr"
                    placeholder={ui.emailPlaceholder}
                    value={email}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={`${reactId}-identity-hint`}
                    aria-errormessage={errors.email ? `${reactId}-email-error` : undefined}
                    onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined })); }}
                    className={inputClassName}
                  />
                  {errors.email && <p id={`${reactId}-email-error`} className="contact-field-error">{errors.email}</p>}
                </div>
                <p id={`${reactId}-identity-hint`} className="col-span-full text-xs text-neutral-500 dark:text-neutral-400">{ui.requiredHint}</p>
              </fieldset>

              {Object.keys(errors).length > 0 && (
                <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="contact-error-summary">
                  <strong>{ui.errorSummary}</strong>
                  <ul>
                    {(Object.entries(errors) as [FormErrorField, string][]).map(([field, error]) => (
                      <li key={field}>
                        <button type="button" onClick={() => focusErrorField(field)}>{error}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-5 grid gap-3">
                <button type="submit" disabled={isSubmitting} className="home-action home-action--primary disabled:cursor-wait disabled:opacity-60">
                  {isSubmitting ? ui.sending : ui.formAction}<Send aria-hidden="true" className="h-4 w-4" />
                </button>
                <a className={actionClassName} href={emailHref}><Mail aria-hidden="true" className="h-4 w-4" />{ui.emailAction}</a>
                <a className={actionClassName} href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" className="h-4 w-4" />{ui.whatsappAction}</a>
              </div>

              <section className="contact-privacy-note" aria-labelledby={`${reactId}-privacy-title`}>
                <h3 id={`${reactId}-privacy-title`}>{ui.privacyTitle}</h3>
                <p>{ui.privacyPrefix} <a href={privacyHref}>{ui.privacyLink}</a></p>
              </section>

              {formStatus !== 'idle' && (
                <div
                  ref={statusRef}
                  id={statusId}
                  tabIndex={-1}
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className={`contact-delivery-status is-${formStatus}`}
                >
                  {formStatus === 'success'
                    ? <CheckCircle2 aria-hidden="true" />
                    : <XCircle aria-hidden="true" />}
                  {formStatus === 'success' ? (
                    <div className="contact-delivery-status__copy">
                      <p>{statusMessage}</p>
                      <p><strong>{ui.successNextLabel}:</strong> {ui.successNext}</p>
                    </div>
                  ) : <p>{statusMessage}</p>}
                  {formStatus !== 'success' && (
                    <button type="submit" disabled={isSubmitting}>{ui.retry}</button>
                  )}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactBriefFeature;
