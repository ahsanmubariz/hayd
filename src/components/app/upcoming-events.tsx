import type { ReactNode } from 'react';
import { useTranslation } from '@/lib/i18n/use-translation';

interface UpcomingEventsProps {
  nextPeriodDate: string | null;
  predictedOvulationDate: string | null;
  fertileStart: string | null;
  fertileEnd: string | null;
  confidenceBand: 'low' | 'medium' | null;
}

function formatShortDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function daysFromNow(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso + 'T12:00:00');
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

export function UpcomingEvents({
  nextPeriodDate,
  predictedOvulationDate,
  fertileStart,
  fertileEnd,
  confidenceBand,
}: UpcomingEventsProps) {
  const { t } = useTranslation();
  const today = new Date().toISOString().slice(0, 10);
  const events: Array<{
    icon: ReactNode;
    label: string;
    date: string;
    days: number;
    highlight?: boolean;
    tone: 'vermilion' | 'sage' | 'amber';
  }> = [];

  if (nextPeriodDate && nextPeriodDate >= today) {
    const days = daysFromNow(nextPeriodDate);
    events.push({
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" fillOpacity="0.25" />
        </svg>
      ),
      label: t('upcoming.next_period'),
      date: formatShortDate(nextPeriodDate),
      days,
      highlight: days <= 3,
      tone: 'vermilion',
    });
  }

  if (predictedOvulationDate && predictedOvulationDate >= today) {
    const days = daysFromNow(predictedOvulationDate);
    events.push({
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-sage">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3.5" fill="currentColor" />
        </svg>
      ),
      label: t('upcoming.ovulation'),
      date: formatShortDate(predictedOvulationDate),
      days,
      highlight: days <= 2,
      tone: 'sage',
    });
  }

  if (fertileStart && fertileEnd && fertileEnd >= today) {
    const startDays = daysFromNow(fertileStart);
    const endDays = daysFromNow(fertileEnd);
    if (endDays > 0) {
      events.push({
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-sage">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        ),
        label: t('upcoming.fertile_window'),
        date: `${formatShortDate(fertileStart)} - ${formatShortDate(fertileEnd)}`,
        days: startDays,
        highlight: startDays <= 2 && endDays >= 0,
        tone: 'sage',
      });
    }
  }

  events.sort((a, b) => a.days - b.days);

  if (events.length === 0) {
    return (
      <div className="text-center py-6 select-none">
        <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground border border-border">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="3" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-foreground tracking-tight">{t('upcoming.no_events')}</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
          {t('upcoming.log_more')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 select-none">
      {events.map((event) => (
        <div
          key={event.label}
          className={`flex items-center justify-between rounded-2xl p-3 border transition-all duration-150 shadow-2xs ${
            event.highlight
              ? 'bg-primary/5 border-primary/25 shadow-xs shadow-primary/10'
              : 'bg-card border-border/80 hover:border-border'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/70 border border-border">
              {event.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground tracking-tight truncate">{event.label}</p>
              <p className="text-[11px] text-muted-foreground truncate">{event.date}</p>
            </div>
          </div>
          <div className="text-right shrink-0 pl-3">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums ${
                event.highlight ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-muted text-foreground'
              }`}
            >
              {event.days === 0 ? t('upcoming.today') : `${event.days}d`}
            </span>
          </div>
        </div>
      ))}
      {confidenceBand === 'low' && (
        <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-muted-foreground/90 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-amber">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{t('upcoming.low_confidence')}</span>
        </div>
      )}
    </div>
  );
}

