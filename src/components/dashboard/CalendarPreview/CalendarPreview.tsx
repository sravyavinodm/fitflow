import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../utils/helpers';
import './CalendarPreview.css';

const CalendarPreview: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date();
  const formattedDate = formatDate(today);

  const handleCalendarClick = () => {
    navigate('/calendar');
  };

  return (
    <div className="calendar-preview" onClick={handleCalendarClick}>
      <div className="calendar-preview-header">
        <h3 className="calendar-preview-title">Today</h3>
        <div className="calendar-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      </div>

      <div className="calendar-preview-content">
        <div className="current-date">{formattedDate}</div>
        <div className="calendar-preview-subtitle">
          Tap to view full calendar
        </div>
      </div>

      <div className="calendar-preview-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="9,18 15,12 9,6" />
        </svg>
      </div>
    </div>
  );
};

export default CalendarPreview;
