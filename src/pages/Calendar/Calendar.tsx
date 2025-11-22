import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header/Header';
import BottomNavigation from '../../components/common/BottomNavigation/BottomNavigation';
import CalendarOptions from '../../components/calendar/CalendarOptions/CalendarOptions';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import { getStartOfDay } from '../../utils/helpers';
import './Calendar.css';

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(getStartOfDay(new Date()));

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(getStartOfDay(date));
  };

  const handleDatePickerClick = () => {
    const dateInput = document.getElementById('date-input') as HTMLInputElement;
    if (dateInput) {
      if (dateInput.showPicker) {
        dateInput.showPicker();
      } else {
        dateInput.click();
      }
    }
  };

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  return (
    <div className="calendar-page">
      <Header />

      <main className="calendar-main">
        <div className="calendar-content">
          {/* Header Section */}
          <div className="calendar-header">
            <button className="back-arrow" onClick={() => navigate(-1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>

            <div className="calendar-header-actions">
              <div 
                className="date-picker-wrapper"
                onClick={handleDatePickerClick}
              >
                <div className="date-display">
                  {selectedDate.toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <div className="calendar-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <input
                  id="date-input"
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => handleDateChange(new Date(e.target.value))}
                  className="hidden-date-input"
                />
              </div>
            </div>
          </div>



          <CalendarOptions
            selectedDate={selectedDate}
          />
        </div>
      </main>

      <BottomNavigation />


    </div>
  );
};

export default Calendar;
