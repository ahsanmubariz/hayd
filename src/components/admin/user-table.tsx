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
      <div className="rounded-3xl border border-dashed border-border/80 p-8 text-center text-xs font-semibold text-muted-foreground">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm shadow-stone-900/5">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-muted/50 text-[10px] uppercase font-semibold tracking-wider text-muted-foreground border-b border-border/60">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {users.map((user) => {
              const viewHref = viewHrefPrefix ? `${viewHrefPrefix}/${user.id}` : '#';

              return (
                <tr key={user.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{user.email}</td>
                  <td className="px-4 py-3 capitalize text-muted-foreground font-medium">{user.role}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[user.status]}>{user.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">{user.created_at.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-right">
                    <a href={viewHref} className="font-semibold text-primary hover:underline">
                      View
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}