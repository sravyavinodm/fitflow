import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { DatabaseService } from '../../../services/database';
import { formatDate } from '../../../utils/helpers';
import { getTimeInputValue, formatTimeForDisplay, getDateInputValue, getCurrentTime, parseDateFromNavigation } from '../../../utils/timeHelpers';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import DurationPicker from '../../../components/common/DurationPicker/DurationPicker';
import './LogActivity.css';

const LogActivity: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(getCurrentTime());
  
  
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    duration: 30,
    calories: 0,
    notes: '',
  });

  const activityName = location.state?.activityName || 'Activity';


  useEffect(() => {
    // Get selected date from navigation state if available
    if (location.state?.selectedDate) {
      const parsedDate = parseDateFromNavigation(location.state.selectedDate);
      setSelectedDate(parsedDate);
    }
  }, [location.state]);

  const handleDurationSelect = (duration: number) => {
    setFormData(prev => ({ ...prev, duration }));
  };

  const handleCaloriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string for clearing, or positive numbers
    if (value === '') {
      setFormData(prev => ({ ...prev, calories: 0 }));
      return;
    }
    // Only allow digits
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue !== '') {
      const numValue = parseInt(numericValue, 10);
      // Only set if greater than 0
      if (numValue > 0) {
        setFormData(prev => ({ ...prev, calories: numValue }));
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    setSelectedTime(timeValue);
  };
  
  const handleDateInputClick = () => {
    // Input click will automatically open the picker
    // But we can also try showPicker() for better browser support
    if (dateInputRef.current && 'showPicker' in dateInputRef.current) {
      try {
        (dateInputRef.current as any).showPicker();
      } catch (err) {
        // Fallback to default behavior
      }
    }
  };
  
  const handleTimeInputClick = () => {
    // Input click will automatically open the picker
    // But we can also try showPicker() for better browser support
    if (timeInputRef.current && 'showPicker' in timeInputRef.current) {
      try {
        (timeInputRef.current as any).showPicker();
      } catch (err) {
        // Fallback to default behavior
      }
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    if (formData.duration <= 0) {
      setError('Please enter a valid duration');
      return;
    }

    if (formData.calories <= 0) {
      setError('Please enter calories burned (must be greater than 0)');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const activityData = {
        name: activityName,
        duration: formData.duration,
        caloriesBurned: formData.calories,
        time: selectedTime,
        entryDate: selectedDate,
        notes: formData.notes.trim(),
      };

      await DatabaseService.createActivity(currentUser.uid, activityData);

      setSuccess('Activity logged successfully!');
      setTimeout(() => {
        navigate('/activities', {
          state: { 
            refresh: true,
            selectedDate: formatDate(selectedDate)
          },
        });
      }, 1500);
    } catch (error: any) {
      setError('Failed to log activity');
      console.error('Error logging activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  return (
    <div className="log-activity-page">
      <Header />

      <main className="log-activity-main">
        <div className="log-activity-content">
          {/* Header Section */}
          <div className="log-activity-header">
            <button
              className="back-arrow"
              onClick={() => navigate('/activities')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <h1 className="page-title">Log Activity</h1>
          </div>

          <div className="log-activity-card">
            <form onSubmit={handleSubmit} className="log-activity-form">
              {/* Duration Activity Box */}
              <div className="form-section">
                <label className="section-label">Duration</label>
                <button
                  type="button"
                  className="interactive-box duration-box"
                  onClick={() => setShowDurationPicker(true)}
                >
                  <div className="box-content">
                    <div className="box-icon">⏱️</div>
                    <div className="box-text">
                      <div className="box-value">{formData.duration} min</div>
                      <div className="box-subtitle">Tap to change</div>
                    </div>
                  </div>
                  <div className="box-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Calories Burned Input */}
              <div className="form-section">
                <label className="section-label">Calories Burned</label>
                <div className="calories-input-wrapper">
                  <div className="calories-input-icon">🔥</div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.calories || ''}
                    onChange={handleCaloriesChange}
                    placeholder="Enter calories"
                    className="calories-input"
                  />
                  <span className="calories-unit">cal</span>
                </div>
              </div>

              {/* Date Picker */}
              <div className="form-section">
                <label className="section-label">Date</label>
                <div className="picker-wrapper">
                  <button
                    type="button"
                    className="interactive-box date-box"
                  >
                    <div className="box-content">
                      <div className="box-icon">📅</div>
                      <div className="box-text">
                        <div className="box-value">{formatDate(selectedDate)}</div>
                        <div className="box-subtitle">Tap to change</div>
                      </div>
                    </div>
                    <div className="box-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="9,18 15,12 9,6" />
                      </svg>
                    </div>
                  </button>
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={getDateInputValue(selectedDate)}
                    onChange={handleDateChange}
                    onClick={handleDateInputClick}
                    className="hidden-input"
                  />
                </div>
              </div>

              {/* Time Picker */}
              <div className="form-section">
                <label className="section-label">Time</label>
                <div className="picker-wrapper">
                  <button
                    type="button"
                    className="interactive-box time-box"
                  >
                    <div className="box-content">
                      <div className="box-icon">🕐</div>
                      <div className="box-text">
                        <div className="box-value">{formatTimeForDisplay(selectedTime)}</div>
                        <div className="box-subtitle">Tap to change</div>
                      </div>
                    </div>
                    <div className="box-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="9,18 15,12 9,6" />
                      </svg>
                    </div>
                  </button>
                  <input
                    ref={timeInputRef}
                    type="time"
                    value={getTimeInputValue(selectedTime)}
                    onChange={handleTimeChange}
                    onClick={handleTimeInputClick}
                    className="hidden-input"
                  />
                </div>
              </div>

              {/* Notes Box */}
              <div className="form-section">
                <label className="section-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter notes about the activity..."
                  className="notes-textarea"
                  rows={4}
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate('/activities')}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Modals */}
      <DurationPicker
        isOpen={showDurationPicker}
        onClose={() => setShowDurationPicker(false)}
        onSelect={handleDurationSelect}
        initialDuration={formData.duration}
      />
    </div>
  );
};

export default LogActivity;
