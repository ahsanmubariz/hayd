import { getDb } from '@/lib/db/client';
import type { PeriodLog, PredictionSnapshot } from '@/lib/db/schema';
import { predict } from './engine';
import type { CompletedCycle, PredictionResult } from './types';

function buildCycles(logs: PeriodLog[]): CompletedCycle[] {
  return logs.map((log) => ({
    startDate: log.start_date,
    endDate: log.end_date,
    lengthDays: 0,
  }));
}

function averagePeriodLength(logs: PeriodLog[]): number {
  if (logs.length === 0) return 5;
  const total = logs.reduce((acc, log) => {
    const start = new Date(log.start_date);
    const end = new Date(log.end_date);
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return acc + Math.max(1, days);
  }, 0);
  return Math.round(total / logs.length);
}

function generateId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function recomputeAndStore(userId: string): Promise<PredictionResult | null> {
  const db = getDb();
  const logs = await db
    .prepare('SELECT * FROM period_logs WHERE user_id = ? ORDER BY start_date ASC')
    .bind(userId)
    .all<PeriodLog>();

  if (logs.results.length === 0) return null;

  const cycles = buildCycles(logs.results);
  const avgPeriodLen = averagePeriodLength(logs.results);
  const result = predict({ cycles, averagePeriodLength: avgPeriodLen });
  if (!result) return null;

  const lastLog = logs.results[logs.results.length - 1];
  const id = generateId();
  await db
    .prepare(
      `INSERT INTO prediction_snapshots
        (id, user_id, basis_period_log_id, predicted_next_period_date, predicted_ovulation_date,
         predicted_fertile_start, predicted_fertile_end, average_cycle_length_used,
         average_period_length_used, cycles_considered, confidence_band, algorithm_version, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      userId,
      lastLog.id,
      result.predictedNextPeriodDate,
      result.predictedOvulationDate,
      result.predictedFertileStart,
      result.predictedFertileEnd,
      result.averageCycleLengthUsed,
      result.averagePeriodLengthUsed,
      result.cyclesConsidered,
      result.confidenceBand,
      result.algorithmVersion,
      new Date().toISOString(),
    )
    .run();
  return result;
}

export async function getLatestSnapshot(userId: string): Promise<PredictionSnapshot | null> {
  const db = getDb();
  const row = await db
    .prepare('SELECT * FROM prediction_snapshots WHERE user_id = ? ORDER BY created_at DESC LIMIT 1')
    .bind(userId)
    .first<PredictionSnapshot>();
  return row;
}
