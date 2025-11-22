import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import { DatabaseService } from '../../../services/database';
import { formatDate } from '../../../utils/helpers';
import { getTimeInputValue, formatTimeForDisplay, getDateInputValue, getCurrentTime, parseDateFromNavigation } from '../../../utils/timeHelpers';
import './DietEntry.css';

const DietEntry: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(getCurrentTime());
  
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  
  
  const [formData, setFormData] = useState({
    foodName: '',
    calories: 0,
  });

  const mealType = location.state?.mealType || 'Meal';


  useEffect(() => {
    // Get selected date from navigation state if available
    if (location.state?.selectedDate) {
      const parsedDate = parseDateFromNavigation(location.state.selectedDate);
      setSelectedDate(parsedDate);
    }
  }, [location.state]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    if (!formData.foodName.trim()) {
      setError('Please enter a food name');
      return;
    }

    if (formData.calories <= 0) {
      setError('Please enter a valid calorie amount');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const dietData = {
        mealType: mealType,
        foodItems: formData.foodName.trim(),
        calories: formData.calories,
        time: selectedTime,
        entryDate: selectedDate,
        notes: '',
      };

      await DatabaseService.createDiet(currentUser.uid, dietData);

      setSuccess('Diet entry saved successfully!');
      setTimeout(() => {
        navigate('/diets', {
          state: { 
            selectedDate: formatDate(selectedDate),
            refresh: true // Add refresh flag to force reload
          },
        });
      }, 1500);
    } catch (error: any) {
      setError('Failed to save diet entry');
      console.error('Error saving diet entry:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  return (
    <div className="diet-entry-page">
      <Header />

      <main className="diet-entry-main">
        <div className="diet-entry-content">
          {/* Header Section */}
          <div className="diet-entry-header">
            <button
              className="back-arrow"
              onClick={() => navigate('/diets')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <h1 className="page-title">{mealType}</h1>
          </div>

          <div className="diet-entry-card">
            <form onSubmit={handleSubmit} className="diet-entry-form">
              {/* Food Name Box */}
              <div className="form-section">
                <label className="section-label">Food Name</label>
                <input
                  type="text"
                  name="foodName"
                  value={formData.foodName}
                  onChange={handleInputChange}
                  placeholder="Enter food name..."
                  className="food-name-input"
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

              {/* Calories Input */}
              <div className="form-section">
                <label className="section-label">Calories</label>
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

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate('/diets')}
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

export default DietEntry;
