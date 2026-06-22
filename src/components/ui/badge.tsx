import { type HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type Tone = 'default' | 'success' | 'warning' | 'destructive' | 'muted';

const TONES: Record<Tone, string> = {
  default: 'bg-primary/15 text-primary',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  destructive: 'bg-destructive/15 text-destructive',
  muted: 'bg-muted text-muted-foreground',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'default', className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
      {...rest}
    />
  );
});
