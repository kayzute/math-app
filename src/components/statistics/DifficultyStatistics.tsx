import React from 'react';
import type { AppStatistics, DifficultyLevel } from '../../types';
import './Statistics.css';

interface DiffMeta {
  level: DifficultyLevel;
  title: string;
  badge: string;
}

const DIFF_LIST: DiffMeta[] = [
  { level: 1, title: 'Beginner', badge: '🌱 Level 1' },
  { level: 2, title: 'Easy', badge: '🌿 Level 2' },
  { level: 3, title: 'Intermediate', badge: '🌳 Level 3' },
  { level: 4, title: 'Advanced', badge: '🚀 Level 4' },
];

export interface DifficultyStatisticsProps {
  statistics: AppStatistics;
}

export const DifficultyStatistics: React.FC<DifficultyStatisticsProps> = ({
  statistics,
}) => {
  return (
    <div className="stats-breakdown-section">
      <h2 className="stats-section-title">Performance by Difficulty</h2>
      <div className="stats-cards-grid">
        {DIFF_LIST.map(({ level, title, badge }) => {
          const data = statistics.byDifficulty[level] || {
            attempted: 0,
            correct: 0,
            incorrect: 0,
          };
          const accuracy =
            data.attempted > 0
              ? Math.round((data.correct / data.attempted) * 100)
              : 0;

          return (
            <div key={level} className="breakdown-card">
              <div className="breakdown-header">
                <span className="breakdown-badge">{badge}</span>
                <span className="breakdown-title">{title}</span>
              </div>
              <div className="breakdown-main">
                <div className="breakdown-acc">{accuracy}%</div>
                <div className="breakdown-bar">
                  <div
                    className="breakdown-bar-fill"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
              <div className="breakdown-details">
                <span>Attempted: {data.attempted}</span>
                <span>Correct: {data.correct}</span>
                <span>Incorrect: {data.incorrect}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultyStatistics;
