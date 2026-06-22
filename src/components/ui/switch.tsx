import { type InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  size?: 'sm' | 'md';
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, size = 'md', className, id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  const trackH = size === 'sm' ? 'h-5' : 'h-6';
  const trackW = size === 'sm' ? 'w-9' : 'w-11';
  const dot = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <label htmlFor={inputId} className={clsx('inline-flex items-center gap-2 cursor-pointer', className)}>
      <input
        ref={ref}
        type="checkbox"
        id={inputId}
        className="peer sr-only"
        {...rest}
      />
      <span
        className={clsx(
          'relative rounded-full bg-muted transition-colors',
          'peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring',
          trackH,
          trackW,
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 left-0.5 rounded-full bg-white shadow transition-transform',
            'peer-checked:translate-x-full',
            dot,
          )}
        />
      </span>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
});
