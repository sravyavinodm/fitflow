import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ActivityPopup.css';

interface ActivityPopupProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string;
}

const ActivityPopup: React.FC<ActivityPopupProps> = ({
  isOpen,
  onClose,
  activityName
}) => {
  const navigate = useNavigate();

  const handleStartActivity = () => {
    navigate('/activity/stopwatch', {
      state: { activityName }
    });
  };

  const handleLogActivity = () => {
    navigate('/activity/log', {
      state: { activityName }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="activity-popup-overlay">
      <div className="activity-popup-modal">
        <div className="activity-popup-header">
          <h3>{activityName}</h3>
          <button className="close-button" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="activity-popup-content">
          <div className="activity-options">
            <button
              className="activity-option start-activity"
              onClick={handleStartActivity}
            >
              <div className="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
              <div className="option-content">
                <h4>Start Activity</h4>
                <p>Begin tracking with stopwatch</p>
              </div>
            </button>

            <button
              className="activity-option log-activity"
              onClick={handleLogActivity}
            >
              <div className="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
              </div>
              <div className="option-content">
                <h4>Log Activity</h4>
                <p>Manually enter activity details</p>
              </div>
            </button>
          </div>
        </div>

        <div className="activity-popup-footer">
          <button className="go-back-button" onClick={onClose}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityPopup;
