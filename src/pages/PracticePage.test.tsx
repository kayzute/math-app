import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import PracticePage from './PracticePage';

describe('PracticePage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the exit button, progress bar, and interactive question card', () => {
    render(
      <BrowserRouter>
        <PracticePage />
      </BrowserRouter>,
    );

    expect(
      screen.getByRole('button', { name: /exit current practice session/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText(/question 1 of/i)).toBeInTheDocument();
  });

  it('allows answering, flipping, and reporting to advance question', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <PracticePage />
      </BrowserRouter>,
    );

    // Pick first answer choice (Choice 1)
    const choiceButtons = screen.getAllByRole('button', { name: /choice 1/i });
    expect(choiceButtons.length).toBeGreaterThan(0);
    await user.click(choiceButtons[0]);

    // Flip card button should now be enabled
    const flipBtn = screen.getByRole('button', { name: /flip card/i });
    expect(flipBtn).not.toBeDisabled();
    await user.click(flipBtn);

    // Self report button on back
    const rightBtn = screen.getByRole('button', { name: /i got it right/i });
    expect(rightBtn).toBeInTheDocument();
    await user.click(rightBtn);

    // Progress updates to question 2
    expect(await screen.findByText(/question 2 of/i)).toBeInTheDocument();
  });
});
