import React from 'react';
import Header from '../Header/Header';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import './PageLayout.css';

interface PageLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showBottomNav = true,
  className = '',
}) => {
  return (
    <div className={`page-layout ${className}`}>
      <Header />
      <main className="page-layout-main">{children}</main>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default PageLayout;

