import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  userEmail?: string;
  showBack?: boolean;
  backHref?: string;
}

export function Header({ title, subtitle, action, userEmail, showBack, backHref }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          {showBack && backHref && (
            <a
              href={backHref}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 shadow-2xs"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </a>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-foreground tracking-tight">{title}</h1>
            {subtitle && <p className="truncate text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {action}
          {userEmail && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-xs font-bold text-primary shadow-xs shadow-primary/15 select-none">
                {userEmail.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

