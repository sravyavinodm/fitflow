import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import StatItem from '../../../components/common/StatItem/StatItem';
import ErrorContainer from '../../../components/common/ErrorContainer/ErrorContainer';
import NotesSection from '../../../components/common/NotesSection/NotesSection';
import DetailCard from '../../../components/common/DetailCard/DetailCard';
import { useEntityDetail } from '../../../hooks/useEntityDetail';
import { DatabaseService, Activity } from '../../../services/database';
import { getActivityIcon } from '../../../utils/iconHelpers';
import './ActivityDetail.css';

const ActivityDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    entity: activity,
    loading,
    error,
    deleting,
    setDeleting,
    setError,
    reload,
  } = useEntityDetail<Activity>({
    loadEntity: DatabaseService.getActivity,
    entityName: 'Activity',
  });


  const handleSaveNotes = async (notes: string) => {
    if (!currentUser || !id || !activity) return;

    await DatabaseService.updateActivity(currentUser.uid, id, {
      notes: notes,
    });

    // Reload to get updated entity
    await reload();
    setSuccess('Activity updated successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!currentUser || !id) return;

    setDeleting(true);
    setError(null);
    setShowDeleteModal(false);

    try {
      await DatabaseService.deleteActivity(currentUser.uid, id);

      navigate('/activities', {
        state: { selectedDate: location.state?.selectedDate },
      });
    } catch (error: any) {
      setError('Failed to delete activity');
      console.error('Error deleting activity:', error);
      setDeleting(false);
    }
  };


  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  if (loading) {
    return <LoadingSpinner overlay text="Loading activity..." />;
  }

  if (error && !activity) {
    return (
      <div className="activity-detail-page">
        <Header />
        <ErrorContainer message={error} onRetry={reload} />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="activity-detail-page">
        <Header />
        <div className="not-found">
          <h2>Activity not found</h2>
          <button onClick={() => navigate('/activities')}>
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-detail-page">
      <Header />

      <main className="activity-detail-main">
        <div className="activity-detail-content">
          <PageHeader
            title={activity.name}
            onBack={() =>
              navigate('/activities', {
                state: { selectedDate: location.state?.selectedDate },
              })
            }
          />

          <DetailCard
            icon={getActivityIcon(activity.name)}
            title={activity.name}
            stats={
              <>
                <StatItem label="Duration" value={`${activity.duration} min`} />
                {activity.time && (
                  <StatItem label="Time" value={activity.time} />
                )}
                {activity.caloriesBurned && activity.caloriesBurned > 0 && (
                  <StatItem label="Calories Burned" value={`${activity.caloriesBurned} cal`} />
                )}
              </>
            }
            actions={
              <button
                className="delete-button"
                onClick={handleDeleteClick}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Activity'}
              </button>
            }
            className="activity-detail-card"
          >
            <NotesSection
              notes={activity.notes || ''}
              editable={true}
              onSave={handleSaveNotes}
              placeholder="Add notes about your activity..."
            />
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </DetailCard>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Activity"
        message="Are you sure you want to delete this activity?"
        subtitle="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDeleting={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default ActivityDetail;
