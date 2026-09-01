import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'sage' | 'amber';
type Size = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:brightness-105 active:scale-[0.98] border border-primary/30 relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-white/25',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/90 active:scale-[0.98] border border-border/80 shadow-2xs',
  ghost:
    'bg-transparent text-foreground hover:bg-muted/70 active:scale-[0.98]',
  destructive:
    'bg-destructive text-destructive-foreground hover:opacity-90 active:scale-[0.98] shadow-sm shadow-destructive/20 border border-destructive/30',
  outline:
    'border border-border bg-card text-foreground hover:bg-muted/60 active:scale-[0.98] shadow-2xs relative before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-white/60 dark:before:bg-white/5',
  sage:
    'bg-sage text-sage-foreground shadow-sm shadow-sage/20 hover:brightness-105 active:scale-[0.98] border border-sage/30 relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-white/25',
  amber:
    'bg-amber text-amber-foreground shadow-sm shadow-amber/20 hover:brightness-105 active:scale-[0.98] border border-amber/30 relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-white/25',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs font-semibold rounded-xl gap-1.5',
  md: 'h-10 px-4 text-xs font-semibold rounded-xl gap-2',
  lg: 'h-12 px-6 text-sm font-semibold rounded-2xl gap-2.5',
  icon: 'h-10 w-10 p-0 rounded-xl justify-center',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={clsx(
        'inline-flex items-center justify-center select-none cursor-pointer tracking-tight',
        'transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    />
  );
});

