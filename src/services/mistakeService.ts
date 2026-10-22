import type {
  MathOperation,
  DifficultyLevel,
  MistakePattern,
  PracticeAttempt,
} from '../types';
import { generateId } from '../utils';
import { storageService } from './storageService';

export class MistakeService {
  /**
   * Records an attempt. If incorrect, records or updates a mistake pattern.
   * If correct and was from a mistake-review, updates mastery progress.
   */
  public handleAttempt(
    attempt: PracticeAttempt,
    masteryThreshold: number = 3,
  ): MistakePattern | null {
    const patterns = storageService.getMistakePatterns();

    if (!attempt.selfReportedCorrect) {
      // Find existing pattern with matching operation and operands
      const existingIdx = patterns.findIndex(
        (p) =>
          p.operation === attempt.operation &&
          p.firstOperand === attempt.firstOperand &&
          p.secondOperand === attempt.secondOperand,
      );

      let targetPattern: MistakePattern;

      if (existingIdx >= 0) {
        const existing = patterns[existingIdx];
        targetPattern = {
          ...existing,
          incorrectCount: existing.incorrectCount + 1,
          lastIncorrectAt: new Date().toISOString(),
          mastered: false, // Re-activate if made a mistake again
        };
        patterns[existingIdx] = targetPattern;
      } else {
        targetPattern = {
          id: generateId('mistake'),
          operation: attempt.operation,
          firstOperand: attempt.firstOperand,
          secondOperand: attempt.secondOperand,
          correctAnswer: attempt.correctAnswer,
          difficulty: attempt.difficulty,
          incorrectCount: 1,
          similarCorrectCount: 0,
          lastIncorrectAt: new Date().toISOString(),
          mastered: false,
        };
        patterns.unshift(targetPattern);
      }

      storageService.saveMistakePatterns(patterns);
      return targetPattern;
    } else if (attempt.source === 'mistake-review') {
      // Find related mistake pattern to increment similarCorrectCount
      // Match by exact operation and operands, or nearest related pattern
      const idx = patterns.findIndex(
        (p) =>
          !p.mastered &&
          p.operation === attempt.operation &&
          (p.firstOperand === attempt.firstOperand ||
            p.secondOperand === attempt.secondOperand),
      );

      if (idx >= 0) {
        const pattern = patterns[idx];
        const newCount = pattern.similarCorrectCount + 1;
        const isNowMastered = newCount >= masteryThreshold;

        patterns[idx] = {
          ...pattern,
          similarCorrectCount: newCount,
          mastered: isNowMastered,
        };

        storageService.saveMistakePatterns(patterns);
        return patterns[idx];
      }
    }

    return null;
  }

  /**
   * Retrieves active (non-mastered) mistake patterns sorted by priority.
   */
  public getActiveMistakes(): MistakePattern[] {
    const patterns = storageService.getMistakePatterns();
    const active = patterns.filter((p) => !p.mastered);

    // Prioritize by incorrectCount desc, then recency
    return active.sort((a, b) => {
      if (b.incorrectCount !== a.incorrectCount) {
        return b.incorrectCount - a.incorrectCount;
      }
      return (
        new Date(b.lastIncorrectAt).getTime() -
        new Date(a.lastIncorrectAt).getTime()
      );
    });
  }

  /**
   * Retrieves mastered mistake patterns.
   */
  public getMasteredMistakes(): MistakePattern[] {
    const patterns = storageService.getMistakePatterns();
    return patterns.filter((p) => p.mastered);
  }

  /**
   * Creates or updates a manual mistake pattern (useful for testing or direct ingestion).
   */
  public recordMistake(
    operation: MathOperation,
    firstOperand: number,
    secondOperand: number,
    correctAnswer: number,
    difficulty: DifficultyLevel,
  ): MistakePattern {
    const dummyAttempt: PracticeAttempt = {
      id: generateId('att'),
      questionId: generateId('q'),
      operation,
      firstOperand,
      secondOperand,
      correctAnswer,
      selectedAnswer: 0,
      selfReportedCorrect: false,
      difficulty,
      source: 'regular',
      attemptedAt: new Date().toISOString(),
      sessionId: 'manual',
    };
    return this.handleAttempt(dummyAttempt)!;
  }
}

export const mistakeService = new MistakeService();
export default mistakeService;
