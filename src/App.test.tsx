import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the application title and welcome text', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /math practice app/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/welcome to math practice!/i)).toBeInTheDocument();
  });
});
