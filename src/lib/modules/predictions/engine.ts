import type {
  CompletedCycle,
  PredictionInput,
  PredictionResult,
  ConfidenceBand,
} from './types';

export const ALGORITHM_VERSION = 'v1-calendar-rhythm';

const MIN_CYCLE_DAYS = 15;
const MAX_CYCLE_DAYS = 90;
const OVULATION_DAYS_BEFORE_PERIOD = 14;
const FERTILE_WINDOW_BEFORE = 5;
const FERTILE_WINDOW_AFTER = 1;
const MAX_CYCLES_USED = 12;
const MIN_CYCLES_FOR_MEDIUM = 3;
const CV_THRESHOLD = 0.2;

function parseDate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

function formatDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function sortCyclesByStart(cycles: CompletedCycle[]): CompletedCycle[] {
  return [...cycles].sort(
    (a, b) => parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime(),
  );
}

function computeCompletedCycles(cycles: CompletedCycle[]): CompletedCycle[] {
  const sorted = sortCyclesByStart(cycles);
  const completed: CompletedCycle[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    const lengthDays = daysBetween(parseDate(current.startDate), parseDate(next.startDate));
    if (lengthDays < MIN_CYCLE_DAYS || lengthDays > MAX_CYCLE_DAYS) continue;
    completed.push({ ...current, lengthDays });
  }
  if (sorted.length >= 1) {
    const last = sorted[sorted.length - 1];
    const prev = completed[completed.length - 1];
    if (!prev || prev.startDate !== last.startDate) {
      completed.push({ ...last, lengthDays: 0 });
    }
  }
  return completed.slice(-MAX_CYCLES_USED);
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2;
  return sorted[mid];
}

function coefficientOfVariation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 0;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance) / mean;
}

function determineConfidence(
  cyclesUsed: number,
  lengths: number[],
): { band: ConfidenceBand; reason: string } {
  if (cyclesUsed < MIN_CYCLES_FOR_MEDIUM) {
    return {
      band: 'low',
      reason: `Only ${cyclesUsed} completed cycle${cyclesUsed === 1 ? '' : 's'} available. At least 3 consistent cycles are needed for a more reliable estimate.`,
    };
  }
  const cv = coefficientOfVariation(lengths);
  if (cv > CV_THRESHOLD) {
    return {
      band: 'low',
      reason: `Cycle lengths are variable (coefficient of variation ${Math.round(cv * 100)}%). Calendar-only estimates are less reliable when cycles are irregular.`,
    };
  }
  return {
    band: 'medium',
    reason: `Based on ${cyclesUsed} consistent cycles. Calendar-only estimates remain approximations and are not medical confirmation.`,
  };
}

export function predict(input: PredictionInput): PredictionResult | null {
  if (input.cycles.length === 0) return null;

  const completed = computeCompletedCycles(input.cycles);
  if (completed.length === 0) return null;

  const lastCycle = completed[completed.length - 1];
  const lastPeriodStart = parseDate(lastCycle.startDate);

  const validLengths = completed
    .map((c) => c.lengthDays)
    .filter((l) => l >= MIN_CYCLE_DAYS && l <= MAX_CYCLE_DAYS);

  const avgCycleLength = validLengths.length > 0 ? Math.round(median(validLengths)) : 28;
  const avgPeriodLength = input.averagePeriodLength > 0 ? input.averagePeriodLength : 5;

  const predictedNextPeriod = new Date(
    lastPeriodStart.getTime() + avgCycleLength * 24 * 60 * 60 * 1000,
  );
  const predictedOvulation = new Date(
    predictedNextPeriod.getTime() - OVULATION_DAYS_BEFORE_PERIOD * 24 * 60 * 60 * 1000,
  );
  const fertileStart = new Date(
    predictedOvulation.getTime() - FERTILE_WINDOW_BEFORE * 24 * 60 * 60 * 1000,
  );
  const fertileEnd = new Date(
    predictedOvulation.getTime() + FERTILE_WINDOW_AFTER * 24 * 60 * 60 * 1000,
  );

  const { band, reason } = determineConfidence(completed.length, validLengths);

  return {
    predictedNextPeriodDate: formatDate(predictedNextPeriod),
    predictedOvulationDate: formatDate(predictedOvulation),
    predictedFertileStart: formatDate(fertileStart),
    predictedFertileEnd: formatDate(fertileEnd),
    averageCycleLengthUsed: avgCycleLength,
    averagePeriodLengthUsed: avgPeriodLength,
    cyclesConsidered: completed.length,
    confidenceBand: band,
    confidenceReason: reason,
    algorithmVersion: ALGORITHM_VERSION,
  };
}
