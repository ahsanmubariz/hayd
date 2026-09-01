import { type HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type Tone = 'default' | 'success' | 'warning' | 'destructive' | 'muted' | 'sage' | 'amber' | 'rose';

const TONES: Record<Tone, string> = {
  default: 'bg-primary/10 text-primary border border-primary/20',
  success: 'bg-sage/15 text-sage border border-sage/25',
  sage: 'bg-sage/15 text-sage border border-sage/25',
  warning: 'bg-amber/15 text-amber border border-amber/25',
  amber: 'bg-amber/15 text-amber border border-amber/25',
  rose: 'bg-accent/15 text-accent border border-accent/25',
  destructive: 'bg-destructive/10 text-destructive border border-destructive/20',
  muted: 'bg-muted text-muted-foreground border border-border',
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
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight',
        TONES[tone],
        className,
      )}
      {...rest}
    />
  );
});
