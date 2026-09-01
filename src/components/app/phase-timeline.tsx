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
  const totalDays = Math.max(daysBetween(startDate, endDate), 1);

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
    <div className="w-full select-none py-1">
      {/* Timeline boundary labels */}
      <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-2 px-1">
        <span>{t('timeline.period_start')}</span>
        <span className="tabular-nums">{t('timeline.cycle_length', cycleLength)}</span>
      </div>

      {/* Timeline track container */}
      <div className="relative h-7 w-full rounded-full bg-muted/60 p-1 border border-border/80 shadow-inner flex items-center overflow-hidden">
        {/* Background rhythm ticks */}
        <div className="absolute inset-0 flex justify-between px-3 pointer-events-none opacity-20">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-full w-[1px] bg-foreground/40" />
          ))}
        </div>

        {/* Period segment */}
        <div
          className="absolute h-5 rounded-full bg-gradient-to-r from-primary to-primary/85 shadow-xs shadow-primary/30 transition-all duration-500"
          style={{
            left: `${periodStartPct}%`,
            width: `${Math.max(periodEndPct - periodStartPct, 4)}%`,
          }}
          title={t('timeline.period')}
        />

        {/* Fertile window segment */}
        {fertileStart && fertileEnd && (
          <div
            className="absolute h-5 rounded-full bg-sage/20 border border-sage/35 transition-all duration-500"
            style={{
              left: `${pos(fertileStart)}%`,
              width: `${Math.max(pos(fertileEnd) - pos(fertileStart), 5)}%`,
            }}
            title={t('timeline.fertile_window')}
          />
        )}

        {/* Ovulation milestone dot */}
        {predictedOvulationDate && (
          <div
            className="absolute h-6 w-6 rounded-full bg-sage border-2 border-card shadow-sm z-10 transition-all duration-500 flex items-center justify-center"
            style={{ left: `calc(${pos(predictedOvulationDate)}% - 12px)` }}
            title={t('timeline.ovulation')}
          >
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          </div>
        )}

        {/* Today pin marker */}
        <div
          className="absolute z-20 transition-all duration-500"
          style={{ left: `calc(${todayPct}% - 7px)` }}
        >
          <div className="flex flex-col items-center">
            <div className="h-5 w-3.5 rounded-full bg-foreground border border-card shadow-md flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-background" />
            </div>
          </div>
        </div>
      </div>

      {/* Legend with Tactile Micro Badges */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mt-3.5 px-1 text-[11px] text-muted-foreground font-medium">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" />
          {t('timeline.period')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sage/40 border border-sage" />
          {t('timeline.fertile_window')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sage" />
          {t('timeline.ovulation')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-foreground" />
          {t('timeline.today')}
        </span>
      </div>
    </div>
  );
}

