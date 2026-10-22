import React from 'react';
import type { MistakeReviewStatistics, MistakePattern } from '../../types';
import './Statistics.css';

export interface MistakeStatisticsProps {
  mistakeStats: MistakeReviewStatistics;
  activeMistakes: MistakePattern[];
}

export const MistakeStatistics: React.FC<MistakeStatisticsProps> = ({
  mistakeStats,
  activeMistakes,
}) => {
  const {
    activePatternsCount,
    masteredPatternsCount,
    mostMissedOperation,
    mostMissedFacts,
    similarPracticedCount,
  } = mistakeStats;

  return (
    <div className="stats-breakdown-section">
      <h2 className="stats-section-title">Mistake Review & Mastery</h2>

      <div className="mistake-stats-summary">
        <div className="mistake-stat-pill">
          <span className="mistake-pill-num">{activePatternsCount}</span>
          <span className="mistake-pill-text">Active Needs Practice</span>
        </div>
        <div className="mistake-stat-pill mistake-stat-pill--mastered">
          <span className="mistake-pill-num">{masteredPatternsCount}</span>
          <span className="mistake-pill-text">Mastered Concepts 🏆</span>
        </div>
        <div className="mistake-stat-pill">
          <span className="mistake-pill-num">{similarPracticedCount}</span>
          <span className="mistake-pill-text">Review Questions Solved</span>
        </div>
      </div>

      <div className="mistake-insights-grid">
        <div className="insight-card">
          <h3>Most Missed Operation</h3>
          <p className="insight-highlight">
            {mostMissedOperation
              ? mostMissedOperation.toUpperCase()
              : 'None recorded yet! 🎉'}
          </p>
        </div>

        <div className="insight-card">
          <h3>Frequently Missed Facts</h3>
          {mostMissedFacts.length > 0 ? (
            <ul className="facts-list">
              {mostMissedFacts.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-sub">No recurring missed facts yet.</p>
          )}
        </div>
      </div>

      {activeMistakes.length > 0 && (
        <div className="active-patterns-table-wrapper">
          <h3 className="sub-table-title">Active Review Items</h3>
          <div className="active-patterns-list">
            {activeMistakes.slice(0, 10).map((m) => (
              <div key={m.id} className="pattern-row">
                <span className="pattern-math">
                  {m.firstOperand}{' '}
                  {m.operation === 'addition'
                    ? '+'
                    : m.operation === 'subtraction'
                      ? '−'
                      : m.operation === 'multiplication'
                        ? '×'
                        : '÷'}{' '}
                  {m.secondOperand} = {m.correctAnswer}
                </span>
                <span className="pattern-badge">Level {m.difficulty}</span>
                <span className="pattern-missed">
                  Missed {m.incorrectCount}×
                </span>
                <span className="pattern-mastery">
                  Review Progress: {m.similarCorrectCount}/3
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MistakeStatistics;
