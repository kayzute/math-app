import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout';
import { Button } from '../components/common';
import {
  OperationSelector,
  DifficultySelector,
  SessionLengthSelector,
} from '../components/practice';
import { storageService, mistakeService } from '../services';
import type {
  MathOperation,
  DifficultyLevel,
  SessionLength,
  PracticeMode,
} from '../types';

export const PracticeSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const settings = storageService.getSettings();
  const activeMistakes = mistakeService.getActiveMistakes();

  const [mode, setMode] = useState<PracticeMode>('regular');
  const [operations, setOperations] = useState<MathOperation[]>(
    settings.defaultOperations && settings.defaultOperations.length > 0
      ? settings.defaultOperations
      : ['addition', 'subtraction'],
  );
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(
    settings.defaultDifficulty || 1,
  );
  const [sessionLength, setSessionLength] = useState<SessionLength>(
    settings.defaultSessionLength || 10,
  );

  const isValid = operations.length > 0;

  const handleStartSession = () => {
    if (!isValid) return;

    navigate('/practice/session', {
      state: {
        mode,
        operations,
        difficulty,
        sessionLength,
      },
    });
  };

  return (
    <PageContainer title="Configure Your Practice">
      <div className="setup-container">
        {/* Practice Mode Choice */}
        <fieldset className="setup-section" aria-labelledby="mode-legend">
          <legend id="mode-legend" className="section-title">
            Practice Mode
          </legend>
          <div className="difficulty-grid" role="radiogroup">
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'regular'}
              className={`diff-card ${mode === 'regular' ? 'diff-card--selected' : ''}`}
              onClick={() => setMode('regular')}
            >
              <div className="diff-header">
                <span className="diff-name">Standard Practice</span>
              </div>
              <p className="diff-desc">
                Practice new arithmetic questions for your selected operations
                and level.
              </p>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={mode === 'mistake-review'}
              disabled={activeMistakes.length === 0}
              className={`diff-card ${
                mode === 'mistake-review' ? 'diff-card--selected' : ''
              } ${activeMistakes.length === 0 ? 'diff-card--disabled' : ''}`}
              onClick={() =>
                activeMistakes.length > 0 && setMode('mistake-review')
              }
            >
              <div className="diff-header">
                <span className="diff-name">Review Mistakes</span>
                <span className="diff-badge">
                  {activeMistakes.length} available
                </span>
              </div>
              <p className="diff-desc">
                {activeMistakes.length > 0
                  ? 'Target previously missed arithmetic questions to master them.'
                  : 'No active mistakes to review! Practice standard mode first.'}
              </p>
            </button>
          </div>
        </fieldset>

        <OperationSelector
          selectedOperations={operations}
          onChange={setOperations}
        />

        <DifficultySelector
          selectedDifficulty={difficulty}
          onChange={setDifficulty}
        />

        <SessionLengthSelector
          selectedLength={sessionLength}
          onChange={setSessionLength}
        />

        <div className="setup-actions">
          {!isValid && (
            <p className="validation-error" role="alert">
              ⚠️ Please select at least one operation to start.
            </p>
          )}

          <Button
            size="xl"
            variant="primary"
            fullWidth
            disabled={!isValid}
            onClick={handleStartSession}
          >
            Start Practice Session 🚀
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default PracticeSetupPage;
