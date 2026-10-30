import type { PortfolioLanguage } from '../../data/portfolioCapabilities';
import {
  generalContactContext,
  getContactContextDetails,
  type ContactContext,
} from './contactIntent';

export type PreferredContactChannel = '' | 'form' | 'email' | 'whatsapp';

export const contactInquiryTypeIds = ['project', 'job', 'collaboration'] as const;
export type ContactInquiryTypeId = (typeof contactInquiryTypeIds)[number];

export type ContactBriefValues = {
  need: string;
  existingSituation: string;
  issue: string;
  desiredOutcome: string;
  timeframe: string;
  preferredChannel: PreferredContactChannel;
};

export type ContactBriefTextField = Exclude<keyof ContactBriefValues, 'preferredChannel'>;

export const emptyContactBrief: ContactBriefValues = {
  need: '',
  existingSituation: '',
  issue: '',
  desiredOutcome: '',
  timeframe: '',
  preferredChannel: '',
};

type ContactBriefCopy = {
  defaultMessage: string;
  greeting: string;
  inquiryTypes: Record<ContactInquiryTypeId, {
    label: string;
    introduction: string;
    emailSubject: string;
    fields: readonly ContactBriefTextField[];
    labels: Partial<Record<ContactBriefTextField, string>>;
  }>;
  inquiryTypeLabel: string;
  preferredChannelLabel: string;
  channelLabels: Record<Exclude<PreferredContactChannel, ''>, string>;
};

export const contactBriefCopy = {
  en: {
    defaultMessage: 'Hi Evyatar, I saw your website and would like to talk about a project.',
    greeting: 'Hi Evyatar,',
    inquiryTypes: {
      project: {
        label: 'Project',
        introduction: 'I would like to talk about a project.',
        emailSubject: 'Project inquiry from the portfolio',
        fields: ['need', 'existingSituation', 'issue', 'desiredOutcome', 'timeframe'],
        labels: {
          need: 'What I need',
          existingSituation: 'Existing situation',
          issue: 'Main issue',
          desiredOutcome: 'Desired outcome',
          timeframe: 'Timeframe',
        },
      },
      job: {
        label: 'Role or opportunity',
        introduction: 'I would like to talk about a role or professional opportunity.',
        emailSubject: 'Role opportunity from the portfolio',
        fields: ['need', 'existingSituation', 'desiredOutcome', 'timeframe'],
        labels: {
          need: 'Role or opportunity',
          existingSituation: 'Company or team',
          desiredOutcome: 'Why this looks relevant',
          timeframe: 'Start date or timing',
        },
      },
      collaboration: {
        label: 'Collaboration',
        introduction: 'I would like to explore a collaboration.',
        emailSubject: 'Collaboration inquiry from the portfolio',
        fields: ['need', 'issue', 'desiredOutcome', 'timeframe'],
        labels: {
          need: 'Collaboration idea',
          issue: 'Why now',
          desiredOutcome: 'Shared outcome',
          timeframe: 'Timing',
        },
      },
    },
    inquiryTypeLabel: 'Inquiry type',
    preferredChannelLabel: 'Preferred channel',
    channelLabels: {
      form: 'Contact form',
      email: 'Email',
      whatsapp: 'WhatsApp',
    },
  },
  he: {
    defaultMessage: 'היי אביתר, ראיתי את האתר שלך ורוצה לדבר על פרויקט.',
    greeting: 'היי אביתר,',
    inquiryTypes: {
      project: {
        label: 'פרויקט',
        introduction: 'אשמח לדבר על פרויקט.',
        emailSubject: 'פנייה לגבי פרויקט מהפורטפוליו',
        fields: ['need', 'existingSituation', 'issue', 'desiredOutcome', 'timeframe'],
        labels: {
          need: 'מה אני צריך/ה',
          existingSituation: 'המצב הקיים',
          issue: 'הבעיה המרכזית',
          desiredOutcome: 'התוצאה הרצויה',
          timeframe: 'לוח זמנים',
        },
      },
      job: {
        label: 'משרה או הזדמנות',
        introduction: 'אשמח לדבר על משרה או הזדמנות מקצועית.',
        emailSubject: 'פנייה לגבי משרה מהפורטפוליו',
        fields: ['need', 'existingSituation', 'desiredOutcome', 'timeframe'],
        labels: {
          need: 'המשרה או ההזדמנות',
          existingSituation: 'החברה או הצוות',
          desiredOutcome: 'למה זה נראה רלוונטי',
          timeframe: 'מועד התחלה או תזמון',
        },
      },
      collaboration: {
        label: 'שיתוף פעולה',
        introduction: 'אשמח לבדוק אפשרות לשיתוף פעולה.',
        emailSubject: 'פנייה לשיתוף פעולה מהפורטפוליו',
        fields: ['need', 'issue', 'desiredOutcome', 'timeframe'],
        labels: {
          need: 'רעיון לשיתוף הפעולה',
          issue: 'למה עכשיו',
          desiredOutcome: 'התוצאה המשותפת',
          timeframe: 'תזמון',
        },
      },
    },
    inquiryTypeLabel: 'סוג הפנייה',
    preferredChannelLabel: 'ערוץ מועדף',
    channelLabels: {
      form: 'טופס באתר',
      email: 'אימייל',
      whatsapp: 'WhatsApp',
    },
  },
} as const satisfies Record<PortfolioLanguage, ContactBriefCopy>;

