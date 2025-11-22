import React from 'react';
import './CreateOptions.css';

interface CreateOptionsProps {
  onOptionClick: (option: string) => void;
}

const CreateOptions: React.FC<CreateOptionsProps> = ({ onOptionClick }) => {
  const options = [
    {
      id: 'activity',
      label: 'Activity',
      icon: '🏃',
      description: 'Navigate to Daily Activities Page',
      color: '#4CAF50',
    },
    {
      id: 'diet',
      label: 'Diet',
      icon: '🥗',
      description: 'Navigate to Diet Page',
      color: '#FF9800',
    },
    {
      id: 'hobby',
      label: 'Hobby',
      icon: '🎨',
      description: 'Navigate to Daily Hobbies Page',
      color: '#9C27B0',
    },
    {
      id: 'mood',
      label: 'Mood',
      icon: '😊',
      description: 'Navigate to Daily Moods Page',
      color: '#FF5722',
    },
  ];

  return (
    <div className="create-options">
      <div className="options-header">
        <h3 className="options-title">Create New Entry</h3>
        <p className="options-subtitle">Tap any option to navigate to the respective page</p>
      </div>

      <div className="options-grid">
        {options.map(option => (
          <button
            key={option.id}
            className="option-card"
            onClick={() => onOptionClick(option.id)}
            style={{ '--option-color': option.color } as React.CSSProperties}
          >
            <div className="option-icon">
              <span className="icon-emoji">{option.icon}</span>
            </div>

            <div className="option-content">
              <h4 className="option-label">{option.label}</h4>
              <p className="option-description">{option.description}</p>
            </div>

            <div className="option-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <div className="options-footer">
        <p className="footer-text">
          Each option will take you to the corresponding page where you can create new entries.
        </p>
      </div>
    </div>
  );
};

export default CreateOptions;
