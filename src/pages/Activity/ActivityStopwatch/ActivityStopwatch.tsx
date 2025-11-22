import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import { DatabaseService } from '../../../services/database';
import { formatDate } from '../../../utils/helpers';
import './ActivityStopwatch.css';

interface ActivityStopwatchProps {}

const ActivityStopwatch: React.FC<ActivityStopwatchProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveFormData, setSaveFormData] = useState({
    notes: '',
    selectedDate: new Date()
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  
  const activityName = location.state?.activityName || 'Activity';

  // Calorie calculation based on activity type and duration
  const calculateCalories = (durationInMinutes: number, activity: string) => {
    const baseCaloriesPerMinute: { [key: string]: number } = {
      'running': 10,
      'jogging': 8,
      'walking': 4,
      'cycling': 8,
      'swimming': 12,
      'gym': 6,
      'yoga': 3,
      'dancing': 6,
      'hiking': 7,
      'default': 5
    };

    const activityLower = activity.toLowerCase();
    let caloriesPerMinute = baseCaloriesPerMinute.default;

    for (const [key, value] of Object.entries(baseCaloriesPerMinute)) {
      if (activityLower.includes(key)) {
        caloriesPerMinute = value;
        break;
      }
    }

    return Math.round(durationInMinutes * caloriesPerMinute);
  };

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          setCaloriesBurned(calculateCalories(newTime / 60, activityName));
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, activityName]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      startTimeRef.current = Date.now() - time * 1000;
    } else {
      setIsRunning(false);
      setIsPaused(false);
      setTime(0);
      setLaps([]);
      setCaloriesBurned(0);
    }
  };

  const handlePause = () => {
    if (isRunning) {
      setIsPaused(!isPaused);
    }
  };

  const handleLap = () => {
    if (isRunning && !isPaused) {
      setLaps(prevLaps => [...prevLaps, time]);
    }
  };

  const handleSave = () => {
    if (time === 0) {
      setSaveError('Cannot save activity with 0 duration');
      return;
    }
    setShowSaveModal(true);
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleSaveSubmit = async () => {
    if (!currentUser) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {

      const durationInMinutes = Math.round(time / 60);
      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      const activityData = {
        name: activityName,
        duration: durationInMinutes,
        time: currentTime,
        caloriesBurned: caloriesBurned,
        actualDuration: time, // Store actual seconds for reference
        entryDate: saveFormData.selectedDate,
        notes: saveFormData.notes.trim(),
      };

      await DatabaseService.createActivity(currentUser.uid, activityData);

      setSaveSuccess('Activity saved successfully!');
      setTimeout(() => {
        setShowSaveModal(false);
        navigate('/activities', {
          state: { 
            selectedDate: formatDate(saveFormData.selectedDate),
            refresh: true // Add refresh flag to force reload
          },
        });
      }, 1500);
    } catch (error: any) {
      setSaveError('Failed to save activity');
      console.error('Error saving activity:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCancel = () => {
    setShowSaveModal(false);
    setSaveError(null);
    setSaveSuccess(null);
  };

  const handleSaveFormChange = (field: string, value: any) => {
    setSaveFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getControlButtonIcon = () => {
    if (!isRunning) {
      // Play icon when stopped
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      );
    } else {
      // Stop icon when running (solid square)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
          <rect x="6" y="6" width="12" height="12" />
        </svg>
      );
    }
  };

  const getPauseIcon = () => {
    if (isPaused) {
      // Resume/Play icon when paused
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      );
    } else {
      // Pause icon when running (two vertical bars)
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      );
    }
  };

  const getSaveIcon = () => {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17,21 17,13 7,13 7,21" />
        <polyline points="7,3 7,8 15,8" />
      </svg>
    );
  };

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  return (
    <div className="activity-stopwatch-page">
      <Header />

      <main className="activity-stopwatch-main">
        <div className="activity-stopwatch-content">
          {/* Header Section */}
          <div className="stopwatch-header">
            <button className="back-arrow" onClick={() => navigate('/activities')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <h1 className="activity-title">{activityName}</h1>
          </div>

          {/* Stopwatch Display */}
          <div className="stopwatch-display">
            <div className="time-display">
              {formatTime(time)}
            </div>
            <div className="time-label">
              {isRunning ? (isPaused ? 'Paused' : 'Running') : 'Stopped'}
            </div>
          </div>

          {/* Calories Burned Box */}
          <div className="calories-box">
            <div className="calories-icon">🔥</div>
            <div className="calories-content">
              <div className="calories-value">{caloriesBurned}</div>
              <div className="calories-label">Calories Burned</div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="control-buttons">
            <button
              className={`control-btn start-stop-btn ${isRunning ? 'stop' : 'start'}`}
              onClick={handleStartStop}
            >
              {getControlButtonIcon()}
            </button>

            <button
              className={`control-btn pause-btn ${isPaused ? 'resume' : 'pause'}`}
              onClick={handlePause}
              disabled={!isRunning}
            >
              {getPauseIcon()}
            </button>

            <button
              className="control-btn lap-btn"
              onClick={handleLap}
              disabled={!isRunning || isPaused}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>

            <button
              className="control-btn save-btn"
              onClick={handleSave}
              disabled={time === 0}
            >
              {getSaveIcon()}
            </button>
          </div>

          {/* Laps Display */}
          {laps.length > 0 && (
            <div className="laps-section">
              <h3 className="laps-title">Laps</h3>
              <div className="laps-list">
                {laps.map((lapTime, index) => (
                  <div key={index} className="lap-item">
                    <span className="lap-number">Lap {index + 1}</span>
                    <span className="lap-time">{formatTime(lapTime)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="save-modal-overlay">
          <div className="save-modal">
            <div className="save-modal-header">
              <h3>Save Activity</h3>
              <button className="close-btn" onClick={handleSaveCancel}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="save-modal-content">
              <div className="activity-summary">
                <div className="summary-item">
                  <span className="summary-label">Activity:</span>
                  <span className="summary-value">{activityName}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Duration:</span>
                  <span className="summary-value">{formatTime(time)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Calories:</span>
                  <span className="summary-value">{caloriesBurned} cal</span>
                </div>
              </div>

              <div className="save-form">
                <div className="form-group">
                  <label htmlFor="save-date">Date:</label>
                  <input
                    type="date"
                    id="save-date"
                    value={saveFormData.selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => handleSaveFormChange('selectedDate', new Date(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="save-notes">Notes (optional):</label>
                  <textarea
                    id="save-notes"
                    placeholder="Add any notes about your activity..."
                    value={saveFormData.notes}
                    onChange={(e) => handleSaveFormChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {saveError && (
                <div className="save-error">
                  {saveError}
                </div>
              )}

              {saveSuccess && (
                <div className="save-success">
                  {saveSuccess}
                </div>
              )}
            </div>

            <div className="save-modal-actions">
              <button
                className="cancel-btn"
                onClick={handleSaveCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="save-submit-btn"
                onClick={handleSaveSubmit}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Activity'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityStopwatch;
