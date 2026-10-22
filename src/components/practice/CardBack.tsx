import React from 'react';
import type { Question } from '../../types';
import { Button } from '../common';
import './QuestionCard.css';

export interface CardBackProps {
  question: Question;
  selectedAnswer: number | null;
  onReportResult: (isCorrect: boolean) => void;
  isFlipped: boolean;
  hasRecordedResult: boolean;
}

export const CardBack: React.FC<CardBackProps> = ({
  question,
  selectedAnswer,
  onReportResult,
  isFlipped,
  hasRecordedResult,
}) => {
  // Solved equation revealing correct answer (e.g. 7 × 8 = 56)
  const solvedEquation = question.displayText.replace(
    '?',
    String(question.correctAnswer),
  );

  return (
    <div
      className="card-face card-face--back"
      aria-hidden={!isFlipped ? true : undefined}
    >
      <div className="card-header">
        <span className="card-counter">Answer Revealed</span>
        <span className="card-level-badge">Level {question.difficulty}</span>
      </div>

      <div className="card-solution-container">
        <div className="card-solution-equation">{solvedEquation}</div>
        <div className="card-user-answer">
          <span>Your answer: </span>
          <strong className="answer-tag">
            {selectedAnswer !== null ? selectedAnswer : 'None selected'}
          </strong>
        </div>
      </div>

      <div className="card-self-report-section">
        <p className="self-report-prompt">Did you get this question right?</p>
        <div className="self-report-buttons">
          <Button
            size="lg"
            variant="success"
            disabled={hasRecordedResult || !isFlipped}
            onClick={() => onReportResult(true)}
            className="report-btn report-btn--right"
          >
            ✓ I Got It Right
          </Button>
          <Button
            size="lg"
            variant="danger"
            disabled={hasRecordedResult || !isFlipped}
            onClick={() => onReportResult(false)}
            className="report-btn report-btn--wrong"
          >
            ✗ I Got It Wrong
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardBack;
