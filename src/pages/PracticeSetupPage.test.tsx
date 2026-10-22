import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import PracticeSetupPage from './PracticeSetupPage';

describe('PracticeSetupPage', () => {
  it('renders operations, difficulty, and session length selectors', () => {
    render(
      <BrowserRouter>
        <PracticeSetupPage />
      </BrowserRouter>,
    );

    expect(screen.getByText(/1\. choose operations/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. select difficulty/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. session length/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /start practice session/i }),
    ).not.toBeDisabled();
  });

  it('allows deselecting operations and disables start button when none selected', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <PracticeSetupPage />
      </BrowserRouter>,
    );

    // Initially addition and subtraction are selected by default
    const addBtn = screen.getByRole('checkbox', { name: /addition/i });
    const subBtn = screen.getByRole('checkbox', { name: /subtraction/i });

    await user.click(addBtn);
    await user.click(subBtn);

    // Now 0 operations selected
    expect(
      screen.getByRole('button', { name: /start practice session/i }),
    ).toBeDisabled();
    expect(
      screen.getByText(/please select at least one operation/i),
    ).toBeInTheDocument();

    // Click select all
    const selectAllBtn = screen.getByRole('button', {
      name: /select all operations/i,
    });
    await user.click(selectAllBtn);

    expect(
      screen.getByRole('button', { name: /start practice session/i }),
    ).not.toBeDisabled();
  });
});
