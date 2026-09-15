import { describe, expect, it } from 'vitest';
import { normalizeTerm, resultsHeading, searchShows } from '../../src/lib/searchShows';
import { shows } from '../helpers/fixtures';

const titles = (result: ReturnType<typeof searchShows>) => result?.map((show) => show.title);

describe('searchShows', () => {
  it.each(['earth', 'EARTH', 'Ear'])('matches titles case-insensitively on any part (%s)', (term) => {
    expect(titles(searchShows(shows, term))).toEqual(expect.arrayContaining(['Beyond Earth', 'Earth’s Untouched']));
  });

  it('returns null for an empty or whitespace term', () => {
    expect(searchShows(shows, '')).toBeNull();
    expect(searchShows(shows, '   ')).toBeNull();
    expect(normalizeTerm('  ')).toBeNull();
  });

  it('trims the term and keeps catalog order', () => {
    const result = titles(searchShows(shows, ' earth '));
    expect(result).toEqual(['Beyond Earth', 'Earth’s Untouched']);
  });

  it('builds the results heading with singular and plural forms', () => {
    expect(resultsHeading(1, 'x')).toBe("Found 1 result for 'x'");
    expect(resultsHeading(0, 'zzz')).toBe("Found 0 results for 'zzz'");
    expect(resultsHeading(2, 'e')).toBe("Found 2 results for 'e'");
  });
});
