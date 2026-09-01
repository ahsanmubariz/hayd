import type { DailyStatusLog } from '@/lib/db/schema';
import { useTranslation } from '@/lib/i18n/use-translation';

interface QuickLogCardProps {
  hasLoggedToday: boolean;
  todayStatus: DailyStatusLog | null;
}

export function QuickLogCard({ hasLoggedToday, todayStatus }: QuickLogCardProps) {
  const { t } = useTranslation();

  if (hasLoggedToday && todayStatus) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sage/15 text-sage border border-sage/30 shadow-2xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground tracking-tight">{t('quick_log.logged_today')}</p>
            <p className="text-xs text-muted-foreground">{t('quick_log.tap_to_update')}</p>
          </div>
        </div>

        {/* Tactile Pebble Chips */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {todayStatus.bleeding_status && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 px-2.5 py-1 text-xs font-medium text-primary shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="capitalize">{todayStatus.bleeding_status}</span>
            </span>
          )}
          {todayStatus.pain_level != null && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-2xs ${
                todayStatus.pain_level >= 7
                  ? 'bg-destructive/10 text-destructive border-destructive/25'
                  : todayStatus.pain_level >= 4
                    ? 'bg-amber/15 text-amber border-amber/30'
                    : 'bg-sage/15 text-sage border-sage/30'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  todayStatus.pain_level >= 7
                    ? 'bg-destructive'
                    : todayStatus.pain_level >= 4
                      ? 'bg-amber'
                      : 'bg-sage'
                }`}
              />
              {t('quick_log.pain', todayStatus.pain_level)}
            </span>
          )}
          {todayStatus.mood && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 border border-border px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="capitalize">{todayStatus.mood}</span>
            </span>
          )}
          {todayStatus.energy_level != null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 border border-border px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
              {t('quick_log.energy', todayStatus.energy_level)}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground border border-border shadow-2xs">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground tracking-tight">{t('quick_log.havent_logged')}</p>
          <p className="text-xs text-muted-foreground">{t('quick_log.track_feeling')}</p>
        </div>
      </div>
    </div>
  );
}
