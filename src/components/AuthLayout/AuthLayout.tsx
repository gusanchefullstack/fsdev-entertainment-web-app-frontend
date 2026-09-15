import type { ReactNode } from 'react';
import { Link } from 'react-router';
import logo from '../../assets/logo.svg';
import styles from './AuthLayout.module.css';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <header>
        <Link to="/" className={styles.logoLink}>
          <img className={styles.logo} src={logo} alt="" />
          <span className="visually-hidden">Entertainment web app home</span>
        </Link>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
