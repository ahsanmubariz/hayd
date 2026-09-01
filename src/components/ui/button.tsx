import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'sage' | 'amber';
type Size = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-xs hover:opacity-95 active:scale-[0.98]',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 active:scale-[0.98]',
  ghost: 'bg-transparent text-foreground hover:bg-muted active:scale-[0.98]',
  destructive: 'bg-destructive text-destructive-foreground hover:opacity-90 active:scale-[0.98]',
  outline: 'border border-border bg-card text-foreground hover:bg-muted/70 active:scale-[0.98] shadow-xs',
  sage: 'bg-sage text-sage-foreground shadow-xs hover:opacity-95 active:scale-[0.98]',
  amber: 'bg-amber text-amber-foreground shadow-xs hover:opacity-95 active:scale-[0.98]',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3.5 text-xs font-medium rounded-xl',
  md: 'h-10 px-4 text-sm font-medium rounded-xl',
  lg: 'h-12 px-6 text-sm font-semibold rounded-2xl',
  icon: 'h-10 w-10 p-0 rounded-xl',
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
        'inline-flex items-center justify-center gap-2 select-none cursor-pointer',
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
