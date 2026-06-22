import { useTranslation } from '@/lib/i18n/use-translation';

interface CycleRingProps {
  cycleDay: number;
  avgCycleLength: number | null;
  nextPeriodDate: string | null;
  isInPeriod: boolean;
  periodDay: number | null;
}

export function CycleRing({
  cycleDay,
  avgCycleLength,
  nextPeriodDate,
  isInPeriod,
  periodDay,
}: CycleRingProps) {
  const { t } = useTranslation();
  const cycleLength = avgCycleLength ?? 28;

  // Days until next period
  let daysUntil = 0;
  if (nextPeriodDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next = new Date(nextPeriodDate);
    next.setHours(0, 0, 0, 0);
    daysUntil = Math.max(0, Math.round((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  }

  // Phase determination
  let phaseLabel = t('ring.follicular');

  if (isInPeriod) {
    phaseLabel = t('ring.period_day', periodDay ?? cycleDay);
  } else if (daysUntil > 0 && daysUntil <= 5) {
    phaseLabel = t('ring.late_luteal');
  } else if (daysUntil > 5 && daysUntil <= 14) {
    phaseLabel = t('ring.ovulation_approaching');
  } else {
    phaseLabel = t('ring.follicular');
  }

  // SVG ring math
  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(cycleDay / cycleLength, 1);
  const dashOffset = circumference * (1 - progress);
  const center = size / 2;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={isInPeriod ? 'var(--color-primary)' : 'var(--color-accent)'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {t('ring.cycle_day')}
          </span>
          <span className="text-4xl font-bold text-foreground leading-none mt-0.5">
            {cycleDay}
          </span>
          <span className="text-[11px] text-muted-foreground mt-1">
            {t('ring.of_days', cycleLength)}
          </span>
        </div>
      </div>

      {/* Phase label */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: isInPeriod
              ? 'var(--color-primary)'
              : 'var(--color-accent)',
          }}
        />
        <span className="text-sm font-medium text-foreground">{phaseLabel}</span>
      </div>

      {/* Days until next period */}
      {daysUntil > 0 && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {t('ring.next_period_in', daysUntil)}
        </p>
      )}
      {daysUntil === 0 && !isInPeriod && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {t('ring.expected_today')}
        </p>
      )}
    </div>
  );
}
