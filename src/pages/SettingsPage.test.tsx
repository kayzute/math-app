import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SettingsPage from './SettingsPage';
import { storageService } from '../services';

describe('SettingsPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders preference toggles and clear data button', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /application settings/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/sound effects/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/card flip animation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/show explanations/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /clear all application data/i }),
    ).toBeInTheDocument();
  });

  it('updates sound toggle and persists setting', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>,
    );

    const soundToggle = screen.getByLabelText(/sound effects/i);
    expect(soundToggle).toBeChecked();

    await user.click(soundToggle);
    expect(soundToggle).not.toBeChecked();

    const stored = storageService.getSettings();
    expect(stored.soundEnabled).toBe(false);
  });

  it('opens confirmation modal when Clear All Application Data is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>,
    );

    const clearBtn = screen.getByRole('button', {
      name: /clear all application data/i,
    });
    await user.click(clearBtn);

    expect(
      screen.getByText(/this will completely erase all practice history/i),
    ).toBeInTheDocument();
  });
});
