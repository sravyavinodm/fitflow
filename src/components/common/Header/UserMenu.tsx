import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { User } from 'firebase/auth';
import { UserProfile } from '../../../services/auth';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Header.css';

interface UserMenuProps {
  user: User;
  userProfile: UserProfile | null;
  onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, userProfile, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
    onClose();
  };


  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="user-menu">
      <div className="user-menu-header">
        <div className="user-info">
          <div className="user-name">{userProfile?.displayName || 'User'}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </div>

      <div className="user-menu-items">
        <button className="user-menu-item" onClick={handleProfileClick}>
          <svg
            className="menu-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Profile
        </button>


        <div className="user-menu-theme-section">
          <div className="user-menu-theme-label">Theme</div>
          <ThemeToggle 
            size="small" 
            showLabel={false}
            className="user-menu-theme-toggle"
          />
        </div>

        <div className="user-menu-divider"></div>

        <button className="user-menu-item logout" onClick={handleLogout}>
          <svg
            className="menu-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
