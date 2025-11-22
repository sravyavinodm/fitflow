import React from 'react';
import './GoalSlider.css';

interface GoalSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  labels?: string[];
  className?: string;
}

const GoalSlider: React.FC<GoalSliderProps> = ({
  value,
  min,
  max,
  step,
  onChange,
  labels,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={`goal-slider-container ${className}`}>
      <div className="slider-wrapper">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="goal-slider"
        />
        {labels && labels.length > 0 && (
          <div className="slider-labels">
            {labels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalSlider;

