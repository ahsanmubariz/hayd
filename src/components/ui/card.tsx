import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-3xl border border-border/80 bg-card text-card-foreground',
        'shadow-sm shadow-stone-900/5 transition-all duration-200 relative overflow-hidden',
        'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-white/80 dark:before:bg-white/5',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('flex flex-col space-y-1 p-5 pb-2.5', className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={clsx(
        'font-semibold text-foreground tracking-tight text-sm md:text-base',
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={clsx('text-xs text-muted-foreground leading-relaxed', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('p-5 pt-1', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('flex items-center p-5 pt-2 border-t border-border/50', className)}
      {...props}
    />
  );
}

