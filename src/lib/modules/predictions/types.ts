export type ConfidenceBand = 'low' | 'medium';

export interface CompletedCycle {
  startDate: string;
  endDate: string;
  lengthDays: number;
}

export interface PredictionInput {
  cycles: CompletedCycle[];
  averagePeriodLength: number;
}

export interface PredictionResult {
  predictedNextPeriodDate: string;
  predictedOvulationDate: string;
  predictedFertileStart: string;
  predictedFertileEnd: string;
  averageCycleLengthUsed: number;
  averagePeriodLengthUsed: number;
  cyclesConsidered: number;
  confidenceBand: ConfidenceBand;
  confidenceReason: string;
  algorithmVersion: string;
}
