import type { MathOperation, DifficultyLevel, Question } from './question';
import type {
  PracticeSession,
  PracticeAttempt,
  SessionLength,
} from './session';
import type { MistakePattern } from './mistake';
import type { AppStatistics } from './statistics';

export interface AppSettings {
  soundEnabled: boolean;
  cardAnimationEnabled: boolean;
  showExplanations: boolean;
  defaultSessionLength: SessionLength;
  defaultDifficulty: DifficultyLevel;
  defaultOperations: MathOperation[];
  masteryThreshold: number;
}

export interface AppState {
  settings: AppSettings;
  currentSession: PracticeSession | null;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  isCardFlipped: boolean;
  attempts: PracticeAttempt[];
  mistakePatterns: MistakePattern[];
  statistics: AppStatistics;
}
