import { Badge } from '@/components/ui/badge';
import type { User } from '@/lib/db/schema';

interface UserTableProps {
  users: User[];
  viewHrefPrefix?: string;
}

const STATUS_TONE = {
  active: 'success' as const,
  inactive: 'warning' as const,
  deleted: 'destructive' as const,
};

export function UserTable({ users, viewHrefPrefix }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Role</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Created</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const viewHref = viewHrefPrefix ? `${viewHrefPrefix}/${user.id}` : '#';

            return (
              <tr key={user.id} className="border-t border-border">
                <td className="px-3 py-2">{user.email}</td>
                <td className="px-3 py-2 capitalize">{user.role}</td>
                <td className="px-3 py-2">
                  <Badge tone={STATUS_TONE[user.status]}>{user.status}</Badge>
                </td>
                <td className="px-3 py-2 text-muted-foreground">{user.created_at.slice(0, 10)}</td>
                <td className="px-3 py-2 text-right">
                  <a href={viewHref} className="text-primary hover:underline">
                    View
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}