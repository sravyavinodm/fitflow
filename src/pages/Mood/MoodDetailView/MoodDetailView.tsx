import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import StatItem from '../../../components/common/StatItem/StatItem';
import ErrorContainer from '../../../components/common/ErrorContainer/ErrorContainer';
import DetailCard from '../../../components/common/DetailCard/DetailCard';
import NotesSection from '../../../components/common/NotesSection/NotesSection';
import { useEntityDetail } from '../../../hooks/useEntityDetail';
import { DatabaseService, Mood } from '../../../services/database';
import { getMoodEmoji } from '../../../utils/iconHelpers';
import { formatTimeForDisplay } from '../../../utils/timeHelpers';
import './MoodDetailView.css';

const MoodDetailView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    entity: mood,
    loading,
    error,
    deleting,
    setDeleting,
    setError,
    reload,
  } = useEntityDetail<Mood>({
    loadEntity: DatabaseService.getMoodEntry,
    entityName: 'Mood',
  });

  const handleSaveNotes = async (notes: string) => {
    if (!currentUser || !id || !mood) return;

    await DatabaseService.updateMood(currentUser.uid, id, {
      notes: notes,
    });

    // Reload to get updated entity
    await reload();
    setSuccess('Mood entry updated successfully!');
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
      await DatabaseService.deleteMood(currentUser.uid, id);

      navigate('/mood', {
        state: { 
          selectedDate: location.state?.selectedDate,
          refresh: true
        },
      });
    } catch (error: any) {
      setError('Failed to delete mood');
      console.error('Error deleting mood:', error);
      setDeleting(false);
    }
  };


  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  if (loading) {
    return <LoadingSpinner overlay text="Loading mood..." />;
  }

  if (error && !mood) {
    return (
      <div className="mood-detail-view-page">
        <Header />
        <ErrorContainer message={error} onRetry={reload} />
      </div>
    );
  }

  if (!mood) {
    return (
      <div className="mood-detail-view-page">
        <Header />
        <div className="not-found">
          <h2>Mood not found</h2>
          <button onClick={() => navigate('/mood')}>Back to Mood Selection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mood-detail-view-page">
      <Header />

      <main className="mood-detail-view-main">
        <div className="mood-detail-view-content">
          <PageHeader
            title={mood.moodType}
            onBack={() =>
              navigate('/mood', {
                state: { selectedDate: location.state?.selectedDate },
              })
            }
          />

          <DetailCard
            icon={getMoodEmoji(mood.moodType)}
            title={mood.moodType}
            stats={
              <>
                {mood.time && (
                  <StatItem label="Time" value={formatTimeForDisplay(mood.time)} />
                )}
                {mood.moodLevel && (
                  <StatItem label="Mood Level" value={`${mood.moodLevel}/5`} />
                )}
              </>
            }
            actions={
              <button
                className="delete-button"
                onClick={handleDeleteClick}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Mood'}
              </button>
            }
            className="mood-detail-view-card"
          >
            <NotesSection
              notes={mood.notes || ''}
              editable={true}
              onSave={handleSaveNotes}
              placeholder="Add notes about your mood..."
            />
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </DetailCard>
        </div>
      </main>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Mood"
        message="Are you sure you want to delete this mood entry? This action cannot be undone."
      />
    </div>
  );
};

export default MoodDetailView;

