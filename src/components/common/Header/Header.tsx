import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';
import ProfileImage from '../ProfileImage/ProfileImage';
import './Header.css';

const Header: React.FC = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userSectionRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleUserMenuClose = () => {
    setShowUserMenu(false);
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
    setShowMobileMenu(false);
  };

  const handleMobileMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleMobileMenuClose = () => {
    setShowMobileMenu(false);
  };

  const handleNavLinkClick = () => {
    setShowMobileMenu(false);
  };

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userSectionRef.current && !userSectionRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        // Check if click is not on hamburger button
        const target = event.target as HTMLElement;
        if (!target.closest('.mobile-menu-toggle')) {
          setShowMobileMenu(false);
        }
      }
    };

    if (showUserMenu || showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showMobileMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileMenu]);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left" onClick={handleLogoClick}>
          <div className="header-logo">
            <span className="logo-letter">F</span>
          </div>
          <h1 className="header-title">FitFlow</h1>
        </div>

        <div className="header-right">
          {/* Desktop Navigation */}
          <nav className="header-nav desktop-nav">
            {currentUser && (
              <button 
                className={`header-nav-link dashboard-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                onClick={handleDashboardClick}
              >
                Dashboard
              </button>
            )}
            <Link 
              to="/" 
              className={`header-nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`header-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`header-nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
            >
              Contact
            </Link>
            <Link 
              to="/feedback" 
              className={`header-nav-link ${location.pathname === '/feedback' ? 'active' : ''}`}
            >
              Feedback
            </Link>
            {!currentUser && (
              <>
                <button 
                  className="header-button secondary"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
                <button 
                  className="header-button primary"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={handleMobileMenuToggle}
            aria-label="Toggle menu"
            aria-expanded={showMobileMenu}
          >
            <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
          </button>

          {/* User Avatar (Desktop) */}
          {currentUser && (
            <div className="user-section desktop-user-section" ref={userSectionRef}>
              <button
                className="user-avatar"
                onClick={handleUserMenuToggle}
                aria-label="User menu"
              >
                <ProfileImage
                  src={userProfile?.photoURL}
                  alt={userProfile?.displayName || 'User'}
                  displayName={userProfile?.displayName || 'User'}
                  size="medium"
                />
              </button>

              {showUserMenu && (
                <UserMenu
                  user={currentUser}
                  userProfile={userProfile}
                  onClose={handleUserMenuClose}
                />
              )}
            </div>
          )}

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="mobile-menu-overlay" onClick={handleMobileMenuClose}>
              <nav className="mobile-menu" ref={mobileMenuRef} onClick={(e) => e.stopPropagation()}>
                {currentUser && (
                  <div className="mobile-menu-user">
                    <ProfileImage
                      src={userProfile?.photoURL}
                      alt={userProfile?.displayName || 'User'}
                      displayName={userProfile?.displayName || 'User'}
                      size="medium"
                    />
                    <div className="mobile-menu-user-info">
                      <div className="mobile-menu-user-name">{userProfile?.displayName || 'User'}</div>
                      <div className="mobile-menu-user-email">{currentUser.email}</div>
                    </div>
                  </div>
                )}
                <div className="mobile-menu-items">
                  {currentUser && (
                    <button 
                      className={`mobile-menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
                      onClick={handleDashboardClick}
                    >
                      Dashboard
                    </button>
                  )}
                  <Link 
                    to="/" 
                    className={`mobile-menu-item ${location.pathname === '/' ? 'active' : ''}`}
                    onClick={handleNavLinkClick}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    className={`mobile-menu-item ${location.pathname === '/about' ? 'active' : ''}`}
                    onClick={handleNavLinkClick}
                  >
                    About
                  </Link>
                  <Link 
                    to="/contact" 
                    className={`mobile-menu-item ${location.pathname === '/contact' ? 'active' : ''}`}
                    onClick={handleNavLinkClick}
                  >
                    Contact
                  </Link>
                  <Link 
                    to="/feedback" 
                    className={`mobile-menu-item ${location.pathname === '/feedback' ? 'active' : ''}`}
                    onClick={handleNavLinkClick}
                  >
                    Feedback
                  </Link>
                  {!currentUser && (
                    <>
                      <button 
                        className="mobile-menu-button secondary"
                        onClick={() => {
                          navigate('/login');
                          handleNavLinkClick();
                        }}
                      >
                        Sign In
                      </button>
                      <button 
                        className="mobile-menu-button primary"
                        onClick={() => {
                          navigate('/register');
                          handleNavLinkClick();
                        }}
                      >
                        Get Started
                      </button>
                    </>
                  )}
                  {currentUser && (
                    <>
                      <div className="mobile-menu-divider"></div>
                      <Link 
                        to="/profile" 
                        className="mobile-menu-item"
                        onClick={handleNavLinkClick}
                      >
                        Profile
                      </Link>
                      <button 
                        className="mobile-menu-item logout"
                        onClick={async () => {
                          try {
                            await logout();
                            handleNavLinkClick();
                          } catch (error) {
                            console.error('Error logging out:', error);
                          }
                        }}
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
