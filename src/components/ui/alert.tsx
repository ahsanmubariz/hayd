import { type HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type Variant = 'info' | 'warning' | 'error' | 'success';

const VARIANTS: Record<Variant, string> = {
  info: 'bg-primary/10 text-primary border-primary/20',
  warning: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-800',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
  success: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-800',
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  title?: string;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = 'info', title, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="alert"
      className={clsx('rounded-xl border p-3 text-sm', VARIANTS[variant], className)}
      {...rest}
    >
      {title && <p className="font-medium mb-1">{title}</p>}
      {children}
    </div>
  );
});
