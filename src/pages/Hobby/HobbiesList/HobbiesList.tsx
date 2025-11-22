import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import ItemCard from '../../../components/common/ItemCard/ItemCard';
import ErrorContainer from '../../../components/common/ErrorContainer/ErrorContainer';
import SelectionGrid, { SelectionGridItem } from '../../../components/common/SelectionGrid/SelectionGrid';
import { useEntityList } from '../../../hooks/useEntityList';
import { DatabaseService, Hobby } from '../../../services/database';
import { formatDate } from '../../../utils/helpers';
import { getHobbyIcon } from '../../../utils/iconHelpers';
import './HobbiesList.css';

const HobbiesList: React.FC = () => {
  const navigate = useNavigate();

  const {
    items: hobbies,
    loading,
    error,
    selectedDate,
    loadItems: loadHobbies,
  } = useEntityList<Hobby>({
    loadEntities: DatabaseService.getHobbies,
    entityName: 'hobbies',
  });


  const handleAvailableHobbyClick = (item: SelectionGridItem) => {
    navigate('/hobby/entry', {
      state: { 
        selectedDate: formatDate(selectedDate),
        hobbyName: item.name
      },
    });
  };

  const handleHobbyClick = (hobby: Hobby) => {
    navigate(`/hobby/${hobby.id}`, {
      state: { selectedDate: formatDate(selectedDate) },
    });
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

  const availableHobbies: SelectionGridItem[] = [
    { id: 'reading', name: 'Reading', icon: getHobbyIcon('Reading') },
    { id: 'music', name: 'Music', icon: getHobbyIcon('Music') },
    { id: 'art-drawing', name: 'Art & Drawing', icon: getHobbyIcon('Art & Drawing') },
    { id: 'gaming', name: 'Gaming', icon: getHobbyIcon('Gaming') },
    { id: 'photography', name: 'Photography', icon: getHobbyIcon('Photography') },
    { id: 'cooking', name: 'Cooking', icon: getHobbyIcon('Cooking') },
    { id: 'gardening', name: 'Gardening', icon: getHobbyIcon('Gardening') },
    { id: 'crafts', name: 'Crafts', icon: getHobbyIcon('Crafts') },
    { id: 'writing', name: 'Writing', icon: getHobbyIcon('Writing') },
    { id: 'movies', name: 'Movies', icon: getHobbyIcon('Movies') },
    { id: 'sports', name: 'Sports', icon: getHobbyIcon('Sports') },
    { id: 'dancing', name: 'Dancing', icon: getHobbyIcon('Dancing') },
    { id: 'learning', name: 'Learning', icon: getHobbyIcon('Learning') },
    { id: 'travel', name: 'Travel', icon: getHobbyIcon('Travel') },
    { id: 'collecting', name: 'Collecting', icon: getHobbyIcon('Collecting') },
  ];

  return (
    <div className="hobbies-list-page">
      <Header />

      <main className="hobbies-list-main">
        <div className="hobbies-list-content">
          <PageHeader
            title="Daily Hobbies"
            onBack={() => navigate('/create')}
          />

          {loading ? (
            <div className="loading-container">
              <LoadingSpinner text="Loading hobbies..." />
            </div>
          ) : error ? (
            <ErrorContainer message={error} onRetry={loadHobbies} />
          ) : (
            <>
              {/* Available Hobbies Section */}
              <SelectionGrid
                items={availableHobbies}
                onItemClick={handleAvailableHobbyClick}
                title="Available Hobbies"
                columns={4}
              />

              {/* Today's Hobbies Section */}
              {hobbies.length > 0 && (
                <div className="logged-hobbies-section">
                  <h3 className="section-title">Today's Hobbies</h3>
                  <div className="hobbies-list">
                    {hobbies.map(hobby => (
                      <ItemCard
                        key={hobby.id}
                        icon={getHobbyIcon(hobby.name || hobby.type || '')}
                        title={hobby.name || hobby.type || 'Hobby'}
                        onClick={() => handleHobbyClick(hobby)}
                        details={
                          <>
                            <span className="hobby-time">{formatDuration(hobby.duration)}</span>
                            {hobby.notes && (
                              <p className="hobby-notes">{hobby.notes}</p>
                            )}
                          </>
                        }
                        className="hobby-card"
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default HobbiesList;
