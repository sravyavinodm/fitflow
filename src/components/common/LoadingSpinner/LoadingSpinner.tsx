import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  overlay = false,
}) => {
  const spinnerClass = `loading-spinner loading-spinner-${size}`;

  if (overlay) {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          <div className={spinnerClass}></div>
          {text && <div className="loading-text">{text}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className={spinnerClass}></div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
};

export default LoadingSpinner;
