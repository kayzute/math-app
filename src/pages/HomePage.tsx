import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout';
import { Button } from '../components/common';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="home-hero">
        <div className="home-badge" aria-hidden="true">
          🎯 Fun & Interactive Math Flashcards
        </div>
        <h1 className="home-title">Welcome to Math Practice!</h1>
        <p className="home-subtitle">
          Master addition, subtraction, multiplication, and division with
          interactive flashcards designed to build confidence and math skills.
        </p>

        <div className="home-actions">
          <Button
            size="xl"
            variant="primary"
            fullWidth
            onClick={() => navigate('/practice/setup')}
            className="home-btn-primary"
          >
            🚀 Start Practice
          </Button>

          <div className="home-actions-secondary">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/statistics')}
            >
              📊 View Statistics
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/settings')}
            >
              ⚙️ Settings
            </Button>
          </div>
        </div>

        <div className="home-features" aria-label="Key features">
          <div className="feature-card">
            <span className="feature-icon" aria-hidden="true">
              🎴
            </span>
            <h3>Interactive Cards</h3>
            <p>Pick your answer, flip the card, and check your work!</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon" aria-hidden="true">
              📈
            </span>
            <h3>4 Skill Levels</h3>
            <p>From Beginner to Advanced, grow at your own comfortable pace.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon" aria-hidden="true">
              🧠
            </span>
            <h3>Mistake Tracking</h3>
            <p>Learn from mistakes with personalized practice questions.</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
