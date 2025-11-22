import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { DatabaseService } from '../../../services/database';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import { formatDate, getStartOfDay } from '../../../utils/helpers';
import './WaterTracker.css';

const WaterTracker: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [waterLiters, setWaterLiters] = useState(2);
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
    // Load existing water data for the selected date
    if (currentUser) {
      loadExistingData();
    }
  }, [currentUser, selectedDate]);

  const loadExistingData = async () => {
    if (!currentUser) return;

    try {
      const waterEntries = await DatabaseService.getWater(currentUser.uid, getStartOfDay(selectedDate));
      if (waterEntries.length > 0) {
        // Sum all entries for the selected date
        const totalLiters = waterEntries.reduce((sum, entry) => {
          const liters = entry.amount ? entry.amount / 1000 : (entry.liters || 0);
          return sum + liters;
        }, 0);
        setWaterLiters(totalLiters || 2);
      }
    } catch (error) {
      console.error('Error loading existing water data:', error);
    }
  };

  const handleSliderChange = (value: number) => {
    setWaterLiters(value);
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const waterData = {
        amount: waterLiters * 1000, // Convert liters to ml
        liters: waterLiters, // Keep for backward compatibility
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        entryDate: getStartOfDay(selectedDate),
        notes: '',
      };

      await DatabaseService.createWater(currentUser.uid, waterData);

      setSuccess('Water data saved successfully!');
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
    navigate('/water-benefits');
  };

  const getHydrationLevel = (liters: number) => {
    if (liters < 1.5) return { text: 'Poor', color: '#e74c3c' };
    if (liters < 2) return { text: 'Fair', color: '#f39c12' };
    if (liters <= 3) return { text: 'Good', color: '#27ae60' };
    if (liters <= 4) return { text: 'Very Good', color: '#2ecc71' };
    return { text: 'Excellent', color: '#27ae60' };
  };

  const hydrationLevel = getHydrationLevel(waterLiters);

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  return (
    <div className="water-tracker-page">
      <Header />

      <main className="water-tracker-main">
        <div className="water-tracker-content">
          <div className="page-header">
            <button
              className="back-button"
              onClick={() => navigate('/dashboard')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <h1 className="page-title">Water Tracker</h1>
          </div>

          <div className="water-tracker-card">
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

            <div className="water-section">
              <div className="water-display">
                <span className="water-liters">{waterLiters}</span>
                <span className="water-unit">liters</span>
              </div>

              <div className="hydration-level">
                <span className="level-label">Hydration Level:</span>
                <span
                  className="level-value"
                  style={{ color: hydrationLevel.color }}
                >
                  {hydrationLevel.text}
                </span>
              </div>
            </div>

            <div className="slider-section">
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="0.25"
                  value={waterLiters}
                  onChange={e => handleSliderChange(Number(e.target.value))}
                  className="water-slider"
                />
                <div className="slider-labels">
                  <span>0L</span>
                  <span>2L</span>
                  <span>4L</span>
                  <span>6L</span>
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

export default WaterTracker;
