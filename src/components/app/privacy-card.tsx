import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/use-translation';

interface PrivacyCardProps {
  onExport?: () => void;
  onDeleteRequest?: () => void;
}

export function PrivacyCard({ onExport, onDeleteRequest }: PrivacyCardProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('privacy.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          {t('privacy.description')}
        </p>
        <p>
          {t('privacy.admin_note')}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {onExport && (
            <button
              type="button"
              onClick={onExport}
              className="rounded-xl border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
            >
              {t('privacy.export')}
            </button>
          )}
          {onDeleteRequest && (
            <button
              type="button"
              onClick={onDeleteRequest}
              className="rounded-xl border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
            >
              {t('privacy.delete')}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
