import { useEffect, useId, useRef, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import styles from './AuthForm.module.css';

export interface AuthField {
  name: string;
  label: string;
  type: 'email' | 'password';
  autoComplete: string;
  value: string;
  error?: string | undefined;
}

interface AuthFormProps {
  title: string;
  fields: AuthField[];
  submitLabel: string;
  submitting: boolean;
  formError?: ReactNode;
  /** Incremented on each submit so the first invalid field can take focus. */
  submitCount: number;
  onChange: (name: string, value: string) => void;
  onSubmit: () => void;
  footer: ReactNode;
}

export function AuthForm({
  title,
  fields,
  submitLabel,
  submitting,
  formError,
  submitCount,
  onChange,
  onSubmit,
  footer,
}: AuthFormProps) {
  const baseId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (submitCount === 0) return;
    formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus();
  }, [submitCount]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>{title}</h1>
      <form ref={formRef} className={styles.form} noValidate onSubmit={handleSubmit}>
        <div className={styles.fields}>
          {fields.map((field) => {
            const inputId = `${baseId}-${field.name}`;
            const errorId = `${inputId}-error`;
            return (
              <div key={field.name} className={`${styles.field} ${field.error ? styles.invalid : ''}`}>
                <label htmlFor={inputId} className="visually-hidden">
                  {field.label}
                </label>
                <input
                  id={inputId}
                  className={styles.input}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  placeholder={field.label}
                  value={field.value}
                  aria-invalid={field.error ? 'true' : undefined}
                  aria-describedby={field.error ? errorId : undefined}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(field.name, event.target.value)}
                />
                {field.error && (
                  <p id={errorId} className={styles.fieldError}>
                    {field.error}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          {formError && (
            <div role="alert" className={styles.formError}>
              {formError}
            </div>
          )}
          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitLabel}
          </button>
          <p className={styles.footer}>{footer}</p>
        </div>
      </form>
    </div>
  );
}
