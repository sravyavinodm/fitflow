import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import { DatabaseService } from '../../../services/database';
import { formatDate } from '../../../utils/helpers';
import './AddActivity.css';

const AddActivity: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [formData, setFormData] = useState({
    name: '',
    duration: 30,
    time: '',
    notes: '',
  });

  useEffect(() => {
    // Get selected date from navigation state if available
    if (location.state?.selectedDate) {
      setSelectedDate(new Date(location.state.selectedDate));
    }
  }, [location.state]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    if (!formData.name.trim()) {
      setError('Please enter an activity name');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const activityData = {
        name: formData.name.trim(),
        duration: formData.duration,
        time: formData.time.trim(),
        entryDate: selectedDate,
        notes: formData.notes.trim(),
      };

      await DatabaseService.createActivity(currentUser.uid, activityData);

      setSuccess('Activity added successfully!');
      setTimeout(() => {
        navigate('/activities', {
          state: { 
            selectedDate: formatDate(selectedDate),
            refresh: true // Add refresh flag to force reload
          },
        });
      }, 1500);
    } catch (error: any) {
      setError('Failed to add activity');
      console.error('Error adding activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  return (
    <div className="add-activity-page">
      <Header />

      <main className="add-activity-main">
        <div className="add-activity-content">
          <div className="page-header">
            <button
              className="back-button"
              onClick={() =>
                navigate('/activities', {
                  state: { selectedDate: formatDate(selectedDate) },
                })
              }
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <div className="header-info">
              <h1 className="page-title">Add Activity</h1>
              <div className="selected-date">{formatDate(selectedDate)}</div>
            </div>
          </div>

          <div className="add-activity-card">
            <form onSubmit={handleSubmit} className="activity-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Activity Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Morning Run, Gym Workout"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="duration" className="form-label">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    max="480"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time" className="form-label">
                    Time (optional)
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any notes about your activity..."
                  className="form-textarea"
                  rows={4}
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    navigate('/activities', {
                      state: { selectedDate: formatDate(selectedDate) },
                    })
                  }
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddActivity;
