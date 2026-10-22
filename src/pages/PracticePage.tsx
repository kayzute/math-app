import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout';
import { QuestionCard } from '../components/practice';
import { Button } from '../components/common';
import { generateQuestionForOperations } from '../services';
import type {
  MathOperation,
  DifficultyLevel,
  SessionLength,
  Question,
} from '../types';

interface PracticeLocationState {
  operations?: MathOperation[];
  difficulty?: DifficultyLevel;
  sessionLength?: SessionLength;
}

export const PracticePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as PracticeLocationState) || {};

  const operations: MathOperation[] =
    state.operations && state.operations.length > 0
      ? state.operations
      : ['addition'];
  const difficulty: DifficultyLevel = state.difficulty || 1;
  const sessionLength: SessionLength = state.sessionLength || 10;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() =>
    generateQuestionForOperations(operations, difficulty),
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasRecordedResult, setHasRecordedResult] = useState(false);

  const handleSelectAnswer = (choice: number) => {
    if (isFlipped) return;
    setSelectedAnswer(choice);
  };

  const handleFlipCard = () => {
    if (selectedAnswer === null) return;
    setIsFlipped(true);
  };

  const handleReportResult = (_isCorrect: boolean) => {
    if (hasRecordedResult) return;
    setHasRecordedResult(true);

    const nextIndex = questionIndex + 1;

    // Check if session length reached (for fixed sessions)
    if (sessionLength !== 'continuous' && nextIndex >= sessionLength) {
      setTimeout(() => {
        navigate('/practice/summary');
      }, 400);
      return;
    }

    // Short transition before showing next question
    setTimeout(() => {
      const nextQuestion = generateQuestionForOperations(
        operations,
        difficulty,
      );
      setCurrentQuestion(nextQuestion);
      setQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setIsFlipped(false);
      setHasRecordedResult(false);
    }, 350);
  };

  return (
    <PageContainer>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '580px',
          margin: '0 auto 1rem',
        }}
      >
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate('/practice/setup')}
          aria-label="Exit current practice session"
        >
          ← Exit Session
        </Button>
        {sessionLength === 'continuous' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/practice/summary')}
          >
            Finish Practice
          </Button>
        )}
      </div>

      <QuestionCard
        question={currentQuestion}
        questionIndex={questionIndex}
        sessionLength={sessionLength}
        selectedAnswer={selectedAnswer}
        isFlipped={isFlipped}
        hasRecordedResult={hasRecordedResult}
        onSelectAnswer={handleSelectAnswer}
        onFlipCard={handleFlipCard}
        onReportResult={handleReportResult}
      />
    </PageContainer>
  );
};

export default PracticePage;
