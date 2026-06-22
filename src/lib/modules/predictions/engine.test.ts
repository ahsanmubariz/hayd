import { describe, it, expect } from 'vitest';
import { predict } from './engine';
import type { CompletedCycle } from './types';

describe('prediction engine', () => {
  it('returns null when no cycles', () => {
    const result = predict({ cycles: [], averagePeriodLength: 5 });
    expect(result).toBeNull();
  });

  it('computes next period from last cycle start + avg length', () => {
    const cycles: CompletedCycle[] = [
      { startDate: '2026-01-01', endDate: '2026-01-05', lengthDays: 0 },
      { startDate: '2026-01-29', endDate: '2026-02-02', lengthDays: 0 },
      { startDate: '2026-02-26', endDate: '2026-03-02', lengthDays: 0 },
    ];
    const result = predict({ cycles, averagePeriodLength: 5 });
    expect(result).not.toBeNull();
    expect(result!.predictedNextPeriodDate).toBe('2026-03-26');
    expect(result!.averageCycleLengthUsed).toBe(28);
    expect(result!.cyclesConsidered).toBe(3);
  });

  it('estimates ovulation 14 days before next period', () => {
    const cycles: CompletedCycle[] = [
      { startDate: '2026-01-01', endDate: '2026-01-05', lengthDays: 0 },
      { startDate: '2026-01-29', endDate: '2026-02-02', lengthDays: 0 },
      { startDate: '2026-02-26', endDate: '2026-03-02', lengthDays: 0 },
    ];
    const result = predict({ cycles, averagePeriodLength: 5 });
    expect(result!.predictedOvulationDate).toBe('2026-03-12');
  });

  it('estimates fertile window around ovulation', () => {
    const cycles: CompletedCycle[] = [
      { startDate: '2026-01-01', endDate: '2026-01-05', lengthDays: 0 },
      { startDate: '2026-01-29', endDate: '2026-02-02', lengthDays: 0 },
      { startDate: '2026-02-26', endDate: '2026-03-02', lengthDays: 0 },
    ];
    const result = predict({ cycles, averagePeriodLength: 5 });
    expect(result!.predictedFertileStart).toBe('2026-03-07');
    expect(result!.predictedFertileEnd).toBe('2026-03-13');
  });

  it('returns low confidence with fewer than 3 cycles', () => {
    const cycles: CompletedCycle[] = [
      { startDate: '2026-01-01', endDate: '2026-01-05', lengthDays: 0 },
      { startDate: '2026-01-29', endDate: '2026-02-02', lengthDays: 0 },
    ];
    const result = predict({ cycles, averagePeriodLength: 5 });
    expect(result!.confidenceBand).toBe('low');
  });

  it('returns low confidence when cycles are highly variable', () => {
    const cycles: CompletedCycle[] = [
      { startDate: '2026-01-01', endDate: '2026-01-05', lengthDays: 0 },
      { startDate: '2026-01-12', endDate: '2026-01-16', lengthDays: 0 },
      { startDate: '2026-02-10', endDate: '2026-02-14', lengthDays: 0 },
      { startDate: '2026-02-17', endDate: '2026-02-21', lengthDays: 0 },
    ];
    const result = predict({ cycles, averagePeriodLength: 5 });
    expect(result!.confidenceBand).toBe('low');
  });

  it('returns medium confidence with 3+ consistent cycles', () => {
    const cycles: CompletedCycle[] = [
      { startDate: '2026-01-01', endDate: '2026-01-05', lengthDays: 0 },
      { startDate: '2026-01-29', endDate: '2026-02-02', lengthDays: 0 },
      { startDate: '2026-02-26', endDate: '2026-03-02', lengthDays: 0 },
      { startDate: '2026-03-26', endDate: '2026-03-30', lengthDays: 0 },
    ];
    const result = predict({ cycles, averagePeriodLength: 5 });
    expect(result!.confidenceBand).toBe('medium');
  });

  it('excludes invalid cycle lengths', () => {
    const cycles: CompletedCycle[] = [
      { startDate: '2026-01-01', endDate: '2026-01-05', lengthDays: 0 },
      { startDate: '2026-01-05', endDate: '2026-01-09', lengthDays: 0 },
      { startDate: '2026-01-29', endDate: '2026-02-02', lengthDays: 0 },
      { startDate: '2026-02-26', endDate: '2026-03-02', lengthDays: 0 },
    ];
    const result = predict({ cycles, averagePeriodLength: 5 });
    // Valid intervals: Jan 5→Jan 29 = 24d, Jan 29→Feb 26 = 28d. Median = 26.
    expect(result!.averageCycleLengthUsed).toBe(26);
  });
});
