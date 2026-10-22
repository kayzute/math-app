import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout';
import { Button } from '../components/common';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer title="Page Not Found">
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p
          style={{
            fontSize: '1.25rem',
            color: '#64748b',
            marginBottom: '2rem',
          }}
        >
          Oops! The page you are looking for doesn't exist.
        </p>
        <Button size="lg" variant="primary" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    </PageContainer>
  );
};

export default NotFoundPage;
