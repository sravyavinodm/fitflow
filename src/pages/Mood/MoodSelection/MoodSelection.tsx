import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import ItemCard from '../../../components/common/ItemCard/ItemCard';
import ErrorContainer from '../../../components/common/ErrorContainer/ErrorContainer';
import SelectionGrid, { SelectionGridItem } from '../../../components/common/SelectionGrid/SelectionGrid';
import { DatabaseService, Mood as MoodEntry } from '../../../services/database';
import { formatDate } from '../../../utils/helpers';
import { getMoodEmoji } from '../../../utils/iconHelpers';
import { formatTimeForDisplay } from '../../../utils/timeHelpers';
import { parseDateFromNavigation } from '../../../utils/timeHelpers';
import './MoodSelection.css';

interface MoodOption {
  id: string;
  name: string;
  emoji: string;
  category: 'positive' | 'neutral' | 'negative';
}

const MoodSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [savedMoods, setSavedMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const processedLocationRef = useRef<string | null>(null);

  const moods: MoodOption[] = [
    // Positive Moods
    { id: 'happy', name: 'Happy', emoji: '😀', category: 'positive' },
    { id: 'excited', name: 'Excited', emoji: '🤩', category: 'positive' },
    { id: 'relaxed', name: 'Relaxed', emoji: '😌', category: 'positive' },
    { id: 'energetic', name: 'Energetic', emoji: '⚡', category: 'positive' },
    { id: 'grateful', name: 'Grateful', emoji: '🙏', category: 'positive' },
    { id: 'motivated', name: 'Motivated', emoji: '🚀', category: 'positive' },
    
    // Neutral Moods
    { id: 'calm', name: 'Calm', emoji: '🙂', category: 'neutral' },
    { id: 'okay', name: 'Okay', emoji: '😐', category: 'neutral' },
    { id: 'tired', name: 'Tired', emoji: '😴', category: 'neutral' },
    { id: 'bored', name: 'Bored', emoji: '😑', category: 'neutral' },
    { id: 'focused', name: 'Focused', emoji: '🎯', category: 'neutral' },
    
    // Negative Moods
    { id: 'sad', name: 'Sad', emoji: '😔', category: 'negative' },
    { id: 'anxious', name: 'Anxious', emoji: '😟', category: 'negative' },
    { id: 'angry', name: 'Angry', emoji: '😡', category: 'negative' },
    { id: 'stressed', name: 'Stressed', emoji: '😣', category: 'negative' },
    { id: 'lonely', name: 'Lonely', emoji: '😞', category: 'negative' },
    { id: 'overwhelmed', name: 'Overwhelmed', emoji: '😵', category: 'negative' },
  ];

  const loadMoods = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const moodsData = await DatabaseService.getMood(currentUser.uid, selectedDate);
      setSavedMoods(moodsData);
    } catch (error: any) {
      setError('Failed to load moods');
      console.error('Error loading moods:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, selectedDate]);

  useEffect(() => {
    const locationKey = location.key || 'default';
    
    // Only process if this is a new location
    if (processedLocationRef.current !== locationKey) {
      processedLocationRef.current = locationKey;
      
      // If refresh flag is present, reset to today's date to show today's moods
      if (location.state?.refresh) {
        setSelectedDate(new Date());
        if (currentUser) {
          setTimeout(() => {
            loadMoods();
          }, 100);
        }
      } else if (location.state?.selectedDate) {
        // Get selected date from navigation state if available (and not a refresh)
        const parsedDate = parseDateFromNavigation(location.state.selectedDate);
        setSelectedDate(parsedDate);
      }
    }
  }, [location, currentUser, loadMoods]);

  useEffect(() => {
    if (currentUser) {
      loadMoods();
    }
  }, [currentUser, selectedDate, loadMoods]);

  const handleMoodClick = (item: SelectionGridItem) => {
    // Find the mood option from the original moods array
    const mood = moods.find(m => m.id === item.id);
    if (mood) {
      navigate('/mood-detail', { 
        state: { 
          selectedMood: mood,
          fromPage: 'mood-selection',
          selectedDate: formatDate(selectedDate)
        } 
      });
    }
  };

  const handleSavedMoodClick = (mood: MoodEntry) => {
    navigate(`/mood/${mood.id}`, {
      state: { selectedDate: formatDate(selectedDate) },
    });
  };

  const getMoodsByCategory = (category: string): SelectionGridItem[] => {
    return moods
      .filter(mood => mood.category === category)
      .map(mood => ({
        id: mood.id,
        name: mood.name,
        icon: mood.emoji,
      }));
  };

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  return (
    <div className="mood-selection-page">
      <Header />
      
      <main className="mood-selection-main">
        <div className="mood-selection-content">
          <PageHeader
            title="Mood Selection"
            onBack={() => navigate('/create')}
          />

          {loading ? (
            <div className="loading-container">
              <LoadingSpinner text="Loading moods..." />
            </div>
          ) : error ? (
            <ErrorContainer message={error} onRetry={loadMoods} />
          ) : (
            <>
              {/* Positive Moods */}
              <SelectionGrid
                items={getMoodsByCategory('positive')}
                onItemClick={handleMoodClick}
                title="Positive Moods"
                columns={4}
                className="mood-category positive"
              />

              {/* Neutral Moods */}
              <SelectionGrid
                items={getMoodsByCategory('neutral')}
                onItemClick={handleMoodClick}
                title="Neutral Moods"
                columns={4}
                className="mood-category neutral"
              />

              {/* Negative Moods */}
              <SelectionGrid
                items={getMoodsByCategory('negative')}
                onItemClick={handleMoodClick}
                title="Negative Moods"
                columns={4}
                className="mood-category negative"
              />

              {/* Today's Moods Section */}
              {savedMoods.length > 0 && (
                <div className="saved-moods-section">
                  <h2 className="section-title">Today's Moods</h2>
                  <div className="saved-moods-list">
                    {savedMoods.map(mood => (
                      <ItemCard
                        key={mood.id}
                        icon={getMoodEmoji(mood.moodType)}
                        title={mood.moodType}
                        onClick={() => handleSavedMoodClick(mood)}
                        details={
                          <>
                            {mood.time && (
                              <span className="saved-mood-time">
                                {formatTimeForDisplay(mood.time)}
                              </span>
                            )}
                            {mood.moodLevel && (
                              <span className="saved-mood-level">
                                Level: {mood.moodLevel}/5
                              </span>
                            )}
                            {mood.notes && (
                              <p className="saved-mood-notes">{mood.notes}</p>
                            )}
                          </>
                        }
                        className="saved-mood-card"
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

export default MoodSelection;
