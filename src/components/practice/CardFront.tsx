import React from 'react';
import type { Question, SessionLength } from '../../types';
import { AnswerChoice } from './AnswerChoice';
import { Button } from '../common';
import './QuestionCard.css';

export interface CardFrontProps {
  question: Question;
  questionIndex: number;
  sessionLength: SessionLength;
  selectedAnswer: number | null;
  onSelectAnswer: (choice: number) => void;
  onFlipCard: () => void;
  isFlipped: boolean;
}

export const CardFront: React.FC<CardFrontProps> = ({
  question,
  questionIndex,
  sessionLength,
  selectedAnswer,
  onSelectAnswer,
  onFlipCard,
  isFlipped,
}) => {
  const isAnswerSelected = selectedAnswer !== null;

  return (
    <div
      className="card-face card-face--front"
      aria-hidden={isFlipped ? true : undefined}
    >
      <div className="card-header">
        <span className="card-counter">
          {sessionLength === 'continuous'
            ? `Question ${questionIndex + 1}`
            : `Question ${questionIndex + 1} of ${sessionLength}`}
        </span>
        <span className="card-level-badge">Level {question.difficulty}</span>
      </div>

      <div className="card-problem-container">
        <div
          className="card-problem-text"
          aria-label={`Problem: ${question.displayText}`}
        >
          {question.displayText}
        </div>
      </div>

      <div
        className="card-choices-grid"
        role="group"
        aria-label="Multiple choice answers"
      >
        {question.choices.map((choice, idx) => (
          <AnswerChoice
            key={`${choice}_${idx}`}
            choice={choice}
            index={idx}
            isSelected={selectedAnswer === choice}
            disabled={isFlipped}
            onSelect={onSelectAnswer}
          />
        ))}
      </div>

      <div className="card-footer">
        <Button
          size="lg"
          variant="primary"
          fullWidth
          disabled={!isAnswerSelected || isFlipped}
          onClick={onFlipCard}
          className="flip-btn"
        >
          {isAnswerSelected ? 'Flip Card 🔄' : 'Select an Answer to Flip'}
        </Button>
      </div>
    </div>
  );
};

export default CardFront;
