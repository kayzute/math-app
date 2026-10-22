import React, { useEffect, useCallback } from 'react';
import type { Question, SessionLength } from '../../types';
import { CardFront } from './CardFront';
import { CardBack } from './CardBack';
import './QuestionCard.css';

export interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  sessionLength: SessionLength;
  selectedAnswer: number | null;
  isFlipped: boolean;
  hasRecordedResult: boolean;
  disableAnimation?: boolean;
  onSelectAnswer: (answer: number) => void;
  onFlipCard: () => void;
  onReportResult: (isCorrect: boolean) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  sessionLength,
  selectedAnswer,
  isFlipped,
  hasRecordedResult,
  disableAnimation = false,
  onSelectAnswer,
  onFlipCard,
  onReportResult,
}) => {
  // Keyboard interaction: Keys '1', '2', '3', '4' select answer choice
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (!isFlipped) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (idx >= 0 && idx < question.choices.length) {
            onSelectAnswer(question.choices[idx]);
          }
        }
      }
    },
    [isFlipped, question.choices, onSelectAnswer],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="card-perspective"
      role="region"
      aria-label="Arithmetic Question Flashcard"
      aria-expanded={isFlipped}
    >
      <div
        className={`card-flipper ${isFlipped ? 'is-flipped' : ''} ${
          disableAnimation ? 'no-animation' : ''
        }`}
      >
        <CardFront
          question={question}
          questionIndex={questionIndex}
          sessionLength={sessionLength}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={onSelectAnswer}
          onFlipCard={onFlipCard}
          isFlipped={isFlipped}
        />
        <CardBack
          question={question}
          selectedAnswer={selectedAnswer}
          onReportResult={onReportResult}
          isFlipped={isFlipped}
          hasRecordedResult={hasRecordedResult}
        />
      </div>
    </div>
  );
};

export default QuestionCard;
