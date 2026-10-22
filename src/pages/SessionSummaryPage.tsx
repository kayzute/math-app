import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout';
import { Button } from '../components/common';
import { mistakeService } from '../services';
import type { PracticeSession } from '../types';
import './SessionSummaryPage.css';

interface SummaryLocationState {
  session?: PracticeSession;
  mistakeReviewCount?: number;
}

export const SessionSummaryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as SummaryLocationState) || {};

  const session = state.session || {
    id: 'default',
    startedAt: new Date().toISOString(),
    operations: ['addition'],
    difficulty: 1,
    sessionLength: 10,
    attempted: 10,
    correct: 8,
    incorrect: 2,
  };

  const mistakeReviewCount = state.mistakeReviewCount || 0;
  const accuracy =
    session.attempted > 0
      ? Math.round((session.correct / session.attempted) * 100)
      : 0;

  const activeMistakes = mistakeService.getActiveMistakes();

  // Child-friendly feedback based on accuracy
  const getFeedback = (acc: number): string => {
    if (acc === 100) return '🌟 Perfect score! You are a Math Champion! 🏆';
    if (acc >= 80) return '⭐ Fantastic work! You have strong math skills!';
    if (acc >= 60)
      return '👍 Great effort! Practicing makes you faster and sharper!';
    return '💪 Good practice! Every mistake helps your brain grow!';
  };

  const feedback = getFeedback(accuracy);

  const handlePracticeAgain = () => {
    navigate('/practice/session', {
      state: {
        operations: session.operations,
        difficulty: session.difficulty,
        sessionLength: session.sessionLength,
      },
    });
  };

  const handlePracticeMistakes = () => {
    navigate('/practice/session', {
      state: {
        operations: session.operations,
        difficulty: session.difficulty,
        sessionLength: session.sessionLength,
        mode: 'mistake-review',
      },
    });
  };

  return (
    <PageContainer title="Practice Complete!">
      <div className="summary-container">
        <div className="summary-card">
          <div className="summary-badge" aria-hidden="true">
            {accuracy >= 80 ? '🌟 High Score' : '🎯 Great Effort'}
          </div>
          <h2 className="summary-feedback">{feedback}</h2>

          <div className="summary-score-hero">
            <div className="score-circle">
              <span className="score-percent">{accuracy}%</span>
              <span className="score-sub">Accuracy</span>
            </div>
          </div>

          <div className="summary-metrics-grid">
            <div className="metric-box">
              <span className="metric-num">{session.attempted}</span>
              <span className="metric-label">Questions</span>
            </div>
            <div className="metric-box metric-box--correct">
              <span className="metric-num">{session.correct}</span>
              <span className="metric-label">Correct</span>
            </div>
            <div className="metric-box metric-box--wrong">
              <span className="metric-num">{session.incorrect}</span>
              <span className="metric-label">Incorrect</span>
            </div>
            <div className="metric-box">
              <span className="metric-num">Lvl {session.difficulty}</span>
              <span className="metric-label">Difficulty</span>
            </div>
          </div>

          <div className="summary-details-row">
            <span>
              <strong>Operations:</strong>{' '}
              {session.operations.map((o) => o).join(', ')}
            </span>
            {mistakeReviewCount > 0 && (
              <span>
                <strong>Review Questions:</strong> {mistakeReviewCount}
              </span>
            )}
          </div>

          <div className="summary-actions-grid">
            <Button
              size="lg"
              variant="primary"
              fullWidth
              onClick={handlePracticeAgain}
            >
              🔄 Practice Again
            </Button>

            {activeMistakes.length > 0 && (
              <Button
                size="lg"
                variant="success"
                fullWidth
                onClick={handlePracticeMistakes}
              >
                🧠 Practice Mistakes ({activeMistakes.length})
              </Button>
            )}

            <div className="summary-nav-buttons">
              <Button
                size="md"
                variant="secondary"
                onClick={() => navigate('/practice/setup')}
              >
                ✏️ New Setup
              </Button>
              <Button
                size="md"
                variant="secondary"
                onClick={() => navigate('/statistics')}
              >
                📊 View Stats
              </Button>
              <Button size="md" variant="outline" onClick={() => navigate('/')}>
                🏠 Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SessionSummaryPage;
