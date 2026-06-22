import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface AdminConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminConfirmationDialog(props: AdminConfirmationDialogProps) {
  return <ConfirmationDialog {...props} />;
}
