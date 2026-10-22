import React from 'react';
import { PageContainer } from '../components/layout';

export const SettingsPage: React.FC = () => {
  return (
    <PageContainer title="Settings">
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
          Configure sound effects, card animations, default difficulty levels,
          and session lengths here.
        </p>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
