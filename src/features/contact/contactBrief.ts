import type { PortfolioLanguage } from '../../data/portfolioCapabilities';
import {
  generalContactContext,
  getContactContextDetails,
  type ContactContext,
} from './contactIntent';

export type PreferredContactChannel = '' | 'form' | 'email' | 'whatsapp';

export type ContactBriefValues = {
  need: string;
  existingSituation: string;
  issue: string;
  desiredOutcome: string;
  timeframe: string;
  preferredChannel: PreferredContactChannel;
};

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
  introduction: string;
  labels: Record<Exclude<keyof ContactBriefValues, 'preferredChannel'>, string>;
  preferredChannelLabel: string;
  channelLabels: Record<Exclude<PreferredContactChannel, ''>, string>;
  emailSubject: string;
};

export const contactBriefCopy = {
  en: {
    defaultMessage: 'Hi Evyatar, I saw your website and would like to talk about a project.',
    greeting: 'Hi Evyatar,',
    introduction: 'I would like to talk about a project.',
    labels: {
      need: 'What I need',
      existingSituation: 'Existing situation',
      issue: 'Main issue',
      desiredOutcome: 'Desired outcome',
      timeframe: 'Timeframe',
    },
    preferredChannelLabel: 'Preferred channel',
    channelLabels: {
      form: 'Contact form',
      email: 'Email',
      whatsapp: 'WhatsApp',
    },
    emailSubject: 'Project inquiry from the portfolio',
  },
  he: {
    defaultMessage: 'היי אביתר, ראיתי את האתר שלך ורוצה לדבר על פרויקט.',
    greeting: 'היי אביתר,',
    introduction: 'אשמח לדבר על פרויקט.',
    labels: {
      need: 'מה אני צריך/ה',
      existingSituation: 'המצב הקיים',
      issue: 'הבעיה המרכזית',
      desiredOutcome: 'התוצאה הרצויה',
      timeframe: 'לוח זמנים',
    },
    preferredChannelLabel: 'ערוץ מועדף',
    channelLabels: {
      form: 'טופס באתר',
      email: 'אימייל',
      whatsapp: 'WhatsApp',
    },
    emailSubject: 'פנייה לגבי פרויקט מהפורטפוליו',
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

export const buildContactBriefMessage = (
  language: PortfolioLanguage,
  values: ContactBriefValues,
  context: ContactContext = generalContactContext,
) => {
  const copy = contactBriefCopy[language];
  if (!hasContactBriefDetails(values) && context.intent === 'general') return copy.defaultMessage;

  const lines = [copy.greeting, copy.introduction, ''];
  if (context.intent !== 'general') {
    const contextDetails = getContactContextDetails(language, context);
    lines.push(`${contextDetails.messageLabel}: ${contextDetails.title}`, '');
  }

  (['need', 'existingSituation', 'issue', 'desiredOutcome', 'timeframe'] as const).forEach((key) => {
    const value = normalizeContactBriefText(values[key]);
    if (value) lines.push(`${copy.labels[key]}: ${value}`);
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
) => {
  const separator = recipientHref.includes('?') ? '&' : '?';
  const query = new URLSearchParams({
    subject: context.intent === 'general'
      ? contactBriefCopy[language].emailSubject
      : getContactContextDetails(language, context).emailSubject,
    body: message,
  });

  return `${recipientHref}${separator}${query.toString()}`;
};

export const buildContactWhatsappHref = (baseHref: string, message: string) => {
  const separator = baseHref.includes('?') ? '&' : '?';
  return `${baseHref}${separator}text=${encodeURIComponent(message)}`;
};
