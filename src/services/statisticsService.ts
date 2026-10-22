import type {
  AppStatistics,
  PracticeAttempt,
  PracticeSession,
  MathOperation,
  MistakeReviewStatistics,
} from '../types';
import { storageService, createInitialStatistics } from './storageService';
import { mistakeService } from './mistakeService';

export class StatisticsService {
  /**
   * Calculates accuracy percentage. Returns 0 if attempted === 0.
   */
  public calculateAccuracy(correct: number, attempted: number): number {
    if (attempted <= 0) return 0;
    return Math.round((correct / attempted) * 100);
  }

  /**
   * Records a completed practice attempt and updates aggregate statistics.
   */
  public recordAttempt(attempt: PracticeAttempt): AppStatistics {
    // 1. Save detailed attempt to storage
    storageService.saveAttempt(attempt);

    // 2. Update aggregate statistics
    const stats = storageService.getStatistics();
    stats.attempted += 1;
    if (attempt.selfReportedCorrect) {
      stats.correct += 1;
    } else {
      stats.incorrect += 1;
    }

    // Update operation stats
    const op = attempt.operation;
    if (!stats.byOperation[op]) {
      stats.byOperation[op] = { attempted: 0, correct: 0, incorrect: 0 };
    }
    stats.byOperation[op].attempted += 1;
    if (attempt.selfReportedCorrect) {
      stats.byOperation[op].correct += 1;
    } else {
      stats.byOperation[op].incorrect += 1;
    }

    // Update difficulty stats
    const diff = attempt.difficulty;
    if (!stats.byDifficulty[diff]) {
      stats.byDifficulty[diff] = { attempted: 0, correct: 0, incorrect: 0 };
    }
    stats.byDifficulty[diff].attempted += 1;
    if (attempt.selfReportedCorrect) {
      stats.byDifficulty[diff].correct += 1;
    } else {
      stats.byDifficulty[diff].incorrect += 1;
    }

    storageService.saveStatistics(stats);

    // 3. Update mistake tracking
    const settings = storageService.getSettings();
    mistakeService.handleAttempt(attempt, settings.masteryThreshold);

    return stats;
  }

  /**
   * Saves a completed practice session.
   */
  public recordSession(session: PracticeSession): void {
    storageService.saveSession(session);
  }

  /**
   * Retrieves overall aggregate statistics.
   */
  public getStatistics(): AppStatistics {
    return storageService.getStatistics();
  }

  /**
   * Computes comprehensive mistake review statistics.
   */
  public getMistakeStatistics(): MistakeReviewStatistics {
    const active = mistakeService.getActiveMistakes();
    const mastered = mistakeService.getMasteredMistakes();
    const allPatterns = [...active, ...mastered];

    // Count similar questions practiced & correct
    const similarPracticedCount = allPatterns.reduce(
      (sum, p) => sum + p.similarCorrectCount,
      0,
    );

    // Calculate most frequently missed operation
    const opCounts: Record<MathOperation, number> = {
      addition: 0,
      subtraction: 0,
      multiplication: 0,
      division: 0,
    };

    allPatterns.forEach((p) => {
      opCounts[p.operation] = (opCounts[p.operation] || 0) + p.incorrectCount;
    });

    let maxOp: MathOperation | null = null;
    let maxOpCount = 0;
    (Object.keys(opCounts) as MathOperation[]).forEach((op) => {
      if (opCounts[op] > maxOpCount) {
        maxOpCount = opCounts[op];
        maxOp = op;
      }
    });

    // Top missed number facts
    const sortedFacts = [...allPatterns]
      .sort((a, b) => b.incorrectCount - a.incorrectCount)
      .slice(0, 5)
      .map((p) => {
        const sym =
          p.operation === 'addition'
            ? '+'
            : p.operation === 'subtraction'
              ? '-'
              : p.operation === 'multiplication'
                ? '×'
                : '÷';
        return `${p.firstOperand} ${sym} ${p.secondOperand} (missed ${p.incorrectCount}×)`;
      });

    return {
      activePatternsCount: active.length,
      masteredPatternsCount: mastered.length,
      mostMissedOperation: maxOpCount > 0 ? maxOp : null,
      mostMissedFacts: sortedFacts,
      similarPracticedCount,
    };
  }

  /**
   * Returns recent sessions sorted from newest to oldest.
   */
  public getRecentSessions(): PracticeSession[] {
    const sessions = storageService.getSessions();
    return [...sessions].sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    );
  }

  /**
   * Resets all statistics, sessions, and attempts after confirmation.
   */
  public resetStatistics(): void {
    storageService.resetStatisticsOnly();
  }

  /**
   * Recomputes aggregate statistics from raw attempts (integrity helper).
   */
  public recomputeFromAttempts(): AppStatistics {
    const attempts = storageService.getAttempts();
    const freshStats = createInitialStatistics();

    attempts.forEach((att) => {
      freshStats.attempted += 1;
      if (att.selfReportedCorrect) {
        freshStats.correct += 1;
      } else {
        freshStats.incorrect += 1;
      }

      if (freshStats.byOperation[att.operation]) {
        freshStats.byOperation[att.operation].attempted += 1;
        if (att.selfReportedCorrect) {
          freshStats.byOperation[att.operation].correct += 1;
        } else {
          freshStats.byOperation[att.operation].incorrect += 1;
        }
      }

      if (freshStats.byDifficulty[att.difficulty]) {
        freshStats.byDifficulty[att.difficulty].attempted += 1;
        if (att.selfReportedCorrect) {
          freshStats.byDifficulty[att.difficulty].correct += 1;
        } else {
          freshStats.byDifficulty[att.difficulty].incorrect += 1;
        }
      }
    });

    storageService.saveStatistics(freshStats);
    return freshStats;
  }
}

export const statisticsService = new StatisticsService();
export default statisticsService;
