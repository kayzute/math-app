import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SessionSummaryPage from './SessionSummaryPage';

describe('SessionSummaryPage', () => {
  it('renders completion feedback, score circle, and action buttons', () => {
    render(
      <BrowserRouter>
        <SessionSummaryPage />
      </BrowserRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /practice complete!/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/accuracy/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /practice again/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /new setup/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /view stats/i }),
    ).toBeInTheDocument();
  });
});
