import type { ReactNode } from 'react';
import { NavBar } from '../NavBar/NavBar';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
  accountSlot?: ReactNode;
}

export function AppLayout({ children, accountSlot }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <NavBar accountSlot={accountSlot} />
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
