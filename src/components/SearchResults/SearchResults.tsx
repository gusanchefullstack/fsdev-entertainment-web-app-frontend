import type { Show } from '../../api/types';
import { resultsHeading } from '../../lib/searchShows';
import { renderBookmarkButton } from '../BookmarkButton/BookmarkButton';
import { ShowGrid } from '../ShowGrid/ShowGrid';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  term: string;
  results: Show[];
}

export function SearchResults({ term, results }: SearchResultsProps) {
  const heading = resultsHeading(results.length, term);
  return (
    <section aria-label={heading} className={styles.section}>
      <div aria-live="polite">
        <h2 className={styles.heading}>{heading}</h2>
      </div>
      {results.length > 0 && <ShowGrid shows={results} renderActions={renderBookmarkButton} />}
    </section>
  );
}
