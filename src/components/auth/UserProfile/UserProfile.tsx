import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { storageService } from '../../../services/storage';
import DeleteAccountModal from '../../common/Modal/DeleteAccountModal';
import ProfileImage from '../../common/ProfileImage/ProfileImage';
import './UserProfile.css';

const UserProfile: React.FC = () => {
  const { currentUser, userProfile, updateUserProfile, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    weight: userProfile?.weight || 0,
    height: userProfile?.height || 0,
    sleepGoal: userProfile?.sleepGoal || 8,
    waterGoal: userProfile?.waterGoal || 2,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'displayName' ? value : Number(value),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await storageService.uploadProfileImage(
        currentUser.uid,
        file
      );
      await updateUserProfile({ photoURL: result.url });
      setSuccess('Profile image updated successfully!');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: userProfile?.displayName || '',
      weight: userProfile?.weight || 0,
      height: userProfile?.height || 0,
      sleepGoal: userProfile?.sleepGoal || 8,
      waterGoal: userProfile?.waterGoal || 2,
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteAccount();
      // Account deleted successfully, user will be automatically logged out
      // and redirected to login page by the auth state change
      setSuccess('Account deleted successfully. Redirecting to login...');
      
      // Small delay to show success message before redirect
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
    setError(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setIsDeleting(false);
  };

  if (!currentUser || !userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <button className="back-button" onClick={handleBackClick} aria-label="Go back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
        <h2>Profile Settings</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-content">
        <div className="profile-image-section">
          <ProfileImage
            src={userProfile.photoURL}
            alt="Profile"
            displayName={userProfile.displayName}
            size="large"
            className="profile-image"
          />
          <label htmlFor="image-upload" className="image-upload-button">
            Change Photo
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            disabled={loading}
          />
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              disabled={!isEditing || loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={currentUser.email || ''}
              disabled
            />
            <small>Email cannot be changed</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sleepGoal">Sleep Goal (hours)</label>
              <input
                type="number"
                id="sleepGoal"
                name="sleepGoal"
                value={formData.sleepGoal}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
                min="0"
                max="24"
                step="0.5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="waterGoal">Water Goal (liters)</label>
              <input
                type="number"
                id="waterGoal"
                name="waterGoal"
                value={formData.waterGoal}
                onChange={handleInputChange}
                disabled={!isEditing || loading}
                min="0"
                max="10"
                step="0.1"
              />
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <div className="profile-action-buttons">
                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-button"
                  disabled={loading}
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleShowDeleteModal}
                  className="delete-account-button"
                  disabled={loading || isDeleting}
                >
                  Delete Account
                </button>
              </div>
            ) : (
              <div className="edit-actions">
                <button
                  onClick={handleSave}
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="cancel-button"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteAccount}
        userEmail={currentUser.email || ''}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default UserProfile;
