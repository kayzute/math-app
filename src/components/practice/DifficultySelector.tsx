import React from 'react';
import type { DifficultyLevel } from '../../types';
import './PracticeSetup.css';

interface DifficultyOption {
  level: DifficultyLevel;
  name: string;
  badge: string;
  description: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  {
    level: 1,
    name: 'Beginner',
    badge: '🌱 Level 1',
    description: 'Numbers 0–10, factors 0–5, simple whole divisions',
  },
  {
    level: 2,
    name: 'Easy',
    badge: '🌿 Level 2',
    description: 'Numbers 0–50, factors 0–10, divisors up to 10',
  },
  {
    level: 3,
    name: 'Intermediate',
    badge: '🌳 Level 3',
    description: 'Numbers 0–100 with carrying & borrowing, facts up to 12',
  },
  {
    level: 4,
    name: 'Advanced',
    badge: '🚀 Level 4',
    description: 'Numbers up to 1,000, multi-digit facts and larger divisors',
  },
];

export interface DifficultySelectorProps {
  selectedDifficulty: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onChange,
}) => {
  return (
    <fieldset className="setup-section" aria-labelledby="diff-legend">
      <legend id="diff-legend" className="section-title">
        2. Select Difficulty
      </legend>

      <div
        className="difficulty-grid"
        role="radiogroup"
        aria-label="Difficulty level"
      >
        {DIFFICULTIES.map((d) => {
          const isSelected = selectedDifficulty === d.level;
          return (
            <button
              key={d.level}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`diff-card ${isSelected ? 'diff-card--selected' : ''}`}
              onClick={() => onChange(d.level)}
            >
              <div className="diff-header">
                <span className="diff-badge">{d.badge}</span>
                <span className="diff-name">{d.name}</span>
              </div>
              <p className="diff-desc">{d.description}</p>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};

export default DifficultySelector;
