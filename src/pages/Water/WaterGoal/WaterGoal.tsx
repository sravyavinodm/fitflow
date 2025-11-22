import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import GoalSlider from '../../../components/common/GoalSlider/GoalSlider';
import RecommendationBox from '../../../components/common/RecommendationBox/RecommendationBox';
import './WaterGoal.css';

const WaterGoal: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [waterGoal, setWaterGoal] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile?.waterGoal) {
      setWaterGoal(userProfile.waterGoal);
    }
  }, [userProfile]);

  const handleSliderChange = (value: number) => {
    setWaterGoal(value);
  };

  const handleSaveGoal = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserProfile({ waterGoal });
      setSuccess('Water goal updated successfully!');
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
    navigate('/water-tracker');
  };

  const getWaterRecommendation = (liters: number) => {
    if (liters < 1.5)
      return {
        text: 'Too little water. Aim for 2-4 liters daily.',
        color: '#e74c3c',
      };
    if (liters <= 3)
      return {
        text: 'Good amount! This is the recommended range.',
        color: '#27ae60',
      };
    if (liters <= 4)
      return { text: 'Excellent hydration level.', color: '#2ecc71' };
    return {
      text: 'Very high intake. Monitor for overhydration.',
      color: '#f39c12',
    };
  };

  const recommendation = getWaterRecommendation(waterGoal);

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  return (
    <div className="water-goal-page">
      <Header />

      <main className="water-goal-main">
        <div className="water-goal-content">
          <PageHeader
            title="Water Goals"
            onBack={() => navigate('/dashboard')}
          />

          <div className="water-goal-card">
            <div className="question-section">
              <h2 className="question">
                How many litres of water do you drink?
              </h2>
              <div className="water-display">
                <span className="water-liters">{waterGoal}</span>
                <span className="water-unit">liters</span>
              </div>
            </div>

            <div className="slider-section">
              <GoalSlider
                value={waterGoal}
                min={0}
                max={6}
                step={0.25}
                onChange={handleSliderChange}
                labels={['0L', '2L', '4L', '6L']}
                className="water-slider"
              />
            </div>

            <div className="recommendation-section">
              <RecommendationBox
                title="Recommendation"
                text={recommendation.text}
                subtitle="2-4 liters is the optimal range for most adults"
                color={recommendation.color}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
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
                LOG DAILY WATER
              </button>
              <button
                className="save-button secondary"
                onClick={handleSaveGoal}
                disabled={loading}
              >
                {loading ? 'Saving...' : userProfile?.waterGoal ? 'Update Goal' : 'Save Goal'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WaterGoal;
