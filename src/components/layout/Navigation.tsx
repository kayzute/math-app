import React from 'react';
import { NavLink } from 'react-router-dom';
import './Layout.css';

export const Navigation: React.FC = () => {
  return (
    <nav className="app-nav" aria-label="Main Navigation">
      <ul className="nav-list">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link--active' : ''}`
            }
          >
            🏠 Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/practice/setup"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link--active' : ''}`
            }
          >
            ✏️ Practice
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/statistics"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link--active' : ''}`
            }
          >
            📊 Statistics
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link--active' : ''}`
            }
          >
            ⚙️ Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
