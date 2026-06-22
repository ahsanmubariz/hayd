import { type HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

const TabsContext = ({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx('flex', className)} {...rest}>
    {children}
  </div>
);

export const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function TabsList({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="tablist"
        className={clsx('inline-flex rounded-xl bg-muted p-1', className)}
        {...rest}
      />
    );
  },
);

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  active?: boolean;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger({ active, className, ...rest }, ref) {
    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={active}
        className={clsx(
          'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
          active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          className,
        )}
        {...rest}
      />
    );
  },
);

export const Tabs = { Provider: TabsContext, List: TabsList, Trigger: TabsTrigger };
