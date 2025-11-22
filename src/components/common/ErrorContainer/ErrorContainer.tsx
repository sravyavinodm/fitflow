import React from 'react';
import './ErrorContainer.css';

interface ErrorContainerProps {
  message: string;
  onRetry?: () => void;
  className?: string;
  retryLabel?: string;
}

const ErrorContainer: React.FC<ErrorContainerProps> = ({
  message,
  onRetry,
  className = '',
  retryLabel = 'Try Again',
}) => {
  return (
    <div className={`error-container ${className}`}>
      <div className="error-message">{message}</div>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorContainer;

