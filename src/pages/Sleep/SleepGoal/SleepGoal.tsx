import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import GoalSlider from '../../../components/common/GoalSlider/GoalSlider';
import RecommendationBox from '../../../components/common/RecommendationBox/RecommendationBox';
import './SleepGoal.css';

const SleepGoal: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [sleepGoal, setSleepGoal] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile?.sleepGoal) {
      setSleepGoal(userProfile.sleepGoal);
    }
  }, [userProfile]);

  const handleSliderChange = (value: number) => {
    setSleepGoal(value);
  };

  const handleSaveGoal = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserProfile({ sleepGoal });
      setSuccess('Sleep goal updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogDaily = () => {
    navigate('/sleep-tracker');
  };

  const getSleepRecommendation = (hours: number) => {
    if (hours < 6)
      return {
        text: 'Too little sleep. Adults need 7-9 hours.',
        color: '#e74c3c',
      };
    if (hours <= 8)
      return {
        text: 'Perfect! This is the recommended amount.',
        color: '#27ae60',
      };
    if (hours <= 10) return { text: 'Good amount of sleep.', color: '#f39c12' };
    return {
      text: 'Too much sleep. Consider reducing to 7-9 hours.',
      color: '#e74c3c',
    };
  };

  const recommendation = getSleepRecommendation(sleepGoal);

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  return (
    <div className="sleep-goal-page">
      <Header />

      <main className="sleep-goal-main">
        <div className="sleep-goal-content">
          <PageHeader
            title="Sleep Goals"
            onBack={() => navigate('/dashboard')}
          />

          <div className="sleep-goal-card">
            <div className="question-section">
              <h2 className="question">How many hours do you sleep?</h2>
              <div className="sleep-display">
                <span className="sleep-hours">{sleepGoal}</span>
                <span className="sleep-unit">hours</span>
              </div>
            </div>

            <div className="slider-section">
              <GoalSlider
                value={sleepGoal}
                min={0}
                max={12}
                step={0.5}
                onChange={handleSliderChange}
                labels={['0h', '6h', '12h']}
                className="sleep-slider"
              />
            </div>

            <div className="recommendation-section">
              <RecommendationBox
                title="Recommendation"
                text={recommendation.text}
                subtitle="7-8 hours is the optimal range for most adults"
                color={recommendation.color}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                }
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="action-buttons">
              <button
                className="log-button primary"
                onClick={handleLogDaily}
                disabled={loading}
              >
                LOG DAILY SLEEP
              </button>
              <button
                className="save-button secondary"
                onClick={handleSaveGoal}
                disabled={loading}
              >
                {loading ? 'Saving...' : userProfile?.sleepGoal ? 'Update Goal' : 'Save Goal'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SleepGoal;
