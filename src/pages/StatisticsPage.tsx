import React from 'react';
import { PageContainer } from '../components/layout';

export const StatisticsPage: React.FC = () => {
  return (
    <PageContainer title="Practice Statistics">
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
        }}
      >
        <p style={{ fontSize: '1.2rem', color: '#475569' }}>
          Your practice history, accuracy by operation, and mastery progress
          will be displayed here as you complete practice sessions.
        </p>
      </div>
    </PageContainer>
  );
};

export default StatisticsPage;
