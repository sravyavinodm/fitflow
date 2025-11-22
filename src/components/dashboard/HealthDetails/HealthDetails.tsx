import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { calculateBMI, getBMICategory } from '../../../utils/bmiCalculator';
import './HealthDetails.css';

const HealthDetails: React.FC = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    weight: userProfile?.weight || 0,
    height: userProfile?.height || 0,
  });

  const bmi = calculateBMI(formData.weight, formData.height);
  const bmiCategory = getBMICategory(bmi);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        weight: userProfile.weight || 0,
        height: userProfile.height || 0,
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSave = async () => {
    if (!userProfile) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserProfile({
        weight: formData.weight,
        height: formData.height,
      });
      setSuccess('Health details updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      weight: userProfile?.weight || 0,
      height: userProfile?.height || 0,
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="health-details">
      <div className="health-header">
        <h3 className="health-title">Health Details</h3>
        {!isEditing ? (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        ) : (
          <div className="edit-actions">
            <button
              className="save-button"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              className="cancel-button"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="health-content">
        <div className="health-inputs">
          <div className="input-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight || ''}
              onChange={handleInputChange}
              disabled={!isEditing || loading}
              min="0"
              step="0.1"
              placeholder="Enter weight"
            />
          </div>

          <div className="input-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height || ''}
              onChange={handleInputChange}
              disabled={!isEditing || loading}
              min="0"
              step="0.1"
              placeholder="Enter height"
            />
          </div>
        </div>

        <div className="bmi-section">
          <div className="bmi-display">
            <div className="bmi-label">BMI</div>
            <div className="bmi-value">{bmi || '--'}</div>
          </div>

          {bmi > 0 && (
            <div className="bmi-category" style={{ color: bmiCategory.color }}>
              {bmiCategory.category}
            </div>
          )}
        </div>
      </div>

      {bmi > 0 && (
        <div className="bmi-info">
          <div className="bmi-description">{bmiCategory.description}</div>
        </div>
      )}
    </div>
  );
};

export default HealthDetails;
