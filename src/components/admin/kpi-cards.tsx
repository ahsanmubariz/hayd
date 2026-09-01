import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KpiCardsProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsers: number;
}

export function KpiCards({ totalUsers, activeUsers, inactiveUsers, newUsers }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 select-none">
      <KpiCard label="Total Users" value={totalUsers} />
      <KpiCard label="Active" value={activeUsers} tone="success" />
      <KpiCard label="Inactive" value={inactiveUsers} tone="warning" />
      <KpiCard label="New (30d)" value={newUsers} />
    </div>
  );
}

function KpiCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: 'success' | 'warning';
}) {
  const toneClass =
    tone === 'success'
      ? 'text-sage'
      : tone === 'warning'
        ? 'text-amber'
        : 'text-foreground';
  return (
    <Card className="hover:border-primary/30 transition-all shadow-xs">
      <CardHeader className="p-4 pb-1">
        <CardTitle className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-1">
        <p className={`text-2xl font-bold tracking-tight tabular-nums ${toneClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

