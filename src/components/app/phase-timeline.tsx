import { daysBetween, addDays } from '@/lib/utils/dates';
import { useTranslation } from '@/lib/i18n/use-translation';

interface PhaseTimelineProps {
  avgCycleLength: number | null;
  nextPeriodDate: string | null;
  lastPeriodStart: string;
  avgPeriodLength: number | null;
  predictedOvulationDate: string | null;
  fertileStart: string | null;
  fertileEnd: string | null;
}

export function PhaseTimeline({
  avgCycleLength,
  nextPeriodDate,
  lastPeriodStart,
  avgPeriodLength,
  predictedOvulationDate,
  fertileStart,
  fertileEnd,
}: PhaseTimelineProps) {
  const { t } = useTranslation();
  const cycleLength = avgCycleLength ?? 28;
  const periodLen = avgPeriodLength ?? 5;
  const today = new Date().toISOString().slice(0, 10);
  const startDate = lastPeriodStart;
  const endDate = nextPeriodDate ?? addDays(startDate, cycleLength);
  const totalDays = daysBetween(startDate, endDate);

  // Helper: position as percentage
  const pos = (date: string) => {
    const d = daysBetween(startDate, date);
    return Math.max(0, Math.min(100, (d / totalDays) * 100));
  };

  // Period range
  const periodStartPct = pos(startDate);
  const periodEndPct = pos(addDays(startDate, periodLen - 1));

  // Today marker
  const todayPct = pos(today);

  return (
    <div className="w-full">
      {/* Timeline labels */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5 px-0.5">
        <span>{t('timeline.period_start')}</span>
        <span>{t('timeline.cycle_length', cycleLength)}</span>
      </div>

      {/* Timeline bar */}
      <div className="relative h-8 w-full">
        {/* Background track */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 rounded-full bg-muted" />

        {/* Period block */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 rounded-l-full bg-primary/70"
          style={{
            left: `${periodStartPct}%`,
            width: `${Math.max(periodEndPct - periodStartPct, 2)}%`,
          }}
        />

        {/* Fertile window */}
        {fertileStart && fertileEnd && (
          <div
            className="absolute top-1/2 -translate-y-1/2 h-3 bg-accent/40"
            style={{
              left: `${pos(fertileStart)}%`,
              width: `${Math.max(pos(fertileEnd) - pos(fertileStart), 3)}%`,
            }}
          />
        )}

        {/* Ovulation dot */}
        {predictedOvulationDate && (
          <div
            className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-accent border-2 border-card shadow-sm z-10"
            style={{ left: `calc(${pos(predictedOvulationDate)}% - 8px)` }}
            title={t('timeline.ovulation')}
          />
        )}

        {/* Today marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 z-20"
          style={{ left: `${todayPct}%` }}
        >
          <div className="flex flex-col items-center">
            <div className="h-5 w-0.5 bg-foreground rounded-full" />
            <div className="h-3 w-3 rounded-full bg-foreground border-2 border-card shadow-sm -mt-0.5" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
          {t('timeline.period')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
          {t('timeline.fertile_window')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-accent border border-card" />
          {t('timeline.ovulation')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground border border-card" />
          {t('timeline.today')}
        </span>
      </div>
    </div>
  );
}
