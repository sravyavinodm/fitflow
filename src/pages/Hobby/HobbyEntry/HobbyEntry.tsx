import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { DatabaseService } from '../../../services/database';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import { formatDate } from '../../../utils/helpers';
import { getTimeInputValue, formatTimeForDisplay, getDateInputValue, getCurrentTime, parseDateFromNavigation } from '../../../utils/timeHelpers';
import './HobbyEntry.css';

const HobbyEntry: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const dateInputRef = useRef<HTMLInputElement>(null);
  const startTimeInputRef = useRef<HTMLInputElement>(null);
  const endTimeInputRef = useRef<HTMLInputElement>(null);
  
  
  const [formData, setFormData] = useState({
    hobbyName: '',
    startTime: getCurrentTime(),
    endTime: getCurrentTime(),
    frequency: 'Daily',
    category: 'Creative',
    notes: '',
  });

  const hobbyName = location.state?.hobbyName || 'Hobby';


  useEffect(() => {
    // Get selected date from navigation state if available
    if (location.state?.selectedDate) {
      const parsedDate = parseDateFromNavigation(location.state.selectedDate);
      setSelectedDate(parsedDate);
    }
  }, [location.state]);

  // Calculate duration automatically
  const calculateDuration = () => {
    const start = new Date(`2000-01-01T${formData.startTime}:00`);
    const end = new Date(`2000-01-01T${formData.endTime}:00`);
    
    if (end < start) {
      // Handle case where end time is next day
      end.setDate(end.getDate() + 1);
    }
    
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    return Math.max(0, diffMinutes);
  };

  const duration = calculateDuration();

  // Format duration in hours and minutes format
  const formatDuration = (minutes: number): string => {
    if (minutes === 0) return '0 minutes';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
    } else if (mins === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    setFormData(prev => ({ ...prev, startTime: timeValue }));
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    setFormData(prev => ({ ...prev, endTime: timeValue }));
  };
  
  const handleDateInputClick = () => {
    if (dateInputRef.current && 'showPicker' in dateInputRef.current) {
      try {
        (dateInputRef.current as any).showPicker();
      } catch (err) {
        // Fallback to default behavior
      }
    }
  };
  
  const handleStartTimeInputClick = () => {
    if (startTimeInputRef.current && 'showPicker' in startTimeInputRef.current) {
      try {
        (startTimeInputRef.current as any).showPicker();
      } catch (err) {
        // Fallback to default behavior
      }
    }
  };
  
  const handleEndTimeInputClick = () => {
    if (endTimeInputRef.current && 'showPicker' in endTimeInputRef.current) {
      try {
        (endTimeInputRef.current as any).showPicker();
      } catch (err) {
        // Fallback to default behavior
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    if (!formData.hobbyName.trim()) {
      setError('Please enter a hobby name');
      return;
    }

    if (duration <= 0) {
      setError('End time must be after start time');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const hobbyData = {
        name: formData.hobbyName.trim(),
        type: formData.hobbyName.trim(), // for backward compatibility
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration: duration,
        time: formData.startTime, // Required field
        frequency: formData.frequency,
        category: formData.category,
        entryDate: selectedDate,
        notes: formData.notes.trim(),
      };

      await DatabaseService.createHobby(currentUser.uid, hobbyData);

      setSuccess('Hobby entry saved successfully!');
      setTimeout(() => {
        navigate('/hobbies', {
          state: { 
            refresh: true,
            selectedDate: formatDate(selectedDate)
          },
        });
      }, 1500);
    } catch (error: any) {
      setError('Failed to save hobby entry');
      console.error('Error saving hobby entry:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  return (
    <div className="hobby-entry-page">
      <Header />

      <main className="hobby-entry-main">
        <div className="hobby-entry-content">
          {/* Header Section */}
          <div className="hobby-entry-header">
            <button
              className="back-arrow"
              onClick={() => navigate('/hobbies')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <h1 className="page-title">{hobbyName}</h1>
          </div>

          <div className="hobby-entry-card">
            <form onSubmit={handleSubmit} className="hobby-entry-form">
              {/* Hobby Name Box */}
              <div className="form-section">
                <label className="section-label">Hobby Name</label>
                <input
                  type="text"
                  name="hobbyName"
                  value={formData.hobbyName}
                  onChange={handleInputChange}
                  placeholder="Enter hobby name..."
                  className="hobby-name-input"
                  required
                />
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

              {/* Start Time Picker */}
              <div className="form-section">
                <label className="section-label">Start Time</label>
                <div className="picker-wrapper">
                  <button
                    type="button"
                    className="interactive-box start-time-box"
                  >
                    <div className="box-content">
                      <div className="box-icon">🕐</div>
                      <div className="box-text">
                        <div className="box-value">{formatTimeForDisplay(formData.startTime)}</div>
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
                    ref={startTimeInputRef}
                    type="time"
                    value={getTimeInputValue(formData.startTime)}
                    onChange={handleStartTimeChange}
                    onClick={handleStartTimeInputClick}
                    className="hidden-input"
                  />
                </div>
              </div>

              {/* End Time Picker */}
              <div className="form-section">
                <label className="section-label">End Time</label>
                <div className="picker-wrapper">
                  <button
                    type="button"
                    className="interactive-box end-time-box"
                  >
                    <div className="box-content">
                      <div className="box-icon">🕐</div>
                      <div className="box-text">
                        <div className="box-value">{formatTimeForDisplay(formData.endTime)}</div>
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
                    ref={endTimeInputRef}
                    type="time"
                    value={getTimeInputValue(formData.endTime)}
                    onChange={handleEndTimeChange}
                    onClick={handleEndTimeInputClick}
                    className="hidden-input"
                  />
                </div>
              </div>

              {/* Duration Box (Auto-calculated) */}
              <div className="form-section">
                <label className="section-label">Duration</label>
                <div className="duration-display">
                  <div className="duration-icon">⏱️</div>
                  <div className="duration-text">
                    <div className="duration-value">{formatDuration(duration)}</div>
                    <div className="duration-subtitle">Auto-calculated</div>
                  </div>
                </div>
              </div>

              {/* Frequency Box */}
              <div className="form-section">
                <label className="section-label">Frequency</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="frequency-select"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              {/* Category Box */}
              <div className="form-section">
                <label className="section-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="category-select"
                >
                  <option value="Creative">Creative</option>
                  <option value="Physical">Physical</option>
                  <option value="Technical">Technical</option>
                  <option value="Educational">Educational</option>
                  <option value="Social">Social</option>
                  <option value="Relaxation">Relaxation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Notes Box */}
              <div className="form-section">
                <label className="section-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any notes about your hobby..."
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
                  onClick={() => navigate('/hobbies')}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

    </div>
  );
};

export default HobbyEntry;
