import { describe, it, expect, beforeEach } from 'vitest';
import { statisticsService } from './statisticsService';
import type { PracticeAttempt } from '../types';

describe('StatisticsService', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('calculates accuracy percentage accurately', () => {
    expect(statisticsService.calculateAccuracy(0, 0)).toBe(0);
    expect(statisticsService.calculateAccuracy(5, 10)).toBe(50);
    expect(statisticsService.calculateAccuracy(7, 9)).toBe(78);
    expect(statisticsService.calculateAccuracy(10, 10)).toBe(100);
  });

  it('records attempts and updates aggregate statistics by operation and difficulty', () => {
    const attempt1: PracticeAttempt = {
      id: 'att_1',
      questionId: 'q_1',
      operation: 'addition',
      firstOperand: 5,
      secondOperand: 5,
      correctAnswer: 10,
      selectedAnswer: 10,
      selfReportedCorrect: true,
      difficulty: 1,
      source: 'regular',
      attemptedAt: new Date().toISOString(),
      sessionId: 's_1',
    };

    const attempt2: PracticeAttempt = {
      id: 'att_2',
      questionId: 'q_2',
      operation: 'addition',
      firstOperand: 7,
      secondOperand: 4,
      correctAnswer: 11,
      selectedAnswer: 12,
      selfReportedCorrect: false,
      difficulty: 1,
      source: 'regular',
      attemptedAt: new Date().toISOString(),
      sessionId: 's_1',
    };

    statisticsService.recordAttempt(attempt1);
    statisticsService.recordAttempt(attempt2);

    const stats = statisticsService.getStatistics();
    expect(stats.attempted).toBe(2);
    expect(stats.correct).toBe(1);
    expect(stats.incorrect).toBe(1);

    expect(stats.byOperation.addition.attempted).toBe(2);
    expect(stats.byOperation.addition.correct).toBe(1);
    expect(stats.byOperation.addition.incorrect).toBe(1);

    expect(stats.byDifficulty[1].attempted).toBe(2);
    expect(stats.byDifficulty[1].correct).toBe(1);
  });

  it('resets statistics properly', () => {
    const attempt: PracticeAttempt = {
      id: 'att_1',
      questionId: 'q_1',
      operation: 'subtraction',
      firstOperand: 10,
      secondOperand: 4,
      correctAnswer: 6,
      selectedAnswer: 6,
      selfReportedCorrect: true,
      difficulty: 2,
      source: 'regular',
      attemptedAt: new Date().toISOString(),
      sessionId: 's_1',
    };
    statisticsService.recordAttempt(attempt);
    expect(statisticsService.getStatistics().attempted).toBe(1);

    statisticsService.resetStatistics();
    expect(statisticsService.getStatistics().attempted).toBe(0);
  });
});
