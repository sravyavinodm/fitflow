import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  message: string;
  icon?: string;
  action?: () => void;
  actionLabel?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon,
  action,
  actionLabel,
  className = '',
}) => {
  return (
    <div className={`empty-state ${className}`}>
      {icon && (
        <div className="empty-state-icon">
          <span className="icon-emoji">{icon}</span>
        </div>
      )}
      <p className="empty-state-message">{message}</p>
      {action && actionLabel && (
        <button className="empty-state-action" onClick={action}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

