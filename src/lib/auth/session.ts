import { getDb } from '@/lib/db/client';
import type { Session } from '@/lib/db/schema';

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 90; // 90 days

async function getHmacKey(): Promise<CryptoKey> {
  const secret = import.meta.env.SESSION_SECRET || 'a-very-long-and-secure-fallback-secret-key-for-development-change-in-prod';
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signSessionId(sessionId: string): Promise<string> {
  const key = await getHmacKey();
  const encoder = new TextEncoder();
  const data = encoder.encode(sessionId);
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const sigHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${sessionId}.${sigHex}`;
}

export async function verifySessionId(signedValue: string): Promise<string | null> {
  if (!signedValue) return null;
  const parts = signedValue.split('.');
  if (parts.length !== 2) return null;
  const [sessionId, sigHex] = parts;
  if (!sessionId || !sigHex || !/^[0-9a-fA-F]+$/.test(sigHex)) return null;

  try {
    const key = await getHmacKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(sessionId);
    const sigBytes = new Uint8Array(sigHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, data);
    return isValid ? sessionId : null;
  } catch {
    return null;
  }
}

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
