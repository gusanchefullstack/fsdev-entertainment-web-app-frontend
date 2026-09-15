import type { CSSProperties, ReactNode } from 'react';
import { Link, NavLink } from 'react-router';
import homeIcon from '../../assets/icon-nav-home.svg';
import bookmarkIcon from '../../assets/icon-nav-bookmark.svg';
import moviesIcon from '../../assets/icon-nav-movies.svg';
import tvSeriesIcon from '../../assets/icon-nav-tv-series.svg';
import logo from '../../assets/logo.svg';
import styles from './NavBar.module.css';

const LINKS = [
  { to: '/', label: 'Home', icon: homeIcon },
  { to: '/movies', label: 'Movies', icon: moviesIcon },
  { to: '/tv-series', label: 'TV Series', icon: tvSeriesIcon },
  { to: '/bookmarks', label: 'Bookmarked shows', icon: bookmarkIcon },
];

export function NavBar({ accountSlot }: { accountSlot?: ReactNode }) {
  return (
    <nav className={styles.nav} aria-label="Main">
      <Link to="/" className={styles.logoLink}>
        <img className={styles.logo} src={logo} alt="" />
        <span className="visually-hidden">Entertainment web app home</span>
      </Link>
      <ul className={styles.links}>
        {LINKS.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end
              className={styles.link}
              style={{ '--icon': `url("${icon}")` } as CSSProperties}
            >
              <span className={styles.icon} aria-hidden="true" />
              <span className="visually-hidden">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className={styles.account}>{accountSlot}</div>
    </nav>
  );
}
