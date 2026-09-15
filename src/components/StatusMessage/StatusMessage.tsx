import styles from './StatusMessage.module.css';

type StatusMessageProps =
  | { variant: 'loading' }
  | { variant: 'error'; message: string; onRetry: () => void }
  | { variant: 'empty'; message: string };

const PLACEHOLDER_CARDS = 8;

export function StatusMessage(props: StatusMessageProps) {
  if (props.variant === 'loading') {
    return (
      <div className={styles.loading}>
        <p role="status" className="visually-hidden">
          Loading shows
        </p>
        <ul className={styles.placeholders} aria-hidden="true">
          {Array.from({ length: PLACEHOLDER_CARDS }, (_, index) => (
            <li key={index} className={styles.placeholder} />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.message}>
      <p className={styles.text}>{props.message}</p>
      {props.variant === 'error' && (
        <button type="button" className={styles.retry} onClick={props.onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
