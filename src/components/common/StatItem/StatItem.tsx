import React from 'react';
import './StatItem.css';

interface StatItemProps {
  label: string;
  value: string | number;
  icon?: string;
  className?: string;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  icon,
  className = '',
}) => {
  return (
    <div className={`stat-item ${className}`}>
      {icon && <span className="stat-icon">{icon}</span>}
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
};

export default StatItem;

