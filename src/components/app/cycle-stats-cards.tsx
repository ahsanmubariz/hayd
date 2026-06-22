import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/use-translation';

interface CycleStatsCardsProps {
  averageCycleLength?: number;
  averagePeriodLength?: number;
  totalCycles?: number;
  trendLabel?: string;
}

export function CycleStatsCards({
  averageCycleLength,
  averagePeriodLength,
  totalCycles,
  trendLabel,
}: CycleStatsCardsProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card>
        <CardHeader className="mb-1">
          <CardTitle className="text-xs text-muted-foreground">{t('stats.avg_cycle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            {averageCycleLength ? `${averageCycleLength}d` : '—'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="mb-1">
          <CardTitle className="text-xs text-muted-foreground">{t('stats.avg_period')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            {averagePeriodLength ? `${averagePeriodLength}d` : '—'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="mb-1">
          <CardTitle className="text-xs text-muted-foreground">{t('stats.cycles_tracked')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{totalCycles ?? 0}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="mb-1">
          <CardTitle className="text-xs text-muted-foreground">{t('stats.trend')}</CardTitle>
        </CardHeader>
        <CardContent>
          {trendLabel ? <Badge tone="muted">{trendLabel}</Badge> : <span className="text-sm">—</span>}
        </CardContent>
      </Card>
    </div>
  );
}
