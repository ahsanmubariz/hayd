import { type HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export const Dialog = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Dialog(
  { className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      className={clsx(
        'fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4',
        className,
      )}
      {...rest}
    />
  );
});

export const DialogContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DialogContent({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={clsx(
          'w-full max-w-md rounded-2xl bg-card p-5 shadow-xl border border-border',
          className,
        )}
        {...rest}
      />
    );
  },
);

export const DialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DialogHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={clsx('mb-3', className)} {...rest} />;
  },
);

export const DialogTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function DialogTitle({ className, ...rest }, ref) {
    return <h2 ref={ref} className={clsx('text-lg font-semibold', className)} {...rest} />;
  },
);

export const DialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DialogFooter({ className, ...rest }, ref) {
    return (
      <div ref={ref} className={clsx('mt-4 flex justify-end gap-2', className)} {...rest} />
    );
  },
);