export const contactBriefLimits = {
  need: 1200,
  existingSituation: 1600,
  issue: 1600,
  desiredOutcome: 1200,
  timeframe: 500,
} as const;

export const normalizeContactBriefText = (value: string) => value
  .replace(/\r\n?/gu, '\n')
  .split('\n')
  .map((line) => line.trim().replace(/[\t ]+/gu, ' '))
  .join('\n')
  .replace(/\n{3,}/gu, '\n\n')
  .trim();

export const hasContactBriefDetails = (values: ContactBriefValues) =>
  Object.values(values).some((value) => value.trim().length > 0);

export const getContactInquiryFields = (
  language: PortfolioLanguage,
  inquiryType: ContactInquiryTypeId,
) => contactBriefCopy[language].inquiryTypes[inquiryType].fields;

export const getContactInquiryEmailSubject = (
  language: PortfolioLanguage,
  inquiryType: ContactInquiryTypeId,
  context: ContactContext = generalContactContext,
) => inquiryType === 'project' && context.intent !== 'general'
  ? getContactContextDetails(language, context).emailSubject
  : contactBriefCopy[language].inquiryTypes[inquiryType].emailSubject;

export const buildContactBriefMessage = (
  language: PortfolioLanguage,
  values: ContactBriefValues,
  context: ContactContext = generalContactContext,
  inquiryType: ContactInquiryTypeId = 'project',
) => {
  const copy = contactBriefCopy[language];
  const inquiry = copy.inquiryTypes[inquiryType];
  if (!hasContactBriefDetails(values) && context.intent === 'general' && inquiryType === 'project') {
    return copy.defaultMessage;
  }

  const lines = [copy.greeting, inquiry.introduction, '', `${copy.inquiryTypeLabel}: ${inquiry.label}`];
  if (context.intent !== 'general' && inquiryType === 'project') {
    const contextDetails = getContactContextDetails(language, context);
    lines.push(`${contextDetails.messageLabel}: ${contextDetails.title}`);
  }
  lines.push('');

  inquiry.fields.forEach((key) => {
    const value = normalizeContactBriefText(values[key]);
    const label = (inquiry.labels as Partial<Record<ContactBriefTextField, string>>)[key];
    if (value && label) lines.push(`${label}: ${value}`);
  });

  if (values.preferredChannel) {
    lines.push(
      `${copy.preferredChannelLabel}: ${copy.channelLabels[values.preferredChannel]}`,
    );
  }

  return lines.join('\n').trimEnd();
};

export const buildContactEmailHref = (
  recipientHref: string,
  language: PortfolioLanguage,
  message: string,
  context: ContactContext = generalContactContext,
  inquiryType: ContactInquiryTypeId = 'project',
) => {
  const separator = recipientHref.includes('?') ? '&' : '?';
  const query = new URLSearchParams({
    subject: getContactInquiryEmailSubject(language, inquiryType, context),
    body: message,
  });

  return `${recipientHref}${separator}${query.toString()}`;
};

export const buildContactWhatsappHref = (baseHref: string, message: string) => {
  const separator = baseHref.includes('?') ? '&' : '?';
  return `${baseHref}${separator}text=${encodeURIComponent(message)}`;
};
