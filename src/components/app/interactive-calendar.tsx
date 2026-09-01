import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from '@/lib/i18n/use-translation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { daysBetween, addDays } from '@/lib/utils/dates';
import type { DailyStatusLog, PeriodLog } from '@/lib/db/schema';

export interface CalendarPredictionData {
  predictedNextPeriodDate: string | null;
  predictedOvulationDate: string | null;
  predictedFertileStart: string | null;
  predictedFertileEnd: string | null;
  averageCycleLength: number | null;
}

interface InteractiveCalendarProps {
  today: string;
  periodLogs: PeriodLog[];
  dailyLogs: DailyStatusLog[];
  prediction: CalendarPredictionData | null;
}

type FilterType = 'all' | 'period' | 'fertile' | 'logs';

function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 1)).getUTCDay();
}

function toMonthStr(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function fromMonthStr(month: string): { year: number; month: number } {
  const [y, m] = month.split('-').map(Number);
  return { year: y, month: m - 1 };
}

function addMonths(month: string, delta: number): string {
  const { year, month: m } = fromMonthStr(month);
  const date = new Date(Date.UTC(year, m + delta, 1));
  return toMonthStr(date.getUTCFullYear(), date.getUTCMonth());
}

function formatInspectorDate(isoDate: string, lang: string): string {
  const d = new Date(isoDate + 'T12:00:00');
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  return d.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function InteractiveCalendar({
  today,
  periodLogs,
  dailyLogs,
  prediction,
}: InteractiveCalendarProps) {
  const { t, lang } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(today.slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const { year, month } = fromMonthStr(currentMonth);

  // Month Names
  const MONTH_NAMES = [
    t('calendar.january'),
    t('calendar.february'),
    t('calendar.march'),
    t('calendar.april'),
    t('calendar.may'),
    t('calendar.june'),
    t('calendar.july'),
    t('calendar.august'),
    t('calendar.september'),
    t('calendar.october'),
    t('calendar.november'),
    t('calendar.december'),
  ];

  // Map of daily status logs by date
  const dailyLogsMap = useMemo(() => {
    const map = new Map<string, DailyStatusLog>();
    for (const log of dailyLogs) {
      map.set(log.log_date, log);
    }
    return map;
  }, [dailyLogs]);

  // Map of marked dates
  const markedDates = useMemo(() => {
    const map = new Map<string, 'period' | 'predicted' | 'ovulation' | 'fertile'>();

    // 1. Actual period logs
    for (const log of periodLogs) {
      let d = log.start_date;
      while (d <= log.end_date) {
        map.set(d, 'period');
        d = addDays(d, 1);
      }
    }

    // 2. Predictions
    if (prediction) {
      if (prediction.predictedFertileStart && prediction.predictedFertileEnd) {
        let d = prediction.predictedFertileStart;
        while (d <= prediction.predictedFertileEnd) {
          if (!map.has(d)) map.set(d, 'fertile');
          d = addDays(d, 1);
        }
      }
      if (prediction.predictedOvulationDate && !map.has(prediction.predictedOvulationDate)) {
        map.set(prediction.predictedOvulationDate, 'ovulation');
      }
      if (prediction.predictedNextPeriodDate && !map.has(prediction.predictedNextPeriodDate)) {
        map.set(prediction.predictedNextPeriodDate, 'predicted');
      }
    }

    return map;
  }, [periodLogs, prediction]);

  // Calendar cells
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Month Statistics for Viewed Month
  const monthStats = useMemo(() => {
    let periodCount = 0;
    let logsCount = 0;
    let hasFertileOrOvulation = false;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentMonth}-${String(d).padStart(2, '0')}`;
      const mark = markedDates.get(dateStr);
      if (mark === 'period' || mark === 'predicted') periodCount++;
      if (mark === 'fertile' || mark === 'ovulation') hasFertileOrOvulation = true;
      if (dailyLogsMap.has(dateStr)) logsCount++;
    }

    return { periodCount, logsCount, hasFertileOrOvulation };
  }, [currentMonth, daysInMonth, markedDates, dailyLogsMap]);

  // Selected Day Details
  const selectedMark = markedDates.get(selectedDate);
  const selectedLog = dailyLogsMap.get(selectedDate);
  
  // Find matching period log if applicable
  const selectedPeriodLog = useMemo(() => {
    return periodLogs.find(
      (p) => selectedDate >= p.start_date && selectedDate <= p.end_date
    );
  }, [selectedDate, periodLogs]);

  // Cycle day computation for selected date
  const selectedCycleInfo = useMemo(() => {
    if (periodLogs.length === 0) return null;
    
    // Find the latest period log that started on or before selectedDate
    const pastPeriods = periodLogs
      .filter((p) => p.start_date <= selectedDate)
      .sort((a, b) => b.start_date.localeCompare(a.start_date));

    if (pastPeriods.length === 0) return null;

    const currentPeriod = pastPeriods[0];
    const cycleDay = daysBetween(currentPeriod.start_date, selectedDate) + 1;
    const isPeriodDay = selectedDate <= currentPeriod.end_date;
    const periodDayNum = isPeriodDay ? cycleDay : null;

    return { cycleDay, isPeriodDay, periodDayNum };
  }, [selectedDate, periodLogs]);

  return (
    <div className="space-y-4 select-none">
      {/* ===== Month Quick Telemetry Strip ===== */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-card border border-border/80 p-3 shadow-2xs">
          <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
            {t('timeline.period')}
          </span>
          <span className="text-lg font-bold text-primary mt-0.5 tabular-nums">
            {monthStats.periodCount}d
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-card border border-border/80 p-3 shadow-2xs">
          <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
            {t('timeline.fertile_window')}
          </span>
          <span className="text-lg font-bold text-sage mt-0.5">
            {monthStats.hasFertileOrOvulation ? 'Active' : 'None'}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-card border border-border/80 p-3 shadow-2xs">
          <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
            {t('calendar.filter_logs')}
          </span>
          <span className="text-lg font-bold text-foreground mt-0.5 tabular-nums">
            {monthStats.logsCount}
          </span>
        </div>
      </div>

      {/* ===== Main Porcelain Calendar Dish ===== */}
      <Card className="p-3.5 shadow-sm shadow-stone-900/5">
        {/* Month Navigation & Today Leap Button */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all shadow-2xs"
              aria-label={t('calendar_grid.prev_month')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all shadow-2xs"
              aria-label={t('calendar_grid.next_month')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              {MONTH_NAMES[month]} <span className="font-semibold text-muted-foreground tabular-nums">{year}</span>
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              const cur = today.slice(0, 7);
              setCurrentMonth(cur);
              setSelectedDate(today);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted active:scale-95 transition-all shadow-2xs"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span>{t('calendar.today_btn')}</span>
          </button>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: t('calendar.filter_all') },
            { id: 'period', label: t('calendar.filter_period') },
            { id: 'fertile', label: t('calendar.filter_fertile') },
            { id: 'logs', label: t('calendar.filter_logs') },
          ].map((flt) => (
            <button
              key={flt.id}
              type="button"
              onClick={() => setActiveFilter(flt.id as FilterType)}
              className={clsx(
                'rounded-full px-3 py-1 text-[11px] font-semibold transition-all shadow-2xs whitespace-nowrap',
                activeFilter === flt.id
                  ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60'
              )}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 text-center text-[10px] font-semibold tracking-wider text-muted-foreground/75 uppercase mb-1.5">
          {weekdays.map((w, i) => (
            <div key={i} className="py-1">{w}</div>
          ))}
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="aspect-square" />;

            const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
            const mark = markedDates.get(dateStr);
            const hasLog = dailyLogsMap.has(dateStr);
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDate;

            // Filter visibility check
            let isDimmed = false;
            if (activeFilter === 'period' && mark !== 'period' && mark !== 'predicted') isDimmed = true;
            if (activeFilter === 'fertile' && mark !== 'fertile' && mark !== 'ovulation') isDimmed = true;
            if (activeFilter === 'logs' && !hasLog) isDimmed = true;

            return (
              <button
                key={`cell-${day}`}
                type="button"
                onClick={() => setSelectedDate(dateStr)}
                className={clsx(
                  'relative aspect-square rounded-2xl text-xs font-medium transition-all duration-150',
                  'flex flex-col items-center justify-center cursor-pointer select-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                  isDimmed && 'opacity-25',
                  // Base state
                  !mark && !isToday && !isSelected && 'hover:bg-muted/70 text-foreground bg-card/40 border border-transparent',
                  // Mark styles
                  mark === 'period' && 'bg-primary text-primary-foreground font-semibold shadow-xs shadow-primary/20 hover:brightness-105 active:scale-95',
                  mark === 'predicted' && 'bg-primary/10 text-primary border border-primary/30 border-dashed hover:bg-primary/15 active:scale-95 font-semibold',
                  mark === 'ovulation' && 'bg-sage text-sage-foreground font-semibold shadow-xs shadow-sage/25 hover:brightness-105 active:scale-95',
                  mark === 'fertile' && 'bg-sage/15 text-sage border border-sage/30 hover:bg-sage/20 active:scale-95 font-semibold',
                  // Today marker
                  isToday && !mark && 'border border-primary/50 text-primary font-bold bg-primary/5',
                  // Selected marker
                  isSelected && 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105 z-10 font-bold shadow-md shadow-stone-900/10'
                )}
              >
                <span className="tabular-nums">{day}</span>

                {/* Micro Indicators */}
                <div className="absolute bottom-1 flex items-center gap-0.5 pointer-events-none">
                  {mark === 'period' && (
                    <span className="h-1 w-1 rounded-full bg-white/90" />
                  )}
                  {mark === 'ovulation' && (
                    <span className="h-1 w-1 rounded-full bg-white/90" />
                  )}
                  {isToday && !mark && (
                    <span className="h-1 w-1 rounded-full bg-primary" />
                  )}
                  {hasLog && (
                    <span
                      className={clsx(
                        'h-1 w-1 rounded-full',
                        mark === 'period' || mark === 'ovulation' ? 'bg-white/60' : 'bg-amber'
                      )}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* ===== Tactile Day Inspector Dish ===== */}
      <Card className="border-border/80 shadow-sm shadow-stone-900/5">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t('calendar.day_details')}
              </span>
              <h4 className="text-sm font-bold text-foreground tracking-tight capitalize mt-0.5">
                {formatInspectorDate(selectedDate, lang)}
              </h4>
            </div>
            
            {/* Phase / Cycle Day Badge */}
            {selectedCycleInfo && (
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-muted/80 text-foreground border border-border/80 shadow-2xs">
                <span
                  className={clsx(
                    'h-1.5 w-1.5 rounded-full',
                    selectedMark === 'period' ? 'bg-primary' : selectedMark === 'ovulation' || selectedMark === 'fertile' ? 'bg-sage' : 'bg-accent'
                  )}
                />
                <span className="tabular-nums">
                  {selectedCycleInfo.isPeriodDay
                    ? t('calendar.period_day_n', selectedCycleInfo.periodDayNum ?? 1)
                    : t('calendar.cycle_day_n', selectedCycleInfo.cycleDay)}
                </span>
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-1 space-y-3">
          {/* Daily Status Chips if Logged */}
          {selectedLog ? (
            <div className="space-y-2.5">
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedLog.bleeding_status && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 px-3 py-1 text-xs font-semibold text-primary shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="capitalize">{selectedLog.bleeding_status}</span>
                  </span>
                )}
                {selectedLog.pain_level != null && (
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-2xs',
                      selectedLog.pain_level >= 7
                        ? 'bg-destructive/10 text-destructive border-destructive/25'
                        : selectedLog.pain_level >= 4
                          ? 'bg-amber/15 text-amber border-amber/30'
                          : 'bg-sage/15 text-sage border-sage/30'
                    )}
                  >
                    <span
                      className={clsx(
                        'h-1.5 w-1.5 rounded-full',
                        selectedLog.pain_level >= 7 ? 'bg-destructive' : selectedLog.pain_level >= 4 ? 'bg-amber' : 'bg-sage'
                      )}
                    />
                    <span className="tabular-nums">{t('quick_log.pain', selectedLog.pain_level)}</span>
                  </span>
                )}
                {selectedLog.mood && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 border border-border px-3 py-1 text-xs font-semibold text-foreground shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="capitalize">{selectedLog.mood}</span>
                  </span>
                )}
                {selectedLog.energy_level != null && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 border border-border px-3 py-1 text-xs font-semibold text-foreground shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                    <span className="tabular-nums">{t('quick_log.energy', selectedLog.energy_level)}</span>
                  </span>
                )}
              </div>

              {selectedLog.notes && (
                <div className="rounded-2xl bg-muted/35 p-3 border border-border/60 text-xs text-muted-foreground leading-relaxed italic">
                  "{selectedLog.notes}"
                </div>
              )}
            </div>
          ) : selectedPeriodLog ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 px-3 py-1 font-semibold text-primary shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{t('calendar.period')}</span>
                  {selectedPeriodLog.flow_intensity && (
                    <span className="capitalize">({selectedPeriodLog.flow_intensity})</span>
                  )}
                </span>
              </div>
              {selectedPeriodLog.notes && (
                <div className="rounded-2xl bg-muted/35 p-3 border border-border/60 text-xs text-muted-foreground leading-relaxed italic">
                  "{selectedPeriodLog.notes}"
                </div>
              )}
            </div>
          ) : (
            <div className="py-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>{t('calendar.no_log_for_day')}</span>
            </div>
          )}

          {/* Quick Deep Actions for Selected Day */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <a href={`/app/log?date=${selectedDate}&tab=status`} className="block">
              <Button variant="outline" className="w-full h-10 text-xs font-semibold shadow-2xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                {t('calendar.log_for_date')}
              </Button>
            </a>
            <a href={`/app/log?date=${selectedDate}&tab=period`} className="block">
              <Button className="w-full h-10 text-xs font-semibold shadow-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                {t('calendar.mark_period_date')}
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* ===== Legend Porcelain Dish ===== */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            {t('calendar.legend')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="flex items-center gap-2 rounded-2xl bg-primary/10 p-2.5 border border-primary/20">
              <span className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 shadow-xs" />
              <span className="font-semibold text-foreground">{t('calendar.period')}</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-primary/5 p-2.5 border border-primary/25 border-dashed">
              <span className="h-2.5 w-2.5 rounded-full bg-primary/40 shrink-0" />
              <span className="font-semibold text-foreground">{t('calendar.predicted')}</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-sage/10 p-2.5 border border-sage/25">
              <span className="h-2.5 w-2.5 rounded-full bg-sage shrink-0 shadow-xs" />
              <span className="font-semibold text-foreground">{t('calendar.ovulation')}</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-sage/5 p-2.5 border border-sage/20">
              <span className="h-2.5 w-2.5 rounded-full bg-sage/40 shrink-0" />
              <span className="font-semibold text-foreground">{t('calendar.fertile_window')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
