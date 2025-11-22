import React, { useRef } from 'react';
import { getTimeInputValue, formatTimeForDisplay } from '../../../utils/timeHelpers';
import './TimePickerField.css';

interface TimePickerFieldProps {
  label: string;
  value: string;
  onChange: (time: string) => void;
  format?: '12h' | '24h';
  className?: string;
}

const TimePickerField: React.FC<TimePickerFieldProps> = ({
  label,
  value,
  onChange,
  format = '24h',
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClick = () => {
    inputRef.current?.showPicker?.();
  };

  const displayValue = format === '12h' ? formatTimeForDisplay(value) : value;
  const inputValue = getTimeInputValue(value);

  return (
    <div className={`time-picker-field ${className}`}>
      <label className="field-label">{label}</label>
      <div className="time-input-wrapper">
        <input
          ref={inputRef}
          type="time"
          value={inputValue}
          onChange={handleChange}
          className="time-input"
        />
        {format === '12h' && (
          <span className="time-display">{displayValue}</span>
        )}
        <button
          type="button"
          className="time-picker-button"
          onClick={handleClick}
          aria-label="Open time picker"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TimePickerField;

