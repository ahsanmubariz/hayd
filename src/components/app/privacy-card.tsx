import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/use-translation';

interface PrivacyCardProps {
  onExport?: () => void;
  onDeleteRequest?: () => void;
}

export function PrivacyCard({ onExport, onDeleteRequest }: PrivacyCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="border-border/80 bg-gradient-to-b from-card to-muted/20 shadow-xs">
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sage/15 text-sage border border-sage/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <CardTitle className="text-sm font-semibold tracking-tight">{t('privacy.title')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-1 space-y-3 text-xs text-muted-foreground leading-relaxed">
        <p>
          {t('privacy.description')}
        </p>
        <p className="text-[11px] text-muted-foreground/80">
          {t('privacy.admin_note')}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {onExport && (
            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 shadow-2xs transition-all active:scale-98"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {t('privacy.export')}
            </button>
          )}
          {onDeleteRequest && (
            <button
              type="button"
              onClick={onDeleteRequest}
              className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 shadow-2xs transition-all active:scale-98"
            >
              {t('privacy.delete')}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
