import { getDb } from '@/lib/db/client';
import type { PeriodLog, DailyStatusLog } from '@/lib/db/schema';

function generateId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createPeriodLog(data: {
  userId: string;
  startDate: string;
  endDate: string;
  flowIntensity?: string;
  notes?: string;
}): Promise<PeriodLog> {
  const db = getDb();
  const id = generateId();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO period_logs
        (id, user_id, start_date, end_date, flow_intensity, notes, source, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'manual', ?, ?)`,
    )
    .bind(
      id,
      data.userId,
      data.startDate,
      data.endDate,
      data.flowIntensity ?? null,
      data.notes ?? null,
      now,
      now,
    )
    .run();
  return {
    id,
    user_id: data.userId,
    start_date: data.startDate,
    end_date: data.endDate,
    flow_intensity: data.flowIntensity ?? null,
    notes: data.notes ?? null,
    source: 'manual',
    created_at: now,
    updated_at: now,
  };
}

export async function updatePeriodLog(
  id: string,
  data: Partial<{
    startDate: string;
    endDate: string;
    flowIntensity: string;
    notes: string;
  }>,
): Promise<void> {
  const db = getDb();
  const fields: string[] = [];
  const values: unknown[] = [];
  if (data.startDate !== undefined) {
    fields.push('start_date = ?');
    values.push(data.startDate);
  }
  if (data.endDate !== undefined) {
    fields.push('end_date = ?');
    values.push(data.endDate);
  }
  if (data.flowIntensity !== undefined) {
    fields.push('flow_intensity = ?');
    values.push(data.flowIntensity);
  }
  if (data.notes !== undefined) {
    fields.push('notes = ?');
    values.push(data.notes);
  }
  if (fields.length === 0) return;
  fields.push('updated_at = ?');
  values.push(new Date().toISOString());
  values.push(id);
  await db
    .prepare(`UPDATE period_logs SET ${fields.join(', ')} WHERE id = ?`)
    .bind(...values)
    .run();
}

export async function deletePeriodLog(id: string): Promise<void> {
  const db = getDb();
  await db.prepare('DELETE FROM period_logs WHERE id = ?').bind(id).run();
}

export async function getPeriodLog(id: string): Promise<PeriodLog | null> {
  const db = getDb();
  return db.prepare('SELECT * FROM period_logs WHERE id = ?').bind(id).first<PeriodLog>();
}

export async function listPeriodLogs(userId: string): Promise<PeriodLog[]> {
  const db = getDb();
  const result = await db
    .prepare('SELECT * FROM period_logs WHERE user_id = ? ORDER BY start_date ASC')
    .bind(userId)
    .all<PeriodLog>();
  return result.results;
}

export async function listDailyStatusLogs(userId: string): Promise<DailyStatusLog[]> {
  const db = getDb();
  const result = await db
    .prepare('SELECT * FROM daily_status_logs WHERE user_id = ? ORDER BY log_date DESC')
    .bind(userId)
    .all<DailyStatusLog>();
  return result.results;
}

export async function getDailyStatusLog(
  userId: string,
  logDate: string,
): Promise<DailyStatusLog | null> {
  const db = getDb();
  return db
    .prepare('SELECT * FROM daily_status_logs WHERE user_id = ? AND log_date = ?')
    .bind(userId, logDate)
    .first<DailyStatusLog>();
}

export async function upsertDailyStatusLog(data: {
  userId: string;
  logDate: string;
  bleedingStatus?: string;
  painLevel?: number;
  mood?: string;
  energyLevel?: number;
  symptoms?: string[];
  notes?: string;
}): Promise<DailyStatusLog> {
  const db = getDb();
  const existing = await getDailyStatusLog(data.userId, data.logDate);
  const now = new Date().toISOString();
  if (existing) {
    await db
      .prepare(
        `UPDATE daily_status_logs
         SET bleeding_status = ?, pain_level = ?, mood = ?, energy_level = ?, symptoms_json = ?, notes = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        data.bleedingStatus ?? null,
        data.painLevel ?? null,
        data.mood ?? null,
        data.energyLevel ?? null,
        data.symptoms ? JSON.stringify(data.symptoms) : null,
        data.notes ?? null,
        now,
        existing.id,
      )
      .run();
    return {
      ...existing,
      bleeding_status: data.bleedingStatus ?? null,
      pain_level: data.painLevel ?? null,
      mood: data.mood ?? null,
      energy_level: data.energyLevel ?? null,
      symptoms_json: data.symptoms ? JSON.stringify(data.symptoms) : null,
      notes: data.notes ?? null,
      updated_at: now,
    };
  }
  const id = generateId();
  await db
    .prepare(
      `INSERT INTO daily_status_logs
        (id, user_id, log_date, bleeding_status, pain_level, mood, energy_level, symptoms_json, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      data.userId,
      data.logDate,
      data.bleedingStatus ?? null,
      data.painLevel ?? null,
      data.mood ?? null,
      data.energyLevel ?? null,
      data.symptoms ? JSON.stringify(data.symptoms) : null,
      data.notes ?? null,
      now,
      now,
    )
    .run();
  return {
    id,
    user_id: data.userId,
    log_date: data.logDate,
    bleeding_status: data.bleedingStatus ?? null,
    pain_level: data.painLevel ?? null,
    mood: data.mood ?? null,
    energy_level: data.energyLevel ?? null,
    symptoms_json: data.symptoms ? JSON.stringify(data.symptoms) : null,
    notes: data.notes ?? null,
    created_at: now,
    updated_at: now,
  };
}

export async function deleteDailyStatusLog(id: string): Promise<void> {
  const db = getDb();
  await db.prepare('DELETE FROM daily_status_logs WHERE id = ?').bind(id).run();
}
