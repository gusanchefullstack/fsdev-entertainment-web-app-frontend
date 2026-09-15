const ALLOWED_RETURN_PATHS = new Set(['/', '/movies', '/tv-series', '/bookmarks']);

/** Only internal browse pages are valid redirect targets; anything else goes Home. */
export function safeReturnTo(value: string | null | undefined): string {
  return value && ALLOWED_RETURN_PATHS.has(value) ? value : '/';
}
