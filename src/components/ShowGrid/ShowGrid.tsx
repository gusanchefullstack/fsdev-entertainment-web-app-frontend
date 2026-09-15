import type { ReactNode } from 'react';
import type { Show } from '../../api/types';
import { ShowCard } from '../ShowCard/ShowCard';
import styles from './ShowGrid.module.css';

interface ShowGridProps {
  shows: Show[];
  renderActions?: (show: Show) => ReactNode;
  cardHeadingLevel?: 2 | 3;
}

export function ShowGrid({ shows, renderActions, cardHeadingLevel = 3 }: ShowGridProps) {
  return (
    <ul className={styles.grid}>
      {shows.map((show) => (
        <li key={show.id}>
          <ShowCard show={show} variant="regular" actions={renderActions?.(show)} headingLevel={cardHeadingLevel} />
        </li>
      ))}
    </ul>
  );
}
