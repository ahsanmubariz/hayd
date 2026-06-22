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

const MARK_COLORS: Record<string, string> = {
  period: 'bg-primary text-primary-foreground',
  predicted: 'bg-primary/20 text-primary',
  ovulation: 'bg-accent text-accent-foreground',
  fertile: 'bg-accent/30 text-accent-foreground',
};

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
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={t('calendar_grid.prev_month')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="text-center">
          <h3 className="text-sm font-semibold text-foreground">
            {MONTH_NAMES[month]} {year}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={t('calendar_grid.next_month')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground mb-1">
        {weekdays.map((w, i) => (
          <div key={i} className="py-1">{w}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
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
                'relative aspect-square rounded-full text-sm font-medium transition-colors',
                'flex items-center justify-center',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                mark && MARK_COLORS[mark],
                isToday && !mark && 'border-2 border-primary text-primary',
                isSelected && !mark && 'ring-2 ring-primary ring-offset-1 ring-offset-card',
                isSelected && mark && 'ring-2 ring-foreground ring-offset-1 ring-offset-card',
                !mark && !isToday && !isSelected && 'hover:bg-muted text-foreground',
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
