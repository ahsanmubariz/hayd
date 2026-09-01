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
    <div className="grid grid-cols-2 gap-3 select-none">
      <Card className="hover:border-primary/30 transition-all">
        <CardHeader className="p-4 pb-1">
          <CardTitle className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t('stats.avg_cycle')}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {averageCycleLength ? `${averageCycleLength}d` : '-'}
          </p>
        </CardContent>
      </Card>
      <Card className="hover:border-primary/30 transition-all">
        <CardHeader className="p-4 pb-1">
          <CardTitle className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t('stats.avg_period')}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {averagePeriodLength ? `${averagePeriodLength}d` : '-'}
          </p>
        </CardContent>
      </Card>
      <Card className="hover:border-primary/30 transition-all">
        <CardHeader className="p-4 pb-1">
          <CardTitle className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t('stats.cycles_tracked')}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">{totalCycles ?? 0}</p>
        </CardContent>
      </Card>
      <Card className="hover:border-primary/30 transition-all">
        <CardHeader className="p-4 pb-1">
          <CardTitle className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t('stats.trend')}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1 flex items-center">
          {trendLabel ? <Badge tone="muted">{trendLabel}</Badge> : <span className="text-sm font-medium text-muted-foreground">-</span>}
        </CardContent>
      </Card>
    </div>
  );
}

