import { Link } from 'react-router';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Page not found</h1>
      <Link className={styles.link} to="/">
        Go to Home
      </Link>
    </main>
  );
}
