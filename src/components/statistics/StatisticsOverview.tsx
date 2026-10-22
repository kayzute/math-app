import React from 'react';
import type { AppStatistics } from '../../types';
import './Statistics.css';

export interface StatisticsOverviewProps {
  statistics: AppStatistics;
}

export const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({
  statistics,
}) => {
  const { attempted, correct, incorrect } = statistics;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  return (
    <div className="stats-overview-grid" aria-label="Overall practice overview">
      <div className="stat-card stat-card--attempted">
        <span className="stat-label">Total Attempted</span>
        <span className="stat-value">{attempted}</span>
        <span className="stat-sub">Questions answered</span>
      </div>

      <div className="stat-card stat-card--correct">
        <span className="stat-label">Correct</span>
        <span className="stat-value">{correct}</span>
        <span className="stat-sub">Great job! 🎉</span>
      </div>

      <div className="stat-card stat-card--incorrect">
        <span className="stat-label">Needs Practice</span>
        <span className="stat-value">{incorrect}</span>
        <span className="stat-sub">Learning opportunities</span>
      </div>

      <div className="stat-card stat-card--accuracy">
        <span className="stat-label">Overall Accuracy</span>
        <span className="stat-value">{accuracy}%</span>
        <span className="stat-sub">
          {attempted === 0
            ? 'No practice yet'
            : accuracy >= 80
              ? 'Excellent accuracy! ⭐'
              : 'Keep practicing! 💪'}
        </span>
      </div>
    </div>
  );
};

export default StatisticsOverview;
