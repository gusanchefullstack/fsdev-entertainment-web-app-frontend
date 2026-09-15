import styles from './Toast.module.css';

export function Toast({ message }: { message: string | null }) {
  return (
    <div role="status" aria-live="polite" className={styles.region}>
      {message && <p className={styles.toast}>{message}</p>}
    </div>
  );
}
