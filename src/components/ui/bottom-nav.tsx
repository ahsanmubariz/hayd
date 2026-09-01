import type { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface NavItem {
  href: string;
  label: string;
  icon: string | ReactNode;
  active?: boolean;
}

interface BottomNavProps {
  items: NavItem[];
}

function renderIcon(icon: string | ReactNode, active?: boolean) {
  if (typeof icon !== 'string') return icon;

  switch (icon) {
    case 'home':
    case '🏠':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z" />
        </svg>
      );
    case 'calendar':
    case '📅':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case 'log':
    case '✏️':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      );
    case 'predictions':
    case '📊':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 1 0 18v-18z" fill="currentColor" fillOpacity={active ? "0.25" : "0.15"} />
          <path d="M12 3v18" />
        </svg>
      );
    case 'profile':
    case '👤':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    default:
      return <span>{icon}</span>;
  }
}

export function BottomNav({ items }: BottomNavProps) {
  return (
    <nav
      aria-label="Primary Navigation"
      className="fixed bottom-0 inset-x-0 z-40 pointer-events-none pb-safe"
    >
      <div className="mx-auto max-w-lg px-4 pb-3.5 pt-1">
        <ul className="pointer-events-auto flex items-center justify-around rounded-3xl border border-border/80 bg-card/90 px-2 py-1.5 shadow-xl shadow-stone-900/10 backdrop-blur-xl relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-white/80 dark:before:bg-white/5">
          {items.map((item) => {
            const isActive = item.active;
            return (
              <li key={item.href} className="flex-1">
                <a
                  href={item.href}
                  className={clsx(
                    'group relative flex flex-col items-center gap-1 rounded-2xl py-1.5 px-2 text-[11px] font-medium tracking-tight',
                    'transition-all duration-150 active:scale-95',
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={clsx('transition-transform duration-150', isActive ? 'scale-110 text-primary' : 'group-hover:scale-105')}>
                    {renderIcon(item.icon, isActive)}
                  </span>
                  <span className="truncate max-w-[64px]">{item.label}</span>
                  {isActive && (
                    <span className="h-1 w-4 rounded-full bg-primary shadow-xs shadow-primary/50 transition-all duration-300" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

