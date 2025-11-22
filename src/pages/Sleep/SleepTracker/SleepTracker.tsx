import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { DatabaseService } from '../../../services/database';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import { formatDate, getStartOfDay } from '../../../utils/helpers';
import './SleepTracker.css';

const SleepTracker: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [sleepHours, setSleepHours] = useState(7);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Get selected date from navigation state if available
    if (location.state?.selectedDate) {
      setSelectedDate(new Date(location.state.selectedDate));
    }
  }, [location.state]);

  useEffect(() => {
    // Load existing sleep data for the selected date
    if (currentUser) {
      loadExistingData();
    }
  }, [currentUser, selectedDate]);

  const loadExistingData = async () => {
    if (!currentUser) return;

    try {
      const sleepEntries = await DatabaseService.getSleep(currentUser.uid, getStartOfDay(selectedDate));
      if (sleepEntries.length > 0) {
        // Sum all entries for the selected date
        const totalHours = sleepEntries.reduce((sum, entry) => {
          return sum + (entry.duration || entry.hours || 0);
        }, 0);
        setSleepHours(totalHours || 7);
      }
    } catch (error) {
      console.error('Error loading existing sleep data:', error);
    }
  };

  const handleSliderChange = (value: number) => {
    setSleepHours(value);
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const sleepData = {
        hours: sleepHours,
        duration: sleepHours,
        bedTime: '', // Could be enhanced later
        wakeTime: '', // Could be enhanced later
        quality: 3, // Default quality
        entryDate: getStartOfDay(selectedDate),
        notes: '',
      };

      await DatabaseService.createSleep(currentUser.uid, sleepData);

      setSuccess('Sleep data saved successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBenefits = () => {
    navigate('/sleep-benefits');
  };

  const getSleepQuality = (hours: number) => {
    if (hours < 6) return { text: 'Poor', color: '#e74c3c' };
    if (hours < 7) return { text: 'Fair', color: '#f39c12' };
    if (hours <= 8) return { text: 'Good', color: '#27ae60' };
    if (hours <= 9) return { text: 'Very Good', color: '#2ecc71' };
    return { text: 'Excellent', color: '#27ae60' };
  };

  const sleepQuality = getSleepQuality(sleepHours);

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  return (
    <div className="sleep-tracker-page">
      <Header />

      <main className="sleep-tracker-main">
        <div className="sleep-tracker-content">
          <div className="page-header">
            <button
              className="back-button"
              onClick={() => navigate('/dashboard')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <h1 className="page-title">Sleep Tracker</h1>
          </div>

          <div className="sleep-tracker-card">
            <div className="date-section">
              <div className="date-selector">
                <div className="calendar-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="selected-date">{formatDate(selectedDate)}</div>
              </div>
            </div>

            <div className="sleep-section">
              <div className="sleep-display">
                <span className="sleep-hours">{sleepHours}</span>
                <span className="sleep-unit">hours</span>
              </div>

              <div className="sleep-quality">
                <span className="quality-label">Sleep Quality:</span>
                <span
                  className="quality-value"
                  style={{ color: sleepQuality.color }}
                >
                  {sleepQuality.text}
                </span>
              </div>
            </div>

            <div className="slider-section">
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={sleepHours}
                  onChange={e => handleSliderChange(Number(e.target.value))}
                  className="sleep-slider"
                />
                <div className="slider-labels">
                  <span>0h</span>
                  <span>6h</span>
                  <span>12h</span>
                </div>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="action-buttons">
              <button
                className="benefits-button"
                onClick={handleBenefits}
                disabled={loading}
              >
                Benefits
              </button>
              <button
                className="ok-button"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SleepTracker;
