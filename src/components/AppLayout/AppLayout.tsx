import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { AccountControl } from '../AccountControl/AccountControl';
import { NavBar } from '../NavBar/NavBar';
import styles from './AppLayout.module.css';
import { LayoutEventsContext } from './LayoutEvents';

export function AppLayout({ children }: { children: ReactNode }) {
  const [searchActivity, setSearchActivity] = useState(0);
  const notifySearchActivity = useCallback(() => setSearchActivity((count) => count + 1), []);
  const events = useMemo(() => ({ searchActivity, notifySearchActivity }), [searchActivity, notifySearchActivity]);

  return (
    <LayoutEventsContext value={events}>
      <div className={styles.layout}>
        <header className={styles.header}>
          <NavBar accountSlot={<AccountControl />} />
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </LayoutEventsContext>
  );
}
