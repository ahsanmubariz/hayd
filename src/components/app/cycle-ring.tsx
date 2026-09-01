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
  let phaseTone: 'vermilion' | 'rose' | 'sage' | 'amber' = 'rose';

  if (isInPeriod) {
    phaseLabel = t('ring.period_day', periodDay ?? cycleDay);
    phaseTone = 'vermilion';
  } else if (daysUntil > 0 && daysUntil <= 5) {
    phaseLabel = t('ring.late_luteal');
    phaseTone = 'amber';
  } else if (daysUntil > 5 && daysUntil <= 14) {
    phaseLabel = t('ring.ovulation_approaching');
    phaseTone = 'sage';
  } else {
    phaseLabel = t('ring.follicular');
    phaseTone = 'rose';
  }

  // SVG Geometry
  const size = 220;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(cycleDay / cycleLength, 0.04), 1);
  const dashOffset = circumference * (1 - progress);
  const center = size / 2;

  // Colors based on phase
  const phaseColors = {
    vermilion: 'var(--color-primary)',
    rose: 'var(--color-accent)',
    sage: 'var(--color-sage)',
    amber: 'var(--color-amber)',
  };

  const currentStroke = phaseColors[phaseTone];

  return (
    <div className="flex flex-col items-center py-2 select-none">
      {/* Outer Ceramic Disc Container */}
      <div
        className="relative flex items-center justify-center rounded-full p-2.5 bg-gradient-to-b from-card via-card to-muted/40 border border-border/80 shadow-md shadow-stone-900/5 relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/60 before:to-transparent dark:before:from-white/5"
        style={{ width: size + 20, height: size + 20 }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={currentStroke} stopOpacity="1" />
              <stop offset="70%" stopColor={currentStroke} stopOpacity="0.9" />
              <stop offset="100%" stopColor={currentStroke} stopOpacity="0.7" />
            </linearGradient>
            <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={currentStroke} floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Outer dashed orbit track */}
          <circle
            cx={center}
            cy={center}
            r={radius + 6}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="2 4"
            className="opacity-60"
          />

          {/* Background ceramic groove track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth={strokeWidth}
            className="opacity-80"
          />

          {/* Active Phase Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            filter="url(#ringGlow)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Ceramic Plate with Inset Glaze */}
        <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-card border border-border/70 shadow-inner overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:bg-radial before:from-white/40 before:to-transparent dark:before:from-white/5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80">
            {t('ring.cycle_day')}
          </span>
          <div className="flex items-baseline gap-0.5 mt-0.5">
            <span className="text-4xl font-bold tracking-tighter text-foreground tabular-nums">
              {cycleDay}
            </span>
            <span className="text-xs text-muted-foreground/70 font-medium tabular-nums">
              /{cycleLength}
            </span>
          </div>
          
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-muted/60 text-foreground border border-border/70 shadow-2xs">
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: currentStroke }}
            />
            <span className="truncate max-w-[115px]">{phaseLabel}</span>
          </div>
        </div>
      </div>

      {/* Auxiliary Status Pill */}
      {daysUntil > 0 && (
        <div className="mt-3.5 flex items-center gap-1.5 rounded-full bg-card border border-border/80 px-3.5 py-1 text-xs text-muted-foreground shadow-2xs">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="font-medium">{t('ring.next_period_in', daysUntil)}</span>
        </div>
      )}
      {daysUntil === 0 && !isInPeriod && (
        <div className="mt-3.5 flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-semibold text-primary shadow-2xs">
          <span>{t('ring.expected_today')}</span>
        </div>
      )}
    </div>
  );
}

