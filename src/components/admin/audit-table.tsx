import { Badge } from '@/components/ui/badge';
import type { AdminAuditLog } from '@/lib/db/schema';

interface AuditTableProps {
  logs: AdminAuditLog[];
}

export function AuditTable({ logs }: AuditTableProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No audit entries yet.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left">When</th>
            <th className="px-3 py-2 text-left">Action</th>
            <th className="px-3 py-2 text-left">Entity</th>
            <th className="px-3 py-2 text-left">Admin</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t border-border">
              <td className="px-3 py-2 text-muted-foreground">{log.created_at.slice(0, 16)}</td>
              <td className="px-3 py-2">
                <Badge tone="muted">{log.action}</Badge>
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {log.entity_type}
                {log.entity_id ? `:${log.entity_id.slice(0, 8)}` : ''}
              </td>
              <td className="px-3 py-2 text-muted-foreground">{log.admin_user_id.slice(0, 8)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
