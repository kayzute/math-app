import React from 'react';
import type { AppStatistics, MathOperation } from '../../types';
import './Statistics.css';

interface OpMeta {
  id: MathOperation;
  title: string;
  icon: string;
}

const OP_LIST: OpMeta[] = [
  { id: 'addition', title: 'Addition', icon: '➕' },
  { id: 'subtraction', title: 'Subtraction', icon: '➖' },
  { id: 'multiplication', title: 'Multiplication', icon: '✖️' },
  { id: 'division', title: 'Division', icon: '➗' },
];

export interface OperationStatisticsProps {
  statistics: AppStatistics;
}

export const OperationStatistics: React.FC<OperationStatisticsProps> = ({
  statistics,
}) => {
  return (
    <div className="stats-breakdown-section">
      <h2 className="stats-section-title">Performance by Operation</h2>
      <div className="stats-cards-grid">
        {OP_LIST.map(({ id, title, icon }) => {
          const data = statistics.byOperation[id] || {
            attempted: 0,
            correct: 0,
            incorrect: 0,
          };
          const accuracy =
            data.attempted > 0
              ? Math.round((data.correct / data.attempted) * 100)
              : 0;

          return (
            <div key={id} className="breakdown-card">
              <div className="breakdown-header">
                <span className="breakdown-icon" aria-hidden="true">
                  {icon}
                </span>
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

export default OperationStatistics;
