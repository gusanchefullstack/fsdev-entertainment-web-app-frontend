import type { ReactNode } from 'react';
import type { Show } from '../../api/types';
import { ShowCard } from '../ShowCard/ShowCard';
import styles from './ShowGrid.module.css';

interface ShowGridProps {
  shows: Show[];
  renderActions?: (show: Show) => ReactNode;
}

export function ShowGrid({ shows, renderActions }: ShowGridProps) {
  return (
    <ul className={styles.grid}>
      {shows.map((show) => (
        <li key={show.id}>
          <ShowCard show={show} variant="regular" actions={renderActions?.(show)} />
        </li>
      ))}
    </ul>
  );
}
