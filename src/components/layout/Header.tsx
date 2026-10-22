import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';
import './Layout.css';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/" className="header-brand" aria-label="Math Practice Home">
          <span className="brand-icon" aria-hidden="true">
            ⭐
          </span>
          <span className="brand-text">Math Practice</span>
        </Link>
        <Navigation />
      </div>
    </header>
  );
};

export default Header;
