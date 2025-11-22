import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import ActivityPopup from '../../../components/activity/ActivityPopup/ActivityPopup';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import ItemCard from '../../../components/common/ItemCard/ItemCard';
import ErrorContainer from '../../../components/common/ErrorContainer/ErrorContainer';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import SelectionGrid, { SelectionGridItem } from '../../../components/common/SelectionGrid/SelectionGrid';
import { useEntityList } from '../../../hooks/useEntityList';
import { DatabaseService, Activity } from '../../../services/database';
import { formatDate } from '../../../utils/helpers';
import { getActivityIcon } from '../../../utils/iconHelpers';
import './ActivityList.css';

const ActivityList: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showActivityPopup, setShowActivityPopup] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string>('');

  const {
    items: activities,
    loading,
    error,
    selectedDate,
    loadItems: loadActivities,
  } = useEntityList<Activity>({
    loadEntities: DatabaseService.getActivities,
    entityName: 'activities',
  });

  const handleActivityClick = (activity: Activity) => {
    navigate(`/activity/${activity.id}`, {
      state: { selectedDate: formatDate(selectedDate) },
    });
  };

  const handleAvailableActivityClick = (item: SelectionGridItem) => {
    setSelectedActivity(item.name);
    setShowActivityPopup(true);
  };

  const handleClosePopup = () => {
    setShowActivityPopup(false);
    setSelectedActivity('');
  };


  const availableActivities: SelectionGridItem[] = [
    { id: 'running', name: 'Running', icon: getActivityIcon('Running') },
    { id: 'walking', name: 'Walking', icon: getActivityIcon('Walking') },
    { id: 'cycling', name: 'Cycling', icon: getActivityIcon('Cycling') },
    { id: 'swimming', name: 'Swimming', icon: getActivityIcon('Swimming') },
    { id: 'gym-workout', name: 'Gym Workout', icon: getActivityIcon('Gym Workout') },
    { id: 'yoga', name: 'Yoga', icon: getActivityIcon('Yoga') },
    { id: 'dancing', name: 'Dancing', icon: getActivityIcon('Dancing') },
    { id: 'hiking', name: 'Hiking', icon: getActivityIcon('Hiking') },
    { id: 'basketball', name: 'Basketball', icon: getActivityIcon('Basketball') },
    { id: 'tennis', name: 'Tennis', icon: getActivityIcon('Tennis') },
    { id: 'football', name: 'Football', icon: getActivityIcon('Football') },
    { id: 'volleyball', name: 'Volleyball', icon: getActivityIcon('Volleyball') },
    { id: 'badminton', name: 'Badminton', icon: getActivityIcon('Badminton') },
    { id: 'boxing', name: 'Boxing', icon: getActivityIcon('Boxing') },
    { id: 'martial-arts', name: 'Martial Arts', icon: getActivityIcon('Martial Arts') },
  ];

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  return (
    <div className="activity-list-page">
      <Header />

      <main className="activity-list-main">
        <div className="activity-list-content">
          <PageHeader
            title="Daily Activities"
            onBack={() => navigate('/create')}
          />

          {loading ? (
            <div className="loading-container">
              <LoadingSpinner text="Loading activities..." />
            </div>
          ) : error ? (
            <ErrorContainer message={error} onRetry={loadActivities} />
          ) : (
            <>
              {/* Available Activities Section - Always Show */}
              <SelectionGrid
                items={availableActivities}
                onItemClick={handleAvailableActivityClick}
                title="Select Activity Type"
                columns={4}
              />

              {/* Logged Activities Section */}
              {activities.length > 0 ? (
                <div className="logged-activities-section">
                  <h3 className="section-title">Today's Activities</h3>
                  <div className="activities-list">
                    {activities.map(activity => (
                      <ItemCard
                        key={activity.id}
                        icon={getActivityIcon(activity.name)}
                        title={activity.name}
                        onClick={() => handleActivityClick(activity)}
                        details={
                          <>
                            <span className="activity-duration">
                              {activity.duration} min
                            </span>
                            {activity.time && (
                              <span className="activity-time">
                                at {activity.time}
                              </span>
                            )}
                            {activity.notes && (
                              <p className="activity-notes">{activity.notes}</p>
                            )}
                          </>
                        }
                        className="activity-card"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  message={`No activities logged for ${formatDate(selectedDate)} yet. Select an activity type above to get started!`}
                />
              )}
            </>
          )}

        </div>
      </main>

      {/* Activity Popup */}
      <ActivityPopup
        isOpen={showActivityPopup}
        onClose={handleClosePopup}
        activityName={selectedActivity}
      />
    </div>
  );
};

export default ActivityList;
