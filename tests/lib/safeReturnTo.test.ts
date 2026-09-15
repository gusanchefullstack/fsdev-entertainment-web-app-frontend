import { describe, expect, it } from 'vitest';
import { safeReturnTo } from '../../src/lib/safeReturnTo';

describe('safeReturnTo', () => {
  it.each(['/', '/movies', '/tv-series', '/bookmarks'])('accepts %s', (path) => {
    expect(safeReturnTo(path)).toBe(path);
  });

  it.each([null, '', '//evil.com', 'https://evil.com', '/login', '/sign-up', '/nope', 'movies'])(
    'falls back to / for %s',
    (value) => {
      expect(safeReturnTo(value)).toBe('/');
    },
  );
});
