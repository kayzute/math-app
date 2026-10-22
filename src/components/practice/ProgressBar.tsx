import React from 'react';
import type { SessionLength } from '../../types';
import './QuestionCard.css';

export interface ProgressBarProps {
  current: number;
  total: SessionLength;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  if (total === 'continuous') {
    return (
      <div
        className="progress-continuous"
        aria-label="Continuous practice mode"
      >
        <span>Questions Completed: {current}</span>
      </div>
    );
  }

  const percent = Math.min(100, Math.round((current / total) * 100));

  return (
    <div
      className="progress-wrapper"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Session progress: ${current} of ${total} questions completed`}
    >
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress-label">{percent}%</span>
    </div>
  );
};

export default ProgressBar;
