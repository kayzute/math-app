import React from 'react';
import type { SessionLength } from '../../types';
import './PracticeSetup.css';

interface LengthOption {
  value: SessionLength;
  label: string;
  icon: string;
}

const LENGTHS: LengthOption[] = [
  { value: 5, label: '5 Questions', icon: '⚡' },
  { value: 10, label: '10 Questions', icon: '⭐' },
  { value: 20, label: '20 Questions', icon: '🏆' },
  { value: 'continuous', label: 'Continuous', icon: '♾️' },
];

export interface SessionLengthSelectorProps {
  selectedLength: SessionLength;
  onChange: (length: SessionLength) => void;
}

export const SessionLengthSelector: React.FC<SessionLengthSelectorProps> = ({
  selectedLength,
  onChange,
}) => {
  return (
    <fieldset className="setup-section" aria-labelledby="length-legend">
      <legend id="length-legend" className="section-title">
        3. Session Length
      </legend>

      <div
        className="length-grid"
        role="radiogroup"
        aria-label="Session length"
      >
        {LENGTHS.map((item) => {
          const isSelected = selectedLength === item.value;
          return (
            <button
              key={String(item.value)}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`length-card ${isSelected ? 'length-card--selected' : ''}`}
              onClick={() => onChange(item.value)}
            >
              <span className="length-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="length-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};

export default SessionLengthSelector;
