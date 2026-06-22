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
    icon: string;
    label: string;
    date: string;
    days: number;
    highlight?: boolean;
    color: string;
  }> = [];

  if (nextPeriodDate && nextPeriodDate >= today) {
    const days = daysFromNow(nextPeriodDate);
    events.push({
      icon: '🩸',
      label: t('upcoming.next_period'),
      date: formatShortDate(nextPeriodDate),
      days,
      highlight: days <= 3,
      color: 'primary',
    });
  }

  if (predictedOvulationDate && predictedOvulationDate >= today) {
    const days = daysFromNow(predictedOvulationDate);
    events.push({
      icon: '🥚',
      label: t('upcoming.ovulation'),
      date: formatShortDate(predictedOvulationDate),
      days,
      highlight: days <= 2,
      color: 'accent',
    });
  }

  if (fertileStart && fertileEnd && fertileEnd >= today) {
    const startDays = daysFromNow(fertileStart);
    const endDays = daysFromNow(fertileEnd);
    // Only show if not already past
    if (endDays > 0) {
      events.push({
        icon: '✨',
        label: t('upcoming.fertile_window'),
        date: `${formatShortDate(fertileStart)} – ${formatShortDate(fertileEnd)}`,
        days: startDays,
        highlight: startDays <= 2 && endDays >= 0,
        color: 'secondary',
      });
    }
  }

  // Sort by days ascending
  events.sort((a, b) => a.days - b.days);

  if (events.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-2xl mb-2">📅</p>
        <p className="text-sm font-medium text-foreground">{t('upcoming.no_events')}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t('upcoming.log_more')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {events.map((event) => (
        <div
          key={event.label}
          className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-colors ${
            event.highlight
              ? 'bg-primary/8 border border-primary/15'
              : 'bg-muted/50'
          }`}
        >
          <span className="text-xl shrink-0">{event.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{event.label}</p>
            <p className="text-xs text-muted-foreground">{event.date}</p>
          </div>
          <div className="text-right shrink-0">
            <p
              className={`text-sm font-bold ${
                event.highlight ? 'text-primary' : 'text-foreground'
              }`}
            >
              {event.days === 0 ? t('upcoming.today') : `${event.days}d`}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {event.days === 0 ? '' : event.days === 1 ? t('upcoming.tomorrow') : t('upcoming.away')}
            </p>
          </div>
        </div>
      ))}
      {confidenceBand === 'low' && (
        <p className="text-[10px] text-muted-foreground text-center pt-1">
          ⚠️ {t('upcoming.low_confidence')}
        </p>
      )}
    </div>
  );
}
