import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

type Variant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

const VARIANTS: Record<Variant, string> = {
  info: 'bg-muted/70 text-foreground border-border',
  success: 'bg-sage/10 text-foreground border-sage/30',
  warning: 'bg-amber/10 text-foreground border-amber/30',
  error: 'bg-destructive/10 text-foreground border-destructive/30',
};

const ICONS: Record<Variant, string> = {
  info: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
};

export function Alert({ variant = 'info', className, children, ...rest }: AlertProps) {
  return (
    <div
      role="alert"
      className={clsx(
        'flex items-start gap-3 rounded-2xl border p-3.5 text-xs leading-relaxed shadow-xs',
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      <svg
        className="h-4 w-4 shrink-0 mt-0.5 opacity-80"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[variant]} />
      </svg>
      <div className="flex-1">{children}</div>
    </div>
  );
}
