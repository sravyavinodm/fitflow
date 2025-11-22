import React from 'react';
import './ItemCard.css';

interface ItemCardProps {
  icon: string;
  title: string;
  details?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  showArrow?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({
  icon,
  title,
  details,
  onClick,
  className = '',
  showArrow = true,
}) => {
  return (
    <div
      className={`item-card ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="item-icon">
        <span className="icon-emoji">{icon}</span>
      </div>

      <div className="item-info">
        <h3 className="item-title">{title}</h3>
        {details && <div className="item-details">{details}</div>}
      </div>

      {showArrow && onClick && (
        <div className="item-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ItemCard;

