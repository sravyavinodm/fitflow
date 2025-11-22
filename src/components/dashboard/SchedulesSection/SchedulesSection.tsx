import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { DatabaseService } from '../../../services/database';
import { getStartOfDay } from '../../../utils/helpers';
import './SchedulesSection.css';

const SchedulesSection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const [todaySleep, setTodaySleep] = useState<number>(0);
  const [todayWater, setTodayWater] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadTodayData();
    }
  }, [currentUser]);

  // Refresh data when navigating back to dashboard (e.g., after logging water/sleep)
  useEffect(() => {
    if (currentUser && location.pathname === '/dashboard') {
      loadTodayData();
    }
  }, [location.pathname, currentUser]);

  const loadTodayData = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const today = getStartOfDay(new Date());
      
      // Load today's sleep entries
      const sleepEntries = await DatabaseService.getSleep(currentUser.uid, today);
      const totalSleepHours = sleepEntries.reduce((sum, entry) => {
        return sum + (entry.duration || entry.hours || 0);
      }, 0);
      setTodaySleep(totalSleepHours);

      // Load today's water entries
      const waterEntries = await DatabaseService.getWater(currentUser.uid, today);
      const totalWaterLiters = waterEntries.reduce((sum, entry) => {
        const liters = entry.amount ? entry.amount / 1000 : (entry.liters || 0);
        return sum + liters;
      }, 0);
      setTodayWater(totalWaterLiters);
    } catch (error) {
      console.error('Error loading today\'s data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSleepGoalClick = () => {
    navigate('/sleep-goal');
  };

  const handleWaterGoalClick = () => {
    navigate('/water-goal');
  };

  const handleSleepTrackerClick = () => {
    navigate('/sleep-tracker');
  };

  const handleWaterTrackerClick = () => {
    navigate('/water-tracker');
  };

  return (
    <div className="schedules-section">
      <h3 className="schedules-title">Daily Goals</h3>

      <div className="schedules-grid">
        {/* Sleep Schedule */}
        <div className="schedule-card sleep-card">
          <div className="schedule-header">
            <div className="schedule-icon sleep-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
            <div className="schedule-info">
              <h4 className="schedule-name">Sleep</h4>
              <div className="schedule-goal">
                Goal: {userProfile?.sleepGoal || 8} hours
              </div>
              {!loading && (
                <div className="schedule-progress">
                  {todaySleep > 0 
                    ? `${todaySleep.toFixed(1)}h / ${userProfile?.sleepGoal || 8}h`
                    : `0h / ${userProfile?.sleepGoal || 8}h`
                  }
                </div>
              )}
            </div>
          </div>

          <div className="schedule-actions">
            <button
              className="schedule-button primary"
              onClick={handleSleepGoalClick}
            >
              {userProfile?.sleepGoal ? 'Update Goal' : 'Set Goal'}
            </button>
            <button
              className="schedule-button secondary"
              onClick={handleSleepTrackerClick}
            >
              Log Sleep
            </button>
          </div>
        </div>

        {/* Water Schedule */}
        <div className="schedule-card water-card">
          <div className="schedule-header">
            <div className="schedule-icon water-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <div className="schedule-info">
              <h4 className="schedule-name">Water</h4>
              <div className="schedule-goal">
                Goal: {userProfile?.waterGoal || 2} liters
              </div>
              {!loading && (
                <div className="schedule-progress">
                  {todayWater > 0 
                    ? `${todayWater.toFixed(2)}L / ${userProfile?.waterGoal || 2}L`
                    : `0L / ${userProfile?.waterGoal || 2}L`
                  }
                </div>
              )}
            </div>
          </div>

          <div className="schedule-actions">
            <button
              className="schedule-button primary"
              onClick={handleWaterGoalClick}
            >
              {userProfile?.waterGoal ? 'Update Goal' : 'Set Goal'}
            </button>
            <button
              className="schedule-button secondary"
              onClick={handleWaterTrackerClick}
            >
              Log Water
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulesSection;
