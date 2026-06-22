import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
}

export function FormField({ label, error, required, htmlFor, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className={clsx('text-sm font-medium text-foreground', required && 'after:ml-0.5 after:text-destructive after:*:content-["*"]')}
      >
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
