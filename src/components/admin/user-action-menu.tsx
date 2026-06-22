import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import type { User } from '@/lib/db/schema';

interface UserActionMenuProps {
  user: User;
  onDeactivate: () => Promise<void> | void;
  onReactivate: () => Promise<void> | void;
  onDelete: () => Promise<void> | void;
  onResetPassword: (newPassword: string) => Promise<void> | void;
}

export function UserActionMenu({
  user,
  onDeactivate,
  onReactivate,
  onDelete,
  onResetPassword,
}: UserActionMenuProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [busy, setBusy] = useState(false);

  const handle = async (fn: () => Promise<void> | void) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (resetPassword.length < 8) {
      setResetError('Password must be at least 8 characters');
      return;
    }
    if (!/[a-z]/.test(resetPassword)) {
      setResetError('Password must contain at least one lowercase letter');
      return;
    }
    if (!/[A-Z]/.test(resetPassword)) {
      setResetError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[0-9]/.test(resetPassword)) {
      setResetError('Password must contain at least one number');
      return;
    }
    setResetError('');
    await handle(() => onResetPassword(resetPassword));
    setShowReset(false);
    setResetPassword('');
  };

  return (
    <div className="flex flex-wrap gap-2">
      {user.status === 'active' && (
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => handle(onDeactivate)}
        >
          Deactivate
        </Button>
      )}
      {user.status === 'inactive' && (
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => handle(onReactivate)}
        >
          Reactivate
        </Button>
      )}
      {user.status !== 'deleted' && (
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => setConfirmDelete(true)}
        >
          Delete
        </Button>
      )}
      {user.status !== 'deleted' && (
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => { setShowReset(true); setResetPassword(''); setResetError(''); }}
        >
          Reset password
        </Button>
      )}
      <ConfirmationDialog
        open={confirmDelete}
        title="Delete user?"
        description="This will soft-delete the user account. The action will be recorded in the audit log."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          handle(onDelete);
          setConfirmDelete(false);
        }}
        onCancel={() => setConfirmDelete(false)}
      />
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowReset(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-foreground mb-1">Reset password</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Set a new password for <span className="font-medium text-foreground">{user.email}</span>. The user will be able to sign in with this password.
            </p>
            <Input
              type="password"
              label="New password"
              placeholder="Enter new password"
              value={resetPassword}
              onChange={(e) => { setResetPassword(e.target.value); setResetError(''); }}
              error={resetError}
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowReset(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleReset} disabled={busy}>Set password</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
