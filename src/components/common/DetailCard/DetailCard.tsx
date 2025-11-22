import React from 'react';
import './DetailCard.css';

interface DetailCardProps {
  icon: string;
  title: string;
  stats?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({
  icon,
  title,
  stats,
  children,
  actions,
  className = '',
}) => {
  return (
    <div className={`detail-card ${className}`}>
      <div className="detail-header">
        <div className="detail-icon">
          <span className="icon-emoji">{icon}</span>
        </div>
        <div className="detail-basic-info">
          <h2 className="detail-title">{title}</h2>
          {stats && <div className="detail-stats">{stats}</div>}
        </div>
      </div>

      {children && <div className="detail-content">{children}</div>}

      {actions && <div className="detail-actions">{actions}</div>}
    </div>
  );
};

export default DetailCard;

