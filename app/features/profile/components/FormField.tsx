import { ComponentProps } from 'react';

import styles from './FormField.module.scss';

interface FormFieldProps extends ComponentProps<'input'> {
  label: string;
  id: string;
  error?: string;
}

export function FormField({ label, id, error, ...inputProps }: FormFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={styles.formFieldGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input id={id} className={styles.input} aria-invalid={!!error} aria-describedby={errorId} {...inputProps} />
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
