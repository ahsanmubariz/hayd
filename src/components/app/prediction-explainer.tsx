import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/use-translation';

interface PredictionExplainerProps {
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

export function PredictionExplainer({
  predictedNextPeriodDate,
  predictedOvulationDate,
  predictedFertileStart,
  predictedFertileEnd,
  averageCycleLengthUsed,
  averagePeriodLengthUsed,
  cyclesConsidered,
  confidenceBand,
  confidenceReason,
  algorithmVersion,
}: PredictionExplainerProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight">{t('explainer.how_calculated')}</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-1 space-y-2.5">
        {predictedNextPeriodDate && (
          <Row label={t('explainer.next_period')} value={predictedNextPeriodDate} />
        )}
        {predictedOvulationDate && (
          <Row label={t('explainer.ovulation')} value={predictedOvulationDate} />
        )}
        {predictedFertileStart && predictedFertileEnd && (
          <Row label={t('explainer.fertile_range')} value={`${predictedFertileStart} – ${predictedFertileEnd}`} />
        )}
        {typeof averageCycleLengthUsed === 'number' && (
          <Row label={t('explainer.avg_cycle_used')} value={`${averageCycleLengthUsed} days`} />
        )}
        {typeof averagePeriodLengthUsed === 'number' && (
          <Row label={t('explainer.avg_period_used')} value={`${averagePeriodLengthUsed} days`} />
        )}
        {typeof cyclesConsidered === 'number' && (
          <Row label={t('explainer.cycles_considered')} value={String(cyclesConsidered)} />
        )}
        {confidenceBand && (
          <Row
            label={t('explainer.confidence')}
            value={
              <Badge tone={confidenceBand === 'low' ? 'warning' : 'success'}>
                {confidenceBand}
              </Badge>
            }
          />
        )}
        {confidenceReason && <p className="text-xs text-muted-foreground pt-1">{confidenceReason}</p>}
        {algorithmVersion && (
          <p className="text-[10px] text-muted-foreground/80 pt-1 font-mono">{t('explainer.algorithm')}</p>
        )}
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
