import { describe, it, expect, beforeEach } from 'vitest';
import {
  storageService,
  DEFAULT_SETTINGS,
  createInitialStatistics,
} from './storageService';
import type {
  PracticeAttempt,
  PracticeSession,
  MistakePattern,
} from '../types';

describe('StorageService', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('loads default settings when none stored', () => {
    const settings = storageService.getSettings();
    expect(settings).toEqual(DEFAULT_SETTINGS);
  });

  it('saves and updates settings', () => {
    const custom = {
      ...DEFAULT_SETTINGS,
      soundEnabled: false,
      defaultDifficulty: 3 as const,
    };
    storageService.saveSettings(custom);
    const retrieved = storageService.getSettings();
    expect(retrieved.soundEnabled).toBe(false);
    expect(retrieved.defaultDifficulty).toBe(3);
  });

  it('saves and retrieves sessions', () => {
    const session: PracticeSession = {
      id: 'sess_1',
      startedAt: new Date().toISOString(),
      operations: ['multiplication'],
      difficulty: 2,
      sessionLength: 10,
      attempted: 10,
      correct: 9,
      incorrect: 1,
    };

    storageService.saveSession(session);
    const list = storageService.getSessions();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('sess_1');
  });

  it('saves and retrieves attempts', () => {
    const attempt: PracticeAttempt = {
      id: 'att_1',
      questionId: 'q_1',
      operation: 'addition',
      firstOperand: 2,
      secondOperand: 3,
      correctAnswer: 5,
      selectedAnswer: 5,
      selfReportedCorrect: true,
      difficulty: 1,
      source: 'regular',
      attemptedAt: new Date().toISOString(),
      sessionId: 'sess_1',
    };

    storageService.saveAttempt(attempt);
    const list = storageService.getAttempts();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('att_1');
  });

  it('saves and retrieves mistake patterns', () => {
    const pattern: MistakePattern = {
      id: 'm_1',
      operation: 'division',
      firstOperand: 56,
      secondOperand: 7,
      correctAnswer: 8,
      difficulty: 2,
      incorrectCount: 2,
      similarCorrectCount: 1,
      lastIncorrectAt: new Date().toISOString(),
      mastered: false,
    };

    storageService.saveMistakePatterns([pattern]);
    const list = storageService.getMistakePatterns();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('m_1');
  });

  it('initializes statistics if none exist', () => {
    const stats = storageService.getStatistics();
    expect(stats.attempted).toBe(0);
    expect(stats.correct).toBe(0);
    expect(stats.byOperation.addition.attempted).toBe(0);
  });

  it('resets statistics while preserving settings', () => {
    storageService.saveSettings({ ...DEFAULT_SETTINGS, soundEnabled: false });
    storageService.saveStatistics({
      ...createInitialStatistics(),
      attempted: 15,
      correct: 12,
    });

    storageService.resetStatisticsOnly();
    const stats = storageService.getStatistics();
    const settings = storageService.getSettings();

    expect(stats.attempted).toBe(0);
    expect(settings.soundEnabled).toBe(false);
  });

  it('clears all application data', () => {
    storageService.saveSettings({ ...DEFAULT_SETTINGS, defaultDifficulty: 4 });
    storageService.clearAllData();
    const settings = storageService.getSettings();
    expect(settings.defaultDifficulty).toBe(1);
  });
});
