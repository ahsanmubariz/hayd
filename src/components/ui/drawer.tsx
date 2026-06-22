import { type HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export const Drawer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Drawer(
  { className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      className={clsx(
        'fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-card p-4 shadow-xl border-t border-border',
        'sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md sm:rounded-2xl sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 sm:border',
        className,
      )}
      {...rest}
    />
  );
});

export const DrawerHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DrawerHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={clsx('mb-3 flex items-center justify-between', className)} {...rest} />;
  },
);

export const DrawerTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function DrawerTitle({ className, ...rest }, ref) {
    return <h2 ref={ref} className={clsx('text-lg font-semibold', className)} {...rest} />;
  },
);

export const DrawerContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DrawerContent({ className, ...rest }, ref) {
    return <div ref={ref} className={clsx('space-y-3', className)} {...rest} />;
  },
);
