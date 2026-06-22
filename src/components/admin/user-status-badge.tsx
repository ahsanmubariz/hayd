import { Badge } from '@/components/ui/badge';
import type { UserStatus } from '@/lib/db/schema';

const TONE: Record<UserStatus, 'success' | 'warning' | 'destructive'> = {
  active: 'success',
  inactive: 'warning',
  deleted: 'destructive',
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <Badge tone={TONE[status]}>{status}</Badge>;
}
