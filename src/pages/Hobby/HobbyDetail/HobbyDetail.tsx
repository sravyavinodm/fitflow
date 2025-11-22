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
import { DatabaseService, Hobby } from '../../../services/database';
import { getHobbyIcon } from '../../../utils/iconHelpers';
import './HobbyDetail.css';

const HobbyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    entity: hobby,
    loading,
    error,
    deleting,
    setDeleting,
    setError,
    reload,
  } = useEntityDetail<Hobby>({
    loadEntity: DatabaseService.getHobby,
    entityName: 'Hobby',
  });

  const handleSaveNotes = async (notes: string) => {
    if (!currentUser || !id || !hobby) return;

    await DatabaseService.updateHobby(currentUser.uid, id, {
      notes: notes,
    });

    // Reload to get updated entity
    await reload();
    setSuccess('Hobby updated successfully!');
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
      await DatabaseService.deleteHobby(currentUser.uid, id);

      navigate('/hobbies', {
        state: { 
          selectedDate: location.state?.selectedDate,
          refresh: true
        },
      });
    } catch (error: any) {
      setError('Failed to delete hobby');
      console.error('Error deleting hobby:', error);
      setDeleting(false);
    }
  };


  // Format duration in hours and minutes format
  const formatDuration = (minutes: number): string => {
    if (minutes === 0) return '0 minutes';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
    } else if (mins === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
    }
  };

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  if (loading) {
    return <LoadingSpinner overlay text="Loading hobby..." />;
  }

  if (error && !hobby) {
    return (
      <div className="hobby-detail-page">
        <Header />
        <ErrorContainer message={error} onRetry={reload} />
      </div>
    );
  }

  if (!hobby) {
    return (
      <div className="hobby-detail-page">
        <Header />
        <div className="not-found">
          <h2>Hobby not found</h2>
          <button onClick={() => navigate('/hobbies')}>Back to Hobbies</button>
        </div>
      </div>
    );
  }

  return (
    <div className="hobby-detail-page">
      <Header />

      <main className="hobby-detail-main">
        <div className="hobby-detail-content">
          <PageHeader
            title={hobby.name || hobby.type || 'Hobby'}
            onBack={() =>
              navigate('/hobbies', {
                state: { selectedDate: location.state?.selectedDate },
              })
            }
          />

          <DetailCard
            icon={getHobbyIcon(hobby.name || hobby.type || '')}
            title={hobby.name || hobby.type || 'Hobby'}
            stats={
              <>
                <StatItem label="Duration" value={formatDuration(hobby.duration)} />
                {hobby.startTime && hobby.endTime && (
                  <>
                    <StatItem label="Start Time" value={hobby.startTime} />
                    <StatItem label="End Time" value={hobby.endTime} />
                  </>
                )}
                {hobby.category && (
                  <StatItem label="Category" value={hobby.category} />
                )}
                {hobby.frequency && (
                  <StatItem label="Frequency" value={hobby.frequency} />
                )}
              </>
            }
            actions={
              <button
                className="delete-button"
                onClick={handleDeleteClick}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Hobby'}
              </button>
            }
            className="hobby-detail-card"
          >
            <NotesSection
              notes={hobby.notes || ''}
              editable={true}
              onSave={handleSaveNotes}
              placeholder="Add notes about your hobby..."
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
        title="Delete Hobby"
        message="Are you sure you want to delete this hobby? This action cannot be undone."
      />
    </div>
  );
};

export default HobbyDetail;
