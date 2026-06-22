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
        <div className="flex items-center gap-2">
          <span className="text-lg">✅</span>
          <div>
            <p className="text-sm font-medium text-foreground">{t('quick_log.logged_today')}</p>
            <p className="text-xs text-muted-foreground">{t('quick_log.tap_to_update')}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {todayStatus.bleeding_status && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {todayStatus.bleeding_status}
            </span>
          )}
          {todayStatus.pain_level != null && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              todayStatus.pain_level >= 7
                ? 'bg-destructive/10 text-destructive'
                : todayStatus.pain_level >= 4
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
            }`}>
              {t('quick_log.pain', todayStatus.pain_level)}
            </span>
          )}
          {todayStatus.mood && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {todayStatus.mood}
            </span>
          )}
          {todayStatus.energy_level != null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {t('quick_log.energy', todayStatus.energy_level)}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">📝</span>
        <div>
          <p className="text-sm font-medium text-foreground">{t('quick_log.havent_logged')}</p>
          <p className="text-xs text-muted-foreground">{t('quick_log.track_feeling')}</p>
        </div>
      </div>
    </div>
  );
}
