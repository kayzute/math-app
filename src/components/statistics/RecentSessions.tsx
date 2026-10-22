import React from 'react';
import type { PracticeSession } from '../../types';
import './Statistics.css';

export interface RecentSessionsProps {
  sessions: PracticeSession[];
}

export const RecentSessions: React.FC<RecentSessionsProps> = ({ sessions }) => {
  return (
    <div className="stats-breakdown-section">
      <h2 className="stats-section-title">Recent Practice Sessions</h2>

      {sessions.length === 0 ? (
        <div className="empty-state-box">
          <p>
            No practice sessions completed yet. Start practicing to see your
            session history!
          </p>
        </div>
      ) : (
        <div className="sessions-list">
          {sessions.slice(0, 10).map((s) => {
            const dateStr = new Date(s.startedAt).toLocaleDateString(
              undefined,
              {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              },
            );
            const accuracy =
              s.attempted > 0 ? Math.round((s.correct / s.attempted) * 100) : 0;

            return (
              <div key={s.id} className="session-item-card">
                <div className="session-meta">
                  <span className="session-date">{dateStr}</span>
                  <span className="session-difficulty">
                    Level {s.difficulty}
                  </span>
                </div>
                <div className="session-ops">
                  {s.operations.map((op) => (
                    <span key={op} className="op-tag">
                      {op}
                    </span>
                  ))}
                </div>
                <div className="session-metrics">
                  <span>
                    <strong>{s.correct}</strong> / {s.attempted} correct
                  </span>
                  <span className="session-acc-badge">
                    {accuracy}% Accuracy
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentSessions;
