export type SystemAnnouncementKind = 'error' | 'success';

const systemAnnouncementMap = {
  error: {
    role: 'alert',
    'aria-live': 'assertive',
    'aria-atomic': true,
  },
  success: {
    role: 'status',
    'aria-live': 'polite',
    'aria-atomic': true,
  },
} as const;

export const getSystemAnnouncementProps = (kind: SystemAnnouncementKind) => (
  systemAnnouncementMap[kind]
);
