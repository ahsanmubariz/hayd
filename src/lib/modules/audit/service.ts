import { recordAuditLog, listAuditLogs } from './repository';

export async function auditUserCreated(adminUserId: string, targetUserId: string, email: string) {
  await recordAuditLog({
    adminUserId,
    targetUserId,
    action: 'user.create',
    entityType: 'user',
    entityId: targetUserId,
    metadata: { email },
  });
}

export async function auditUserDeactivated(adminUserId: string, targetUserId: string) {
  await recordAuditLog({
    adminUserId,
    targetUserId,
    action: 'user.deactivate',
    entityType: 'user',
    entityId: targetUserId,
  });
}

export async function auditUserReactivated(adminUserId: string, targetUserId: string) {
  await recordAuditLog({
    adminUserId,
    targetUserId,
    action: 'user.reactivate',
    entityType: 'user',
    entityId: targetUserId,
  });
}

export async function auditUserDeleted(adminUserId: string, targetUserId: string) {
  await recordAuditLog({
    adminUserId,
    targetUserId,
    action: 'user.delete',
    entityType: 'user',
    entityId: targetUserId,
  });
}

export async function auditPasswordReset(adminUserId: string, targetUserId: string) {
  await recordAuditLog({
    adminUserId,
    targetUserId,
    action: 'user.password_reset',
    entityType: 'user',
    entityId: targetUserId,
  });
}

export { listAuditLogs };
