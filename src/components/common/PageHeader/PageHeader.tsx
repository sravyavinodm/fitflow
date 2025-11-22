import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backRoute?: string;
  showBackButton?: boolean;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onBack,
  backRoute,
  showBackButton = true,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backRoute) {
      navigate(backRoute);
    }
  };

  if (!showBackButton && !subtitle) {
    return (
      <div className={`page-header ${className}`}>
        <div className="header-info">
          <h1 className="page-title">{title}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={`page-header ${className}`}>
      {showBackButton && (
        <button className="back-button" onClick={handleBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
      )}
      <div className="header-info">
        <h1 className="page-title">{title}</h1>
        {subtitle && <div className="selected-date">{subtitle}</div>}
      </div>
    </div>
  );
};

export default PageHeader;

