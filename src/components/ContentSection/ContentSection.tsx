import { useId, type ReactNode } from 'react';
import styles from './ContentSection.module.css';

interface ContentSectionProps {
  title: string;
  /** 1 for the page heading on Movies / TV Series, otherwise 2. */
  headingLevel?: 1 | 2;
  titleHidden?: boolean;
  variant?: 'grid' | 'trending';
  children: ReactNode;
}

export function ContentSection({
  title,
  headingLevel = 2,
  titleHidden = false,
  variant = 'grid',
  children,
}: ContentSectionProps) {
  const headingId = useId();
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <section aria-labelledby={headingId} className={`${styles.section} ${styles[variant]}`}>
      <Heading id={headingId} className={titleHidden ? 'visually-hidden' : styles.title}>
        {title}
      </Heading>
      {children}
    </section>
  );
}
