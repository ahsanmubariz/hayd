import { getDb } from '@/lib/db/client';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes

interface RateLimitRow {
  attempts: number;
  first_attempt: string;
  locked_until: string | null;
}

function getClientIp(request: Request): string {
  // Cloudflare passes the real IP in CF-Connecting-IP
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;
  // Fallback headers
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return 'unknown';
}

export async function checkRateLimit(request: Request, action: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  const db = getDb();
  const ip = getClientIp(request);
  const key = `${action}:${ip}`;
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MS);

  // Clean up old entries periodically (simple approach)
  await db
    .prepare('DELETE FROM rate_limits WHERE first_attempt < ?')
    .bind(windowStart.toISOString())
    .run();

  const row = await db
    .prepare('SELECT attempts, first_attempt, locked_until FROM rate_limits WHERE id = ?')
    .bind(key)
    .first<RateLimitRow>();

  if (row) {
    // Check if locked out
    if (row.locked_until && new Date(row.locked_until) > now) {
      const retryAfter = Math.ceil((new Date(row.locked_until).getTime() - now.getTime()) / 1000);
      return { allowed: false, retryAfter };
    }

    // Check if within window and over limit
    if (new Date(row.first_attempt) > windowStart && row.attempts >= MAX_ATTEMPTS) {
      // Lock out
      const lockedUntil = new Date(now.getTime() + LOCKOUT_MS);
      await db
        .prepare('UPDATE rate_limits SET locked_until = ? WHERE id = ?')
        .bind(lockedUntil.toISOString(), key)
        .run();
      const retryAfter = Math.ceil(LOCKOUT_MS / 1000);
      return { allowed: false, retryAfter };
    }

    // Increment attempts
    await db
      .prepare('UPDATE rate_limits SET attempts = attempts + 1 WHERE id = ?')
      .bind(key)
      .run();
  } else {
    // First attempt
    await db
      .prepare('INSERT INTO rate_limits (id, attempts, first_attempt, locked_until) VALUES (?, 1, ?, NULL)')
      .bind(key, now.toISOString())
      .run();
  }

  return { allowed: true };
}

export async function resetRateLimit(request: Request, action: string): Promise<void> {
  const db = getDb();
  const ip = getClientIp(request);
  const key = `${action}:${ip}`;
  await db
    .prepare('DELETE FROM rate_limits WHERE id = ?')
    .bind(key)
    .run();
}
