import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout';
import { Button } from '../components/common';

export const SessionSummaryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer title="Session Summary">
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p
          style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '2rem' }}
        >
          Great practice session! Detailed session metrics will appear here.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/practice/setup')}
          >
            Practice Again
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('/')}>
            Home
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default SessionSummaryPage;
