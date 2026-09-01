import { Badge } from '@/components/ui/badge';
import type { AdminAuditLog } from '@/lib/db/schema';

interface AuditTableProps {
  logs: AdminAuditLog[];
}

export function AuditTable({ logs }: AuditTableProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 p-8 text-center text-xs font-semibold text-muted-foreground">
        No audit entries yet.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm shadow-stone-900/5">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-muted/50 text-[10px] uppercase font-semibold tracking-wider text-muted-foreground border-b border-border/60">
            <tr>
              <th className="px-4 py-3 text-left">When</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Entity</th>
              <th className="px-4 py-3 text-left">Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {logs.map((log) => (
              <tr key={log.id} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3 text-muted-foreground tabular-nums">{log.created_at.slice(0, 16)}</td>
                <td className="px-4 py-3">
                  <Badge tone="muted">{log.action}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-[11px]">
                  {log.entity_type}
                  {log.entity_id ? `:${log.entity_id.slice(0, 8)}` : ''}
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-[11px]">{log.admin_user_id.slice(0, 8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

