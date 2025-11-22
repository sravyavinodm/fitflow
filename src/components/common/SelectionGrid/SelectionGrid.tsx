import React from 'react';
import './SelectionGrid.css';

export interface SelectionGridItem {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

interface SelectionGridProps {
  items: SelectionGridItem[];
  onItemClick: (item: SelectionGridItem) => void;
  columns?: number;
  className?: string;
  title?: string;
}

const SelectionGrid: React.FC<SelectionGridProps> = ({
  items,
  onItemClick,
  columns = 4,
  className = '',
  title,
}) => {
  return (
    <div className={`selection-grid-section ${className}`}>
      {title && <h3 className="section-title">{title}</h3>}
      <div 
        className="selection-grid"
        style={{ '--grid-columns': columns } as React.CSSProperties}
      >
        {items.map(item => (
          <button
            key={item.id}
            className="selection-grid-item"
            onClick={() => onItemClick(item)}
            style={item.color ? { '--item-color': item.color } as React.CSSProperties : undefined}
          >
            <div className="selection-grid-icon">
              <span className="icon-emoji">{item.icon}</span>
            </div>
            <span className="selection-grid-name">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectionGrid;

