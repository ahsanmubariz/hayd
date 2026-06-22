import { getDb } from '@/lib/db/client';
import type { AdminAuditLog } from '@/lib/db/schema';

function generateId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function recordAuditLog(data: {
  adminUserId: string;
  targetUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<AdminAuditLog> {
  const db = getDb();
  const id = generateId();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO admin_audit_logs
        (id, admin_user_id, target_user_id, action, entity_type, entity_id, metadata_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      data.adminUserId,
      data.targetUserId ?? null,
      data.action,
      data.entityType,
      data.entityId ?? null,
      data.metadata ? JSON.stringify(data.metadata) : null,
      now,
    )
    .run();
  return {
    id,
    admin_user_id: data.adminUserId,
    target_user_id: data.targetUserId ?? null,
    action: data.action,
    entity_type: data.entityType,
    entity_id: data.entityId ?? null,
    metadata_json: data.metadata ? JSON.stringify(data.metadata) : null,
    created_at: now,
  };
}

export async function listAuditLogs(limit = 50): Promise<AdminAuditLog[]> {
  const db = getDb();
  const result = await db
    .prepare('SELECT * FROM admin_audit_logs ORDER BY created_at DESC LIMIT ?')
    .bind(limit)
    .all<AdminAuditLog>();
  return result.results;
}
