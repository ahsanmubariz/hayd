import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KpiCardsProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsers: number;
}

export function KpiCards({ totalUsers, activeUsers, inactiveUsers, newUsers }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <KpiCard label="Total users" value={totalUsers} />
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
      ? 'text-green-600 dark:text-green-400'
      : tone === 'warning'
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-foreground';
  return (
    <Card>
      <CardHeader className="mb-1">
        <CardTitle className="text-xs text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-semibold ${toneClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
