import type {
  AppSettings,
  AppStatistics,
  PracticeAttempt,
  PracticeSession,
  MistakePattern,
  MathOperation,
  DifficultyLevel,
} from '../types';

export const CURRENT_STORAGE_VERSION = 1;

export const STORAGE_KEYS = {
  VERSION: 'mathPractice.version',
  SETTINGS: 'mathPractice.settings',
  SESSIONS: 'mathPractice.sessions',
  ATTEMPTS: 'mathPractice.attempts',
  MISTAKE_PATTERNS: 'mathPractice.mistakePatterns',
  STATISTICS: 'mathPractice.statistics',
  ACTIVE_SESSION: 'mathPractice.activeSession',
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  cardAnimationEnabled: true,
  showExplanations: true,
  defaultSessionLength: 10,
  defaultDifficulty: 1,
  defaultOperations: ['addition', 'subtraction'],
  masteryThreshold: 3,
};

export function createInitialStatistics(): AppStatistics {
  const operations: MathOperation[] = [
    'addition',
    'subtraction',
    'multiplication',
    'division',
  ];
  const difficulties: DifficultyLevel[] = [1, 2, 3, 4];

  const byOperation = operations.reduce(
    (acc, op) => {
      acc[op] = { attempted: 0, correct: 0, incorrect: 0 };
      return acc;
    },
    {} as AppStatistics['byOperation'],
  );

  const byDifficulty = difficulties.reduce(
    (acc, d) => {
      acc[d] = { attempted: 0, correct: 0, incorrect: 0 };
      return acc;
    },
    {} as AppStatistics['byDifficulty'],
  );

  return {
    attempted: 0,
    correct: 0,
    incorrect: 0,
    byOperation,
    byDifficulty,
  };
}

class StorageService {
  private isAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  public getItem<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (err) {
      console.warn(`Error reading key "${key}" from localStorage:`, err);
      return defaultValue;
    }
  }

  public setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`Error saving key "${key}" to localStorage:`, err);
      return false;
    }
  }

  public removeItem(key: string): void {
    if (!this.isAvailable()) return;
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.warn(`Error removing key "${key}":`, err);
    }
  }

  // --- Settings ---
  public getSettings(): AppSettings {
    const loaded = this.getItem<Partial<AppSettings>>(
      STORAGE_KEYS.SETTINGS,
      DEFAULT_SETTINGS,
    );
    return { ...DEFAULT_SETTINGS, ...loaded };
  }

  public saveSettings(settings: AppSettings): boolean {
    return this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  // --- Sessions ---
  public getSessions(): PracticeSession[] {
    const list = this.getItem<PracticeSession[]>(STORAGE_KEYS.SESSIONS, []);
    return Array.isArray(list) ? list : [];
  }

  public saveSession(session: PracticeSession): boolean {
    const sessions = this.getSessions();
    const existingIdx = sessions.findIndex((s) => s.id === session.id);
    let updated: PracticeSession[];
    if (existingIdx >= 0) {
      updated = [...sessions];
      updated[existingIdx] = session;
    } else {
      // Add to front, cap history to 100 sessions to avoid unbounded growth
      updated = [session, ...sessions].slice(0, 100);
    }
    return this.setItem(STORAGE_KEYS.SESSIONS, updated);
  }

  // --- Attempts ---
  public getAttempts(): PracticeAttempt[] {
    const list = this.getItem<PracticeAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
    return Array.isArray(list) ? list : [];
  }

  public saveAttempt(attempt: PracticeAttempt): boolean {
    const attempts = this.getAttempts();
    // Cap stored detailed attempts to 1000
    const updated = [attempt, ...attempts].slice(0, 1000);
    return this.setItem(STORAGE_KEYS.ATTEMPTS, updated);
  }

  // --- Mistake Patterns ---
  public getMistakePatterns(): MistakePattern[] {
    const list = this.getItem<MistakePattern[]>(
      STORAGE_KEYS.MISTAKE_PATTERNS,
      [],
    );
    return Array.isArray(list) ? list : [];
  }

  public saveMistakePatterns(patterns: MistakePattern[]): boolean {
    return this.setItem(STORAGE_KEYS.MISTAKE_PATTERNS, patterns);
  }

  // --- Statistics ---
  public getStatistics(): AppStatistics {
    const stats = this.getItem<AppStatistics | null>(
      STORAGE_KEYS.STATISTICS,
      null,
    );
    if (!stats || typeof stats !== 'object' || !stats.byOperation) {
      const initial = createInitialStatistics();
      this.setItem(STORAGE_KEYS.STATISTICS, initial);
      return initial;
    }
    return stats;
  }

  public saveStatistics(statistics: AppStatistics): boolean {
    return this.setItem(STORAGE_KEYS.STATISTICS, statistics);
  }

  // --- Active Session Recovery ---
  public getActiveSession(): {
    session: PracticeSession;
    questionIndex: number;
    currentQuestion: unknown;
    selectedAnswer: number | null;
  } | null {
    return this.getItem(STORAGE_KEYS.ACTIVE_SESSION, null);
  }

  public saveActiveSession(data: {
    session: PracticeSession;
    questionIndex: number;
    currentQuestion: unknown;
    selectedAnswer: number | null;
  }): boolean {
    return this.setItem(STORAGE_KEYS.ACTIVE_SESSION, data);
  }

  public clearActiveSession(): void {
    this.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  }

  // --- Resetting & Clearing ---
  public resetStatisticsOnly(): void {
    const emptyStats = createInitialStatistics();
    this.saveStatistics(emptyStats);
    this.setItem(STORAGE_KEYS.SESSIONS, []);
    this.setItem(STORAGE_KEYS.ATTEMPTS, []);
  }

  public clearAllData(): void {
    if (!this.isAvailable()) return;
    Object.values(STORAGE_KEYS).forEach((k) => this.removeItem(k));
    this.saveSettings(DEFAULT_SETTINGS);
    this.saveStatistics(createInitialStatistics());
  }
}

export const storageService = new StorageService();
export default storageService;
