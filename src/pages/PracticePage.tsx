import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout';
import { QuestionCard, ProgressBar } from '../components/practice';
import { Button, ConfirmDialog } from '../components/common';
import {
  generateQuestionForOperations,
  generateSimilarQuestion,
  storageService,
  statisticsService,
  mistakeService,
} from '../services';
import { generateId } from '../utils';
import type {
  MathOperation,
  DifficultyLevel,
  SessionLength,
  PracticeMode,
  Question,
  PracticeSession,
  PracticeAttempt,
} from '../types';

interface PracticeLocationState {
  mode?: PracticeMode;
  operations?: MathOperation[];
  difficulty?: DifficultyLevel;
  sessionLength?: SessionLength;
}

export const PracticePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as PracticeLocationState) || {};
  const settings = storageService.getSettings();

  const mode: PracticeMode = state.mode || 'regular';
  const operations: MathOperation[] =
    state.operations && state.operations.length > 0
      ? state.operations
      : settings.defaultOperations;
  const difficulty: DifficultyLevel =
    state.difficulty || settings.defaultDifficulty;
  const sessionLength: SessionLength =
    state.sessionLength || settings.defaultSessionLength;

  const [session, setSession] = useState<PracticeSession>(() => {
    return {
      id: generateId('sess'),
      startedAt: new Date().toISOString(),
      operations,
      difficulty,
      sessionLength,
      attempted: 0,
      correct: 0,
      incorrect: 0,
    };
  });

  const [questionIndex, setQuestionIndex] = useState(0);
  const [mistakeReviewCount, setMistakeReviewCount] = useState(0);

  // Question generator helper
  const getNextQuestion = (): Question => {
    if (mode === 'mistake-review') {
      const active = mistakeService.getActiveMistakes();
      if (active.length > 0) {
        const picked = active[Math.floor(Math.random() * active.length)];
        return generateSimilarQuestion(picked);
      }
    }
    return generateQuestionForOperations(operations, difficulty);
  };

  const [currentQuestion, setCurrentQuestion] = useState<Question>(() =>
    getNextQuestion(),
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasRecordedResult, setHasRecordedResult] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const sessionRef = useRef(session);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Accidental browser navigation / tab close protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (sessionRef.current.attempted > 0) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleSelectAnswer = (choice: number) => {
    if (isFlipped) return;
    setSelectedAnswer(choice);
  };

  const handleFlipCard = () => {
    if (selectedAnswer === null) return;
    setIsFlipped(true);
  };

  const completeSession = (finalSession: PracticeSession) => {
    const completed: PracticeSession = {
      ...finalSession,
      completedAt: new Date().toISOString(),
    };
    statisticsService.recordSession(completed);
    storageService.clearActiveSession();
    navigate('/practice/summary', {
      state: {
        session: completed,
        mistakeReviewCount,
      },
    });
  };

  const handleReportResult = (isCorrect: boolean) => {
    if (hasRecordedResult) return;
    setHasRecordedResult(true);

    // 1. Record Attempt
    const attempt: PracticeAttempt = {
      id: generateId('att'),
      questionId: currentQuestion.id,
      operation: currentQuestion.operation,
      firstOperand: currentQuestion.firstOperand,
      secondOperand: currentQuestion.secondOperand,
      correctAnswer: currentQuestion.correctAnswer,
      selectedAnswer: selectedAnswer ?? 0,
      selfReportedCorrect: isCorrect,
      difficulty: currentQuestion.difficulty,
      source: currentQuestion.source,
      attemptedAt: new Date().toISOString(),
      sessionId: session.id,
    };

    statisticsService.recordAttempt(attempt);

    if (currentQuestion.source === 'mistake-review') {
      setMistakeReviewCount((c) => c + 1);
    }

    // 2. Update Session Metrics
    const updatedSession: PracticeSession = {
      ...session,
      attempted: session.attempted + 1,
      correct: session.correct + (isCorrect ? 1 : 0),
      incorrect: session.incorrect + (isCorrect ? 0 : 1),
    };
    setSession(updatedSession);

    const nextIndex = questionIndex + 1;

    // Check if session length reached (for fixed sessions)
    if (sessionLength !== 'continuous' && nextIndex >= sessionLength) {
      setTimeout(() => {
        completeSession(updatedSession);
      }, 400);
      return;
    }

    // Save active state to storage for reload recovery
    storageService.saveActiveSession({
      session: updatedSession,
      questionIndex: nextIndex,
      currentQuestion: null,
      selectedAnswer: null,
    });

    // Advance to next question after short animation
    setTimeout(() => {
      const nextQ = getNextQuestion();
      setCurrentQuestion(nextQ);
      setQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setIsFlipped(false);
      setHasRecordedResult(false);
    }, 350);
  };

  const handleExitConfirmed = () => {
    if (session.attempted > 0) {
      statisticsService.recordSession({
        ...session,
        completedAt: new Date().toISOString(),
      });
    }
    storageService.clearActiveSession();
    setShowExitDialog(false);
    navigate('/practice/setup');
  };

  return (
    <PageContainer>
      <div
        style={{
          maxWidth: '580px',
          margin: '0 auto 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              if (session.attempted > 0) {
                setShowExitDialog(true);
              } else {
                navigate('/practice/setup');
              }
            }}
            aria-label="Exit current practice session"
          >
            ← Exit Session
          </Button>

          {sessionLength === 'continuous' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => completeSession(session)}
            >
              Finish Practice 🏁
            </Button>
          )}
        </div>

        <ProgressBar current={questionIndex} total={sessionLength} />
      </div>

      <QuestionCard
        question={currentQuestion}
        questionIndex={questionIndex}
        sessionLength={sessionLength}
        selectedAnswer={selectedAnswer}
        isFlipped={isFlipped}
        hasRecordedResult={hasRecordedResult}
        disableAnimation={!settings.cardAnimationEnabled}
        onSelectAnswer={handleSelectAnswer}
        onFlipCard={handleFlipCard}
        onReportResult={handleReportResult}
      />

      <ConfirmDialog
        isOpen={showExitDialog}
        title="Exit Practice Session?"
        message="Your progress so far has been saved to your statistics. Are you sure you want to exit to setup?"
        confirmLabel="Exit Session"
        cancelLabel="Continue Practice"
        variant="primary"
        onConfirm={handleExitConfirmed}
        onCancel={() => setShowExitDialog(false)}
      />
    </PageContainer>
  );
};

export default PracticePage;
