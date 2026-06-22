import { type HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Skeleton({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={clsx('animate-pulse rounded-xl bg-muted', className)}
        {...rest}
      />
    );
  },
);
