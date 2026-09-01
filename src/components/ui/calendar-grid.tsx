import { useState } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from '@/lib/i18n/use-translation';

interface CalendarGridProps {
  initialMonth?: string;
  today: string;
  markedDates: Map<string, 'period' | 'predicted' | 'ovulation' | 'fertile'>;
  selectedDate?: string;
  onSelect: (date: string) => void;
}

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

export function CalendarGrid({
  initialMonth,
  today,
  markedDates,
  selectedDate,
  onSelect,
}: CalendarGridProps) {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(initialMonth ?? today.slice(0, 7));
  const { year, month } = fromMonthStr(currentMonth);

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

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="select-none p-1.5">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3 px-1">
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
        <div className="text-center">
          <h3 className="text-sm font-semibold text-foreground tracking-tight">
            {MONTH_NAMES[month]} <span className="font-normal text-muted-foreground">{year}</span>
          </h3>
        </div>
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

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase mb-1">
        {weekdays.map((w, i) => (
          <div key={i} className="py-1">{w}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`e-${idx}`} className="aspect-square" />;
          const dateStr = `${currentMonth}-${String(day).padStart(2, '0')}`;
          const mark = markedDates.get(dateStr);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={`d-${day}`}
              type="button"
              onClick={() => onSelect(dateStr)}
              className={clsx(
                'relative aspect-square rounded-2xl text-xs font-medium transition-all duration-150',
                'flex flex-col items-center justify-center cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                // Base styles
                !mark && !isToday && !isSelected && 'hover:bg-muted/60 text-foreground',
                // Mark styles
                mark === 'period' && 'bg-primary text-primary-foreground font-semibold shadow-xs shadow-primary/20 hover:brightness-105 active:scale-95',
                mark === 'predicted' && 'bg-primary/10 text-primary border border-primary/30 border-dashed hover:bg-primary/15 active:scale-95',
                mark === 'ovulation' && 'bg-sage text-sage-foreground font-semibold shadow-xs shadow-sage/20 hover:brightness-105 active:scale-95',
                mark === 'fertile' && 'bg-sage/10 text-sage border border-sage/30 hover:bg-sage/15 active:scale-95',
                // Today marker
                isToday && !mark && 'border border-primary/50 text-primary font-bold bg-primary/5',
                // Selected marker
                isSelected && 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105 z-10 font-bold',
              )}
            >
              <span className="tabular-nums">{day}</span>
              {/* Subtle indicator dot below number */}
              {mark === 'period' && (
                <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-white/90" />
              )}
              {mark === 'ovulation' && (
                <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-white/90" />
              )}
              {isToday && !mark && (
                <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

