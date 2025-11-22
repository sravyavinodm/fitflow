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
import { DatabaseService, Diet } from '../../../services/database';
import { getMealIcon } from '../../../utils/iconHelpers';
import './DietDetail.css';

const DietDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    entity: diet,
    loading,
    error,
    deleting,
    setDeleting,
    setError,
    reload,
  } = useEntityDetail<Diet>({
    loadEntity: DatabaseService.getDiet,
    entityName: 'Diet entry',
  });

  const handleSaveNotes = async (notes: string) => {
    if (!currentUser || !id || !diet) return;

    await DatabaseService.updateDiet(currentUser.uid, id, {
      notes: notes,
    });

    // Reload to get updated entity
    await reload();
    setSuccess('Diet entry updated successfully!');
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
      await DatabaseService.deleteDiet(currentUser.uid, id);

      navigate('/diets', {
        state: { selectedDate: location.state?.selectedDate },
      });
    } catch (error: any) {
      setError('Failed to delete diet entry');
      console.error('Error deleting diet:', error);
      setDeleting(false);
    }
  };


  if (loading) {
    return <LoadingSpinner overlay text="Loading diet entry..." />;
  }

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  if (error && !diet) {
    return (
      <div className="diet-detail-page">
        <Header />
        <ErrorContainer message={error} onRetry={reload} />
      </div>
    );
  }

  if (!diet) {
    return (
      <div className="diet-detail-page">
        <Header />
        <div className="not-found">
          <h2>Diet entry not found</h2>
          <button onClick={() => navigate('/diets')}>
            Back to Diet List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="diet-detail-page">
      <Header />

      <main className="diet-detail-main">
        <div className="diet-detail-content">
          <PageHeader
            title={diet.mealType}
            onBack={() =>
              navigate('/diets', {
                state: { selectedDate: location.state?.selectedDate },
              })
            }
          />

          <DetailCard
            icon={getMealIcon(diet.mealType)}
            title={diet.mealType}
            stats={
              <>
                <StatItem label="Calories" value={`${diet.calories} cal`} />
                {diet.time && (
                  <StatItem label="Time" value={diet.time} />
                )}
              </>
            }
            actions={
              <button
                className="delete-button"
                onClick={handleDeleteClick}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Diet Entry'}
              </button>
            }
            className="diet-detail-card"
          >
            <div className="diet-food-section">
              <div className="food-header">
                <h3 className="food-title">Food Items</h3>
              </div>
              <div className="food-display">
                {diet.foodItems ? (
                  <p className="food-text">{diet.foodItems}</p>
                ) : (
                  <p className="food-placeholder">No food items specified</p>
                )}
              </div>
            </div>

            <NotesSection
              notes={diet.notes || ''}
              editable={true}
              onSave={handleSaveNotes}
              placeholder="Add notes about your meal..."
            />
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </DetailCard>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Diet Entry"
        message="Are you sure you want to delete this diet entry?"
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

export default DietDetail;