import type { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
}

interface BottomNavProps {
  items: NavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm"
    >
      <ul className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={clsx(
                'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs',
                'transition-colors',
                item.active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              aria-current={item.active ? 'page' : undefined}
            >
              <span className="text-lg" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
