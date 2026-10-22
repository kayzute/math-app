import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuestionCard } from './QuestionCard';
import type { Question } from '../../types';

describe('QuestionCard Component', () => {
  const sampleQuestion: Question = {
    id: 'test_q1',
    operation: 'multiplication',
    firstOperand: 7,
    secondOperand: 8,
    displayText: '7 × 8 = ?',
    correctAnswer: 56,
    choices: [48, 54, 56, 64],
    difficulty: 2,
    source: 'regular',
  };

  it('renders question text and four answer choices on front', () => {
    render(
      <QuestionCard
        question={sampleQuestion}
        questionIndex={0}
        sessionLength={10}
        selectedAnswer={null}
        isFlipped={false}
        hasRecordedResult={false}
        onSelectAnswer={() => {}}
        onFlipCard={() => {}}
        onReportResult={() => {}}
      />,
    );

    expect(screen.getByText('7 × 8 = ?')).toBeInTheDocument();
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
    expect(screen.getByText('48')).toBeInTheDocument();
    expect(screen.getByText('54')).toBeInTheDocument();
    expect(screen.getByText('56')).toBeInTheDocument();
    expect(screen.getByText('64')).toBeInTheDocument();
  });

  it('disables Flip Card button when no answer is selected', () => {
    render(
      <QuestionCard
        question={sampleQuestion}
        questionIndex={0}
        sessionLength={10}
        selectedAnswer={null}
        isFlipped={false}
        hasRecordedResult={false}
        onSelectAnswer={() => {}}
        onFlipCard={() => {}}
        onReportResult={() => {}}
      />,
    );

    const flipBtn = screen.getByRole('button', {
      name: /select an answer to flip/i,
    });
    expect(flipBtn).toBeDisabled();
  });

  it('enables Flip Card button when an answer is selected and calls onFlipCard when clicked', async () => {
    const user = userEvent.setup();
    const handleFlip = vi.fn();

    render(
      <QuestionCard
        question={sampleQuestion}
        questionIndex={0}
        sessionLength={10}
        selectedAnswer={56}
        isFlipped={false}
        hasRecordedResult={false}
        onSelectAnswer={() => {}}
        onFlipCard={handleFlip}
        onReportResult={() => {}}
      />,
    );

    const flipBtn = screen.getByRole('button', { name: /flip card/i });
    expect(flipBtn).not.toBeDisabled();

    await user.click(flipBtn);
    expect(handleFlip).toHaveBeenCalledTimes(1);
  });

  it('reveals correct answer and calls onReportResult when flipped to card back', async () => {
    const user = userEvent.setup();
    const handleReport = vi.fn();

    render(
      <QuestionCard
        question={sampleQuestion}
        questionIndex={0}
        sessionLength={10}
        selectedAnswer={56}
        isFlipped={true}
        hasRecordedResult={false}
        onSelectAnswer={() => {}}
        onFlipCard={() => {}}
        onReportResult={handleReport}
      />,
    );

    expect(screen.getByText('7 × 8 = 56')).toBeInTheDocument();
    expect(
      screen.getByText('56', { selector: '.answer-tag' }),
    ).toBeInTheDocument();

    const rightBtn = screen.getByRole('button', { name: /i got it right/i });
    const wrongBtn = screen.getByRole('button', { name: /i got it wrong/i });

    expect(rightBtn).toBeInTheDocument();
    expect(wrongBtn).toBeInTheDocument();

    await user.click(rightBtn);
    expect(handleReport).toHaveBeenCalledWith(true);
  });
});
