import type { ReactNode } from 'react';
import { AccountControl } from '../AccountControl/AccountControl';
import { NavBar } from '../NavBar/NavBar';
import styles from './AppLayout.module.css';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <NavBar accountSlot={<AccountControl />} />
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
