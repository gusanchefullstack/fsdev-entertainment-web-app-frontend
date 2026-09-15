import { useId, useState, type ReactNode } from 'react';
import type { Show } from '../../api/types';
import movieIcon from '../../assets/icon-category-movie.svg';
import tvIcon from '../../assets/icon-category-tv.svg';
import playIcon from '../../assets/icon-play.svg';
import styles from './ShowCard.module.css';

interface ShowCardProps {
  show: Show;
  variant: 'regular' | 'trending';
  actions?: ReactNode;
}

export function ShowCard({ show, variant, actions }: ShowCardProps) {
  const titleId = useId();
  const [imageFailed, setImageFailed] = useState(false);
  const trending = variant === 'trending' ? show.thumbnail.trending : undefined;
  const isTrending = variant === 'trending';

  return (
    <article
      aria-labelledby={titleId}
      className={`${styles.card} ${isTrending ? styles.trending : styles.regular}`}
      tabIndex={isTrending ? 0 : undefined}
    >
      <div className={styles.media}>
        {imageFailed ? (
          <div className={styles.placeholder} data-thumbnail-placeholder />
        ) : (
          <picture>
            {trending ? (
              <source media="(min-width: 768px)" srcSet={trending.large} />
            ) : (
              <>
                <source media="(min-width: 1024px)" srcSet={show.thumbnail.regular.large} />
                <source media="(min-width: 768px)" srcSet={show.thumbnail.regular.medium} />
              </>
            )}
            <img
              className={styles.image}
              src={trending ? trending.small : show.thumbnail.regular.small}
              alt=""
              loading={isTrending ? 'eager' : 'lazy'}
              data-thumbnail
              onError={() => setImageFailed(true)}
            />
          </picture>
        )}
        <div className={styles.playOverlay} data-play-overlay aria-hidden="true">
          <span className={styles.playPill}>
            <img className={styles.playIcon} src={playIcon} alt="" />
            Play
          </span>
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      <div className={styles.info}>
        <p className={styles.meta}>
          <span>{show.year}</span>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.category}>
            <img
              className={styles.categoryIcon}
              src={show.category === 'Movie' ? movieIcon : tvIcon}
              alt=""
              aria-hidden="true"
            />
            {show.category}
          </span>
          <span className={styles.dot} aria-hidden="true" />
          <span>{show.rating}</span>
        </p>
        <h3 id={titleId} className={styles.title}>
          {show.title}
        </h3>
      </div>
    </article>
  );
}
