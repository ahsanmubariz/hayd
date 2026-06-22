import { getDb } from '@/lib/db/client';
import type { User, UserProfile, UserRole, UserStatus } from '@/lib/db/schema';

function generateId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  role: UserRole;
}): Promise<User> {
  const db = getDb();
  const id = generateId();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO users (id, email, password_hash, role, status, email_verified, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'active', 0, ?, ?)`,
    )
    .bind(id, data.email.toLowerCase(), data.passwordHash, data.role, now, now)
    .run();
  return {
    id,
    email: data.email.toLowerCase(),
    password_hash: data.passwordHash,
    role: data.role,
    status: 'active',
    email_verified: 0,
    created_at: now,
    updated_at: now,
    deactivated_at: null,
    deleted_at: null,
  };
}

export async function createProfile(data: {
  userId: string;
  displayName: string;
  timezone?: string;
  birthYear?: number | null;
  cycleGoal?: string | null;
  averageCycleLengthOverride?: number | null;
  averagePeriodLengthOverride?: number | null;
}): Promise<UserProfile> {
  const db = getDb();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO user_profiles
        (user_id, display_name, timezone, birth_year, cycle_goal,
         average_cycle_length_override, average_period_length_override, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      data.userId,
      data.displayName,
      data.timezone ?? 'Asia/Jakarta',
      data.birthYear ?? null,
      data.cycleGoal ?? null,
      data.averageCycleLengthOverride ?? null,
      data.averagePeriodLengthOverride ?? null,
      now,
      now,
    )
    .run();
  return {
    user_id: data.userId,
    display_name: data.displayName,
    timezone: data.timezone ?? 'Asia/Jakarta',
    birth_year: data.birthYear ?? null,
    cycle_goal: data.cycleGoal ?? null,
    average_cycle_length_override: data.averageCycleLengthOverride ?? null,
    average_period_length_override: data.averagePeriodLengthOverride ?? null,
    created_at: now,
    updated_at: now,
  };
}

export async function listUsers(): Promise<User[]> {
  const db = getDb();
  const result = await db.prepare('SELECT * FROM users ORDER BY created_at DESC').all<User>();
  return result.results;
}

export async function updateUserStatus(
  userId: string,
  status: UserStatus,
): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  const fields: string[] = ['updated_at = ?', 'status = ?'];
  const values: unknown[] = [now, status];
  if (status === 'inactive') {
    fields.push('deactivated_at = ?');
    values.push(now);
  } else if (status === 'active') {
    fields.push('deactivated_at = NULL');
  } else if (status === 'deleted') {
    fields.push('deleted_at = ?');
    values.push(now);
  }
  values.push(userId);
  await db
    .prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`)
    .bind(...values)
    .run();
}

export async function updatePassword(userId: string, passwordHash: string): Promise<void> {
  const db = getDb();
  await db
    .prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?')
    .bind(passwordHash, new Date().toISOString(), userId)
    .run();
}

export async function updateProfile(
  userId: string,
  data: Partial<{
    displayName: string;
    timezone: string;
    birthYear: number | null;
    cycleGoal: string | null;
    averageCycleLengthOverride: number | null;
    averagePeriodLengthOverride: number | null;
  }>,
): Promise<void> {
  const db = getDb();
  const fields: string[] = [];
  const values: unknown[] = [];
  if (data.displayName !== undefined) {
    fields.push('display_name = ?');
    values.push(data.displayName);
  }
  if (data.timezone !== undefined) {
    fields.push('timezone = ?');
    values.push(data.timezone);
  }
  if (data.birthYear !== undefined) {
    fields.push('birth_year = ?');
    values.push(data.birthYear);
  }
  if (data.cycleGoal !== undefined) {
    fields.push('cycle_goal = ?');
    values.push(data.cycleGoal);
  }
  if (data.averageCycleLengthOverride !== undefined) {
    fields.push('average_cycle_length_override = ?');
    values.push(data.averageCycleLengthOverride);
  }
  if (data.averagePeriodLengthOverride !== undefined) {
    fields.push('average_period_length_override = ?');
    values.push(data.averagePeriodLengthOverride);
  }
  if (fields.length === 0) return;
  fields.push('updated_at = ?');
  values.push(new Date().toISOString());
  values.push(userId);
  await db
    .prepare(`UPDATE user_profiles SET ${fields.join(', ')} WHERE user_id = ?`)
    .bind(...values)
    .run();
}
