import type { CSSProperties } from 'react';
import type { Show } from '../../api/types';
import emptyIcon from '../../assets/icon-bookmark-empty.svg';
import fullIcon from '../../assets/icon-bookmark-full.svg';
import { useBookmarks } from '../../context/BookmarksContext';
import styles from './BookmarkButton.module.css';

export function BookmarkButton({ show }: { show: Show }) {
  const { isBookmarked, toggle } = useBookmarks();
  const bookmarked = isBookmarked(show.id);
  const icon = bookmarked ? fullIcon : emptyIcon;

  return (
    <button
      type="button"
      className={styles.button}
      aria-pressed={bookmarked}
      data-bookmarked={bookmarked}
      onClick={() => toggle(show)}
    >
      <span className={styles.icon} style={{ '--icon': `url("${icon}")` } as CSSProperties} aria-hidden="true" />
      <span className="visually-hidden">
        {bookmarked ? `Remove ${show.title} from bookmarks` : `Bookmark ${show.title}`}
      </span>
    </button>
  );
}

export const renderBookmarkButton = (show: Show) => <BookmarkButton show={show} />;
