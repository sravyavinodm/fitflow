import React, { useState } from 'react';
import './DurationPicker.css';

interface DurationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (duration: number) => void;
  initialDuration?: number;
}

const DurationPicker: React.FC<DurationPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialDuration = 30
}) => {
  const [hours, setHours] = useState(Math.floor(initialDuration / 60));
  const [minutes, setMinutes] = useState(initialDuration % 60);

  const handleConfirm = () => {
    const totalMinutes = hours * 60 + minutes;
    onSelect(totalMinutes);
    onClose();
  };

  const handleCancel = () => {
    setHours(Math.floor(initialDuration / 60));
    setMinutes(initialDuration % 60);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="duration-picker-overlay">
      <div className="duration-picker-modal">
        <div className="duration-picker-header">
          <h3>Select Duration</h3>
          <button className="close-button" onClick={handleCancel}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="duration-picker-content">
          <div className="duration-inputs">
            <div className="duration-input-group">
              <label>Hours</label>
              <div className="duration-input">
                <button
                  className="duration-btn"
                  onClick={() => setHours(Math.max(0, hours - 1))}
                >
                  -
                </button>
                <span className="duration-value">{hours}</span>
                <button
                  className="duration-btn"
                  onClick={() => setHours(Math.min(23, hours + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="duration-separator">:</div>

            <div className="duration-input-group">
              <label>Minutes</label>
              <div className="duration-input">
                <button
                  className="duration-btn"
                  onClick={() => setMinutes(Math.max(0, minutes - 15))}
                >
                  -
                </button>
                <span className="duration-value">{minutes.toString().padStart(2, '0')}</span>
                <button
                  className="duration-btn"
                  onClick={() => setMinutes(Math.min(59, minutes + 15))}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="duration-preview">
            Total: {hours}h {minutes}m ({hours * 60 + minutes} minutes)
          </div>
        </div>

        <div className="duration-picker-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DurationPicker;
