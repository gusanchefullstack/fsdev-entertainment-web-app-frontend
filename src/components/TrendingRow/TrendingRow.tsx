import type { FocusEvent, ReactNode } from 'react';
import type { Show } from '../../api/types';
import { ShowCard } from '../ShowCard/ShowCard';
import styles from './TrendingRow.module.css';

interface TrendingRowProps {
  shows: Show[];
  renderActions?: (show: Show) => ReactNode;
}

function revealFocusedCard(event: FocusEvent<HTMLLIElement>) {
  event.currentTarget.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
}

export function TrendingRow({ shows, renderActions }: TrendingRowProps) {
  return (
    <ul className={styles.row} aria-label="Trending shows">
      {shows.map((show) => (
        <li key={show.id} className={styles.item} onFocus={revealFocusedCard}>
          <ShowCard show={show} variant="trending" actions={renderActions?.(show)} />
        </li>
      ))}
    </ul>
  );
}
