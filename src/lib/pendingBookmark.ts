const KEY = 'pendingBookmark';

export interface PendingBookmark {
  showId: string;
  returnTo: string;
}

export function savePendingBookmark(pending: PendingBookmark): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(pending));
  } catch {
    // Storage unavailable (private mode): the bookmark simply is not resumed after sign-in.
  }
}

export function readPendingBookmark(): PendingBookmark | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as PendingBookmark).showId === 'string' &&
      typeof (parsed as PendingBookmark).returnTo === 'string'
    ) {
      return parsed as PendingBookmark;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearPendingBookmark(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}
