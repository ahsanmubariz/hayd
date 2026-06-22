import { getDb } from '@/lib/db/client';
import type { Session } from '@/lib/db/schema';

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function generateId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createSession(
  userId: string,
  ip?: string,
  userAgent?: string,
): Promise<Session> {
  const db = getDb();
  const id = generateId();
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_TTL_MS);
  const ipHash = ip ? await sha256(ip) : null;
  const userAgentHash = userAgent ? await sha256(userAgent) : null;
  await db
    .prepare(
      `INSERT INTO sessions (id, user_id, expires_at, created_at, last_seen_at, ip_hash, user_agent_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      userId,
      expires.toISOString(),
      now.toISOString(),
      now.toISOString(),
      ipHash,
      userAgentHash,
    )
    .run();
  return {
    id,
    user_id: userId,
    expires_at: expires.toISOString(),
    created_at: now.toISOString(),
    last_seen_at: now.toISOString(),
    ip_hash: ipHash,
    user_agent_hash: userAgentHash,
    revoked_at: null,
  };
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const db = getDb();
  const session = await db
    .prepare('SELECT * FROM sessions WHERE id = ?')
    .bind(sessionId)
    .first<Session>();
  if (!session) return null;
  if (session.revoked_at) return null;
  if (new Date(session.expires_at) < new Date()) return null;
  return session;
}

export async function revokeSession(sessionId: string): Promise<void> {
  const db = getDb();
  await db
    .prepare('UPDATE sessions SET revoked_at = ? WHERE id = ?')
    .bind(new Date().toISOString(), sessionId)
    .run();
}

export async function revokeAllSessions(userId: string): Promise<void> {
  const db = getDb();
  await db
    .prepare('UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL')
    .bind(new Date().toISOString(), userId)
    .run();
}

export async function touchSession(sessionId: string): Promise<void> {
  const db = getDb();
  await db
    .prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?')
    .bind(new Date().toISOString(), sessionId)
    .run();
}
