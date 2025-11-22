import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  letter: string;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'D',
    path: '/dashboard',
    letter: 'D',
  },
  {
    id: 'ai-chat',
    label: 'AI Chat',
    icon: 'A',
    path: '/ai-chat',
    letter: 'A',
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: 'I',
    path: '/insights',
    letter: 'I',
  },
  {
    id: 'create',
    label: 'Create',
    icon: 'C',
    path: '/create',
    letter: 'C',
  },
];

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bottom-navigation">
      <div className="nav-items">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => handleNavClick(item.path)}
            aria-label={item.label}
          >
            <div className="nav-icon">
              <span className="nav-letter">{item.letter}</span>
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
