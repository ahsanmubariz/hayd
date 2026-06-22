import {
  createPeriodLog,
  updatePeriodLog,
  deletePeriodLog,
  getPeriodLog,
  listPeriodLogs,
  listDailyStatusLogs,
  getDailyStatusLog,
  upsertDailyStatusLog,
  deleteDailyStatusLog,
} from './repository';
import {
  createPeriodLogSchema,
  updatePeriodLogSchema,
  createDailyStatusSchema,
  updateDailyStatusSchema,
} from './validation';
import type {
  CreatePeriodLogInput,
  UpdatePeriodLogInput,
  CreateDailyStatusInput,
  UpdateDailyStatusInput,
} from './validation';
import { ValidationError } from '../users/service';

export async function addPeriodLog(userId: string, input: CreatePeriodLogInput) {
  const parsed = createPeriodLogSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? 'form';
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    throw new ValidationError('Invalid input', fieldErrors);
  }
  return createPeriodLog({ userId, ...parsed.data });
}

export async function editPeriodLog(
  userId: string,
  logId: string,
  input: UpdatePeriodLogInput,
) {
  const log = await getPeriodLog(logId);
  if (!log || log.user_id !== userId) {
    throw new ValidationError('Period log not found', { form: 'Period log not found' });
  }
  const parsed = updatePeriodLogSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? 'form';
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    throw new ValidationError('Invalid input', fieldErrors);
  }
  await updatePeriodLog(logId, parsed.data);
}

export async function removePeriodLog(userId: string, logId: string) {
  const log = await getPeriodLog(logId);
  if (!log || log.user_id !== userId) {
    throw new ValidationError('Period log not found', { form: 'Period log not found' });
  }
  await deletePeriodLog(logId);
}

export async function addDailyStatus(userId: string, input: CreateDailyStatusInput) {
  const parsed = createDailyStatusSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? 'form';
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    throw new ValidationError('Invalid input', fieldErrors);
  }
  return upsertDailyStatusLog({ userId, ...parsed.data });
}

export async function editDailyStatus(
  userId: string,
  logDate: string,
  input: UpdateDailyStatusInput,
) {
  const existing = await getDailyStatusLog(userId, logDate);
  if (!existing) {
    throw new ValidationError('Daily status not found', { form: 'Daily status not found' });
  }
  const parsed = updateDailyStatusSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? 'form';
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    throw new ValidationError('Invalid input', fieldErrors);
  }
  await upsertDailyStatusLog({ userId, logDate, ...parsed.data });
}

export async function removeDailyStatus(userId: string, logId: string) {
  const db = await import('@/lib/db/client').then((m) => m.getDb());
  const log = await db
    .prepare('SELECT user_id FROM daily_status_logs WHERE id = ?')
    .bind(logId)
    .first<{ user_id: string }>();
  if (!log || log.user_id !== userId) {
    throw new ValidationError('Daily status not found', { form: 'Daily status not found' });
  }
  await deleteDailyStatusLog(logId);
}

export { listPeriodLogs, listDailyStatusLogs, getDailyStatusLog };
