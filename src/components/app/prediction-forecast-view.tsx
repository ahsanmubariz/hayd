import { useState } from 'react';
import { clsx } from 'clsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/use-translation';
import { addDays, daysBetween } from '@/lib/utils/dates';

interface PredictionForecastViewProps {
  today: string;
  predictedNextPeriodDate?: string;
  predictedOvulationDate?: string;
  predictedFertileStart?: string;
  predictedFertileEnd?: string;
  averageCycleLengthUsed?: number;
  averagePeriodLengthUsed?: number;
  cyclesConsidered?: number;
  confidenceBand?: 'low' | 'medium';
  confidenceReason?: string;
  algorithmVersion?: string;
}

function formatDateFriendly(isoDate: string, lang: string): string {
  const d = new Date(isoDate + 'T12:00:00');
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  return d.toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatDateFull(isoDate: string, lang: string): string {
  const d = new Date(isoDate + 'T12:00:00');
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  return d.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function PredictionForecastView({
  today,
  predictedNextPeriodDate,
  predictedOvulationDate,
  predictedFertileStart,
  predictedFertileEnd,
  averageCycleLengthUsed = 28,
  averagePeriodLengthUsed = 5,
  cyclesConsidered = 1,
  confidenceBand = 'low',
  confidenceReason,
  algorithmVersion = 'v1-calendar-rhythm',
}: PredictionForecastViewProps) {
  const { t, lang } = useTranslation();
  const [activePhaseTab, setActivePhaseTab] = useState<number>(0);

  const cycleLen = averageCycleLengthUsed || 28;
  const periodLen = averagePeriodLengthUsed || 5;

  // Days until next period
  const daysUntilNext = predictedNextPeriodDate
    ? daysBetween(today, predictedNextPeriodDate)
    : null;

  // Projected 4-phase milestone dates based on next cycle start
  const baseStart = predictedNextPeriodDate ?? today;
  
  // 1. Menstruation
  const p1Start = baseStart;
  const p1End = addDays(baseStart, Math.max(1, periodLen - 1));

  // 2. Follicular
  const p2Start = addDays(p1End, 1);
  const p2End = predictedFertileStart ? addDays(predictedFertileStart, -1) : addDays(baseStart, 11);

  // 3. Fertile & Ovulation
  const p3Start = predictedFertileStart ?? addDays(baseStart, 12);
  const p3End = predictedFertileEnd ?? addDays(baseStart, 16);
  const ovDate = predictedOvulationDate ?? addDays(baseStart, Math.max(1, cycleLen - 14));

  // 4. Luteal
  const p4Start = addDays(p3End, 1);
  const p4End = addDays(baseStart, Math.max(1, cycleLen - 1));

  // Projected Next 3 Cycles
  const futureCycles = [
    {
      index: 1,
      startDate: baseStart,
      endDate: addDays(baseStart, periodLen - 1),
      ovulationDate: ovDate,
    },
    {
      index: 2,
      startDate: addDays(baseStart, cycleLen),
      endDate: addDays(baseStart, cycleLen + periodLen - 1),
      ovulationDate: addDays(ovDate, cycleLen),
    },
    {
      index: 3,
      startDate: addDays(baseStart, cycleLen * 2),
      endDate: addDays(baseStart, cycleLen * 2 + periodLen - 1),
      ovulationDate: addDays(ovDate, cycleLen * 2),
    },
  ];

  const phases = [
    {
      id: 0,
      name: t('predictions.phase_menstrual'),
      range: `${formatDateFriendly(p1Start, lang)} - ${formatDateFriendly(p1End, lang)}`,
      days: `${periodLen}d`,
      tone: 'primary',
      accentColor: 'border-primary/30 bg-primary/5 text-primary',
      dotColor: 'bg-primary',
      tag: 'Rest & Restore',
      description: t('predictions.phase_menstrual_desc'),
      focus: 'Warm herbal tea, light stretching, gentle magnesium, restful sleep.',
    },
    {
      id: 1,
      name: t('predictions.phase_follicular'),
      range: `${formatDateFriendly(p2Start, lang)} - ${formatDateFriendly(p2End, lang)}`,
      days: `${Math.max(1, daysBetween(p2Start, p2End) + 1)}d`,
      tone: 'accent',
      accentColor: 'border-accent/30 bg-accent/5 text-foreground',
      dotColor: 'bg-accent',
      tag: 'Energy & Creativity',
      description: t('predictions.phase_follicular_desc'),
      focus: 'High-intensity workouts, brainstorming, nutrient-rich salads and proteins.',
    },
    {
      id: 2,
      name: t('predictions.phase_ovulatory'),
      range: `${formatDateFriendly(p3Start, lang)} - ${formatDateFriendly(p3End, lang)}`,
      days: `${Math.max(1, daysBetween(p3Start, p3End) + 1)}d`,
      tone: 'sage',
      accentColor: 'border-sage/30 bg-sage/5 text-sage',
      dotColor: 'bg-sage',
      tag: 'Peak Vitality',
      description: t('predictions.phase_ovulatory_desc'),
      focus: 'Social engagements, peak stamina, antioxidant-rich foods, leafy greens.',
    },
    {
      id: 3,
      name: t('predictions.phase_luteal'),
      range: `${formatDateFriendly(p4Start, lang)} - ${formatDateFriendly(p4End, lang)}`,
      days: `${Math.max(1, daysBetween(p4Start, p4End) + 1)}d`,
      tone: 'amber',
      accentColor: 'border-amber/30 bg-amber/5 text-amber',
      dotColor: 'bg-amber',
      tag: 'Reflect & Comfort',
      description: t('predictions.phase_luteal_desc'),
      focus: 'Hydration, complex carbohydrates, stress reduction, winding down routines.',
    },
  ];

  return (
    <div className="space-y-4 select-none">
      {/* ===== Hero Forecast Dish ===== */}
      <Card className="relative overflow-hidden border-border/80 shadow-md shadow-stone-900/5 bg-radial from-card via-card to-card/95">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {t('predictions.forecast_title')}
            </span>
            <Badge tone={confidenceBand === 'low' ? 'warning' : 'success'}>
              {confidenceBand === 'low' ? 'Estimating' : 'Stable Rhythm'}
            </Badge>
          </div>

          <div className="flex items-baseline justify-between pt-1 pb-3">
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                {t('predictions.next_period_hero')}
              </p>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight mt-0.5 capitalize">
                {predictedNextPeriodDate ? formatDateFull(predictedNextPeriodDate, lang) : '-'}
              </h2>
            </div>
            {daysUntilNext != null && (
              <div className="text-right">
                <span className="inline-flex items-center rounded-2xl bg-primary/10 border border-primary/20 px-3 py-1.5 text-sm font-extrabold text-primary shadow-2xs tabular-nums">
                  {daysUntilNext === 0
                    ? t('upcoming.today')
                    : daysUntilNext === 1
                      ? t('upcoming.tomorrow')
                      : t('predictions.in_days', daysUntilNext)}
                </span>
              </div>
            )}
          </div>

          {/* Key Rhythm Figures */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/40">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t('stats.avg_cycle')}
              </span>
              <span className="text-sm font-bold text-foreground mt-0.5 tabular-nums">
                {cycleLen} days
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t('stats.avg_period')}
              </span>
              <span className="text-sm font-bold text-foreground mt-0.5 tabular-nums">
                {periodLen} days
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t('timeline.ovulation')}
              </span>
              <span className="text-sm font-bold text-sage mt-0.5 tabular-nums">
                {ovDate ? formatDateFriendly(ovDate, lang) : '-'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== 4-Phase Rhythm & Body Map ===== */}
      <Card className="border-border/80 shadow-sm shadow-stone-900/5">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-foreground tracking-tight">
              {t('predictions.phase_breakdown')}
            </CardTitle>
            <span className="text-[10px] text-muted-foreground font-semibold">
              {cycleLen}d cycle window
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1 space-y-3">
          {/* Phase Segment Selector */}
          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border/60">
            {phases.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePhaseTab(p.id)}
                className={clsx(
                  'flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all cursor-pointer',
                  activePhaseTab === p.id
                    ? 'bg-card text-foreground shadow-xs border border-border font-bold'
                    : 'text-muted-foreground hover:text-foreground font-medium'
                )}
              >
                <div className="flex items-center gap-1">
                  <span className={clsx('h-1.5 w-1.5 rounded-full', p.dotColor)} />
                  <span className="text-[11px] truncate">{p.days}</span>
                </div>
                <span className="text-[9px] text-muted-foreground/80 truncate w-full mt-0.5">
                  {p.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Active Phase Card */}
          {(() => {
            const activePhase = phases[activePhaseTab];
            return (
              <div className={clsx('rounded-2xl border p-4 transition-all duration-200 space-y-2.5', activePhase.accentColor)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={clsx('h-2.5 w-2.5 rounded-full shadow-xs', activePhase.dotColor)} />
                    <h4 className="text-xs font-bold text-foreground tracking-tight">
                      {activePhase.name}
                    </h4>
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-foreground bg-card/80 px-2.5 py-0.5 rounded-full border border-border/60 shadow-2xs">
                    {activePhase.range}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activePhase.description}
                </p>

                <div className="pt-1.5 border-t border-border/30">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block mb-0.5">
                    Recommended Self-Care Ritual
                  </span>
                  <p className="text-xs font-medium text-foreground leading-relaxed">
                    {activePhase.focus}
                  </p>
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* ===== Data Quality & Confidence Gauge ===== */}
      <Card className="border-border/80 shadow-sm shadow-stone-900/5">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold text-foreground tracking-tight">
            {t('predictions.confidence_meter')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1 space-y-3">
          {/* Visual Step Gauge */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Confidence Level</span>
              <span className="font-bold text-foreground capitalize tabular-nums">
                {confidenceBand} ({cyclesConsidered} {cyclesConsidered === 1 ? 'cycle' : 'cycles'} logged)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 h-2">
              <div className={clsx('rounded-full transition-all', cyclesConsidered >= 1 ? 'bg-primary' : 'bg-muted')} />
              <div className={clsx('rounded-full transition-all', cyclesConsidered >= 3 ? 'bg-primary' : 'bg-muted')} />
              <div className={clsx('rounded-full transition-all', cyclesConsidered >= 6 ? 'bg-primary' : 'bg-muted')} />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-semibold px-0.5">
              <span>1 Cycle</span>
              <span>3 Cycles (Stable)</span>
              <span>6+ Cycles (Precision)</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-2xl border border-border/50">
            {confidenceBand === 'low'
              ? t('predictions.confidence_low_tip')
              : t('predictions.confidence_med_tip')}
          </p>

          {confidenceReason && (
            <div className="text-[11px] text-muted-foreground/80 italic">
              Note: {confidenceReason}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===== Projected Next 3 Cycles (Horizon Planning) ===== */}
      <Card className="border-border/80 shadow-sm shadow-stone-900/5">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold text-foreground tracking-tight">
            {t('predictions.future_cycles_title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="divide-y divide-border/40">
            {futureCycles.map((c) => (
              <div key={c.index} className="py-2.5 flex items-center justify-between first:pt-1 last:pb-1">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-muted/80 text-xs font-bold text-foreground border border-border tabular-nums">
                    #{c.index}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-foreground tracking-tight block">
                      {formatDateFriendly(c.startDate, lang)} - {formatDateFriendly(c.endDate, lang)}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Est. Period ({periodLen}d)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-sage block tabular-nums">
                    {formatDateFriendly(c.ovulationDate, lang)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Ovulation Peak
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ===== Mathematical Model Transparency ===== */}
      <Card className="border-border/80 shadow-sm shadow-stone-900/5">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold text-foreground tracking-tight">
            {t('predictions.how_calculated_title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1 space-y-2 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span className="text-muted-foreground">{t('explainer.avg_cycle_used')}</span>
            <span className="font-semibold text-foreground tabular-nums">{cycleLen} days</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span className="text-muted-foreground">{t('explainer.avg_period_used')}</span>
            <span className="font-semibold text-foreground tabular-nums">{periodLen} days</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border/40">
            <span className="text-muted-foreground">{t('explainer.cycles_considered')}</span>
            <span className="font-semibold text-foreground tabular-nums">{cyclesConsidered}</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground">Algorithm Engine</span>
            <span className="font-mono text-[11px] font-semibold text-foreground">{algorithmVersion}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
