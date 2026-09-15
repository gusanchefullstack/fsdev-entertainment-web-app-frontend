import type { ErrorCode } from '../api/types';

export type MessageKey = ErrorCode | 'CATALOG_LOAD' | 'BOOKMARK_SAVE' | 'SESSION_ENDED' | 'NO_BOOKMARKS';

const FALLBACK = 'Something went wrong. Please try again.';

const MESSAGES: Partial<Record<MessageKey, string>> = {
  CATALOG_LOAD: "We couldn't load shows right now.",
  BOOKMARK_SAVE: "We couldn't update your bookmarks. Please try again.",
  SESSION_ENDED: 'Your session has ended. Please log in again.',
  NO_BOOKMARKS: "You haven't bookmarked any shows yet.",
  EMAIL_TAKEN: 'An account with this email already exists.',
  INVALID_CREDENTIALS: 'Incorrect email or password.',
  SIGN_IN_PAUSED: 'Too many attempts. Please try again in a few minutes.',
  VALIDATION_ERROR: 'Please check the highlighted fields.',
};

export function friendlyMessage(key: MessageKey): string {
  return MESSAGES[key] ?? FALLBACK;
}
