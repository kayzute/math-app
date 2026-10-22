import { describe, it, expect, beforeEach } from 'vitest';
import { mistakeService } from './mistakeService';
import type { PracticeAttempt } from '../types';

describe('MistakeService', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const baseAttempt: PracticeAttempt = {
    id: 'att_test',
    questionId: 'q_test',
    operation: 'multiplication',
    firstOperand: 7,
    secondOperand: 8,
    correctAnswer: 56,
    selectedAnswer: 48,
    selfReportedCorrect: false,
    difficulty: 2,
    source: 'regular',
    attemptedAt: new Date().toISOString(),
    sessionId: 'sess_test',
  };

  it('creates a new mistake pattern upon incorrect answer', () => {
    const pattern = mistakeService.handleAttempt(baseAttempt);
    expect(pattern).not.toBeNull();
    expect(pattern?.operation).toBe('multiplication');
    expect(pattern?.firstOperand).toBe(7);
    expect(pattern?.secondOperand).toBe(8);
    expect(pattern?.incorrectCount).toBe(1);
    expect(pattern?.mastered).toBe(false);

    const active = mistakeService.getActiveMistakes();
    expect(active).toHaveLength(1);
  });

  it('increments incorrectCount and updates timestamp on repeat mistake', () => {
    mistakeService.handleAttempt(baseAttempt);
    const updated = mistakeService.handleAttempt(baseAttempt);

    expect(updated?.incorrectCount).toBe(2);
    const active = mistakeService.getActiveMistakes();
    expect(active).toHaveLength(1);
  });

  it('advances mastery progress and marks pattern as mastered when threshold is met', () => {
    mistakeService.handleAttempt(baseAttempt); // created with similarCorrectCount: 0

    const reviewAttempt: PracticeAttempt = {
      ...baseAttempt,
      selectedAnswer: 56,
      selfReportedCorrect: true,
      source: 'mistake-review',
    };

    // 1st review correct
    mistakeService.handleAttempt(reviewAttempt, 3);
    expect(mistakeService.getActiveMistakes()[0].similarCorrectCount).toBe(1);

    // 2nd review correct
    mistakeService.handleAttempt(reviewAttempt, 3);
    expect(mistakeService.getActiveMistakes()[0].similarCorrectCount).toBe(2);

    // 3rd review correct -> mastered!
    const mastered = mistakeService.handleAttempt(reviewAttempt, 3);
    expect(mastered?.mastered).toBe(true);

    // Active mistakes should now be empty, mastered mistakes should have 1
    expect(mistakeService.getActiveMistakes()).toHaveLength(0);
    expect(mistakeService.getMasteredMistakes()).toHaveLength(1);
  });

  it('re-activates a mastered pattern if the student misses it again later', () => {
    mistakeService.handleAttempt(baseAttempt);

    const reviewAttempt: PracticeAttempt = {
      ...baseAttempt,
      selfReportedCorrect: true,
      source: 'mistake-review',
    };
    mistakeService.handleAttempt(reviewAttempt, 1); // mastered with threshold 1
    expect(mistakeService.getActiveMistakes()).toHaveLength(0);

    // Later, student misses it again
    const missAgain = mistakeService.handleAttempt(baseAttempt);
    expect(missAgain?.mastered).toBe(false);
    expect(mistakeService.getActiveMistakes()).toHaveLength(1);
  });
});
