import type {
  User,
  UserProfile,
  Session,
  PasswordResetToken,
  PeriodLog,
  DailyStatusLog,
  PredictionSnapshot,
  AdminAuditLog,
  UserPasskey,
} from './schema';

type D1Database = {
  prepare: (sql: string) => D1PreparedStatement;
  batch: (statements: D1PreparedStatement[]) => Promise<D1Result<unknown>[]>;
  dump: () => Promise<ArrayBuffer>;
  exec: (sql: string) => Promise<D1ExecResult>;
};

type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  all: <T = unknown>() => Promise<D1Result<T>>;
  first: <T = unknown>() => Promise<T | null>;
  run: () => Promise<D1Result<unknown>>;
  raw: <T = unknown>() => Promise<T[]>;
};

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: {
    changed_db: boolean;
    changes: number;
    last_row_id: number | null;
    duration: number;
  };
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

export type DB = D1Database;

let _db: DB | null = null;

export function getDb(): DB {
  if (_db) return _db;

  // Cloudflare Workers: D1 binding is on globalThis.__D1__ (set by Astro adapter)
  if (globalThis.__D1__) {
    _db = globalThis.__D1__ as unknown as DB;
    return _db;
  }

  throw new Error('D1 database binding not found. Ensure DB binding is configured.');
}

export function setDb(db: DB): void {
  _db = db;
}

declare global {
  // eslint-disable-next-line no-var
  var __D1__: D1Database | undefined;
}

export const tables = {
  users: 'users',
  userProfiles: 'user_profiles',
  sessions: 'sessions',
  passwordResetTokens: 'password_reset_tokens',
  periodLogs: 'period_logs',
  dailyStatusLogs: 'daily_status_logs',
  predictionSnapshots: 'prediction_snapshots',
  adminAuditLogs: 'admin_audit_logs',
} as const;

export async function findByEmail(email: string): Promise<User | null> {
  const db = getDb();
  const row = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email.toLowerCase()).first<User>();
  return row;
}

export async function findUserById(id: string): Promise<User | null> {
  const db = getDb();
  const row = await db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first<User>();
  return row;
}

export async function findProfile(userId: string): Promise<UserProfile | null> {
  const db = getDb();
  const row = await db
    .prepare('SELECT * FROM user_profiles WHERE user_id = ?')
    .bind(userId)
    .first<UserProfile>();
  return row;
}

export async function findSessionById(id: string): Promise<Session | null> {
  const db = getDb();
  const row = await db
    .prepare('SELECT * FROM sessions WHERE id = ?')
    .bind(id)
    .first<Session>();
  return row;
}

export async function findResetToken(userId: string): Promise<PasswordResetToken | null> {
  const db = getDb();
  const row = await db
    .prepare('SELECT * FROM password_reset_tokens WHERE user_id = ? ORDER BY created_at DESC LIMIT 1')
    .bind(userId)
    .first<PasswordResetToken>();
  return row;
}

export async function findPeriodLogs(userId: string): Promise<PeriodLog[]> {
  const db = getDb();
  const result = await db
    .prepare('SELECT * FROM period_logs WHERE user_id = ? ORDER BY start_date ASC')
    .bind(userId)
    .all<PeriodLog>();
  return result.results;
}

export async function findDailyStatusLogs(userId: string): Promise<DailyStatusLog[]> {
  const db = getDb();
  const result = await db
    .prepare('SELECT * FROM daily_status_logs WHERE user_id = ? ORDER BY log_date DESC')
    .bind(userId)
    .all<DailyStatusLog>();
  return result.results;
}

export async function findLatestPrediction(userId: string): Promise<PredictionSnapshot | null> {
  const db = getDb();
  const row = await db
    .prepare('SELECT * FROM prediction_snapshots WHERE user_id = ? ORDER BY created_at DESC LIMIT 1')
    .bind(userId)
    .first<PredictionSnapshot>();
  return row;
}

export async function findLatestPeriodLog(userId: string): Promise<PeriodLog | null> {
  const db = getDb();
  const row = await db
    .prepare('SELECT * FROM period_logs WHERE user_id = ? ORDER BY start_date DESC LIMIT 1')
    .bind(userId)
    .first<PeriodLog>();
  return row;
}

export async function findAuditLogs(limit = 50): Promise<AdminAuditLog[]> {
  const db = getDb();
  const result = await db
    .prepare('SELECT * FROM admin_audit_logs ORDER BY created_at DESC LIMIT ?')
    .bind(limit)
    .all<AdminAuditLog>();
  return result.results;
}

export async function findPasskeyById(id: string): Promise<UserPasskey | null> {
  const db = getDb();
  return db
    .prepare('SELECT * FROM user_passkeys WHERE id = ?')
    .bind(id)
    .first<UserPasskey>();
}

export async function findPasskeysByUser(userId: string): Promise<UserPasskey[]> {
  const db = getDb();
  const result = await db
    .prepare('SELECT * FROM user_passkeys WHERE user_id = ? ORDER BY created_at DESC')
    .bind(userId)
    .all<UserPasskey>();
  return result.results;
}

export async function createPasskey(passkey: Omit<UserPasskey, 'created_at'>): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO user_passkeys (id, user_id, public_key, counter, transports, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      passkey.id,
      passkey.user_id,
      passkey.public_key,
      passkey.counter,
      passkey.transports,
      now
    )
    .run();
}

export async function updatePasskeyCounter(id: string, counter: number): Promise<void> {
  const db = getDb();
  await db
    .prepare('UPDATE user_passkeys SET counter = ? WHERE id = ?')
    .bind(counter, id)
    .run();
}

export async function deletePasskey(id: string): Promise<void> {
  const db = getDb();
  await db
    .prepare('DELETE FROM user_passkeys WHERE id = ?')
    .bind(id)
    .run();
}

