import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import StatisticsPage from './StatisticsPage';
import { statisticsService } from '../services';

describe('StatisticsPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders statistics sections and reset button', () => {
    render(
      <BrowserRouter>
        <StatisticsPage />
      </BrowserRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /practice statistics/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/total attempted/i)).toBeInTheDocument();
    expect(screen.getByText(/performance by operation/i)).toBeInTheDocument();
    expect(screen.getByText(/performance by difficulty/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /reset all statistics/i }),
    ).toBeInTheDocument();
  });

  it('opens confirmation modal when reset button clicked and resets statistics upon confirm', async () => {
    const user = userEvent.setup();

    // Populate a test attempt
    statisticsService.recordAttempt({
      id: 'att_1',
      questionId: 'q_1',
      operation: 'addition',
      firstOperand: 2,
      secondOperand: 2,
      correctAnswer: 4,
      selectedAnswer: 4,
      selfReportedCorrect: true,
      difficulty: 1,
      source: 'regular',
      attemptedAt: new Date().toISOString(),
      sessionId: 'sess_1',
    });

    render(
      <BrowserRouter>
        <StatisticsPage />
      </BrowserRouter>,
    );

    const resetBtn = screen.getByRole('button', {
      name: /reset all statistics/i,
    });
    await user.click(resetBtn);

    // Modal should be open
    expect(
      screen.getByText(/are you sure you want to erase all practice history/i),
    ).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', {
      name: /erase statistics/i,
    });
    await user.click(confirmBtn);

    expect(statisticsService.getStatistics().attempted).toBe(0);
  });
});
