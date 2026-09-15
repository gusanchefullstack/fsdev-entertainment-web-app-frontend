import type { Show } from '../api/types';

export function normalizeTerm(raw: string): string | null {
  const term = raw.trim();
  return term ? term : null;
}

/** Case-insensitive substring match on titles, keeping order; null when there is no search. */
export function searchShows(shows: Show[], raw: string): Show[] | null {
  const term = normalizeTerm(raw);
  if (!term) return null;
  const needle = term.toLowerCase();
  return shows.filter((show) => show.title.toLowerCase().includes(needle));
}

export function resultsHeading(count: number, raw: string): string {
  return `Found ${count} ${count === 1 ? 'result' : 'results'} for '${raw.trim()}'`;
}
