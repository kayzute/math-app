import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout';
import { Button } from '../components/common';
import {
  OperationSelector,
  DifficultySelector,
  SessionLengthSelector,
} from '../components/practice';
import type { MathOperation, DifficultyLevel, SessionLength } from '../types';

export const PracticeSetupPage: React.FC = () => {
  const navigate = useNavigate();

  const [operations, setOperations] = useState<MathOperation[]>([
    'addition',
    'subtraction',
  ]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
  const [sessionLength, setSessionLength] = useState<SessionLength>(10);

  const isValid = operations.length > 0;

  const handleStartSession = () => {
    if (!isValid) return;

    navigate('/practice/session', {
      state: {
        operations,
        difficulty,
        sessionLength,
      },
    });
  };

  return (
    <PageContainer title="Configure Your Practice">
      <div className="setup-container">
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
