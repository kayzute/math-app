import type { MathOperation, DifficultyLevel } from './question';

export interface OperationStatistics {
  attempted: number;
  correct: number;
  incorrect: number;
}

export interface AppStatistics {
  attempted: number;
  correct: number;
  incorrect: number;
  byOperation: Record<MathOperation, OperationStatistics>;
  byDifficulty: Record<DifficultyLevel, OperationStatistics>;
}

export interface MistakeReviewStatistics {
  activePatternsCount: number;
  masteredPatternsCount: number;
  mostMissedOperation: MathOperation | null;
  mostMissedFacts: string[];
  similarPracticedCount: number;
}
