import React from 'react';
import './RecommendationBox.css';

interface RecommendationBoxProps {
  title: string;
  text: string;
  subtitle?: string;
  color: string;
  icon?: React.ReactNode;
  className?: string;
}

const RecommendationBox: React.FC<RecommendationBoxProps> = ({
  title,
  text,
  subtitle,
  color,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`recommendation-box ${className}`}
      style={{ borderColor: color }}
    >
      {icon && <div className="recommendation-icon">{icon}</div>}
      <div className="recommendation-content">
        <h3 className="recommendation-title">{title}</h3>
        <p className="recommendation-text" style={{ color }}>
          {text}
        </p>
        {subtitle && (
          <p className="recommendation-subtitle">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default RecommendationBox;

