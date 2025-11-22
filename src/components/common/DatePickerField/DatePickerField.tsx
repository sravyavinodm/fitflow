import React, { useRef } from 'react';
import { getDateInputValue } from '../../../utils/timeHelpers';
import './DatePickerField.css';

interface DatePickerFieldProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  min?: string;
  max?: string;
  className?: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    onChange(newDate);
  };

  const handleClick = () => {
    inputRef.current?.showPicker?.();
  };

  return (
    <div className={`date-picker-field ${className}`}>
      <label className="field-label">{label}</label>
      <div className="date-input-wrapper">
        <input
          ref={inputRef}
          type="date"
          value={getDateInputValue(value)}
          onChange={handleChange}
          min={min}
          max={max}
          className="date-input"
        />
        <button
          type="button"
          className="date-picker-button"
          onClick={handleClick}
          aria-label="Open date picker"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DatePickerField;

