import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { DatabaseService, Activity, Diet, Hobby, Mood, Water, Sleep } from '../../../services/database';
import { formatDate } from '../../../utils/helpers';
import './CalendarOptions.css';

interface CalendarOptionsProps {
  selectedDate: Date;
}

interface CategoryData {
  id: string;
  items: any[];
  loading: boolean;
}

const CalendarOptions: React.FC<CalendarOptionsProps> = ({
  selectedDate,
}) => {
  const { currentUser } = useAuth();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<Record<string, CategoryData>>({});

  const options = [
    {
      id: 'activitylist',
      label: 'Activities',
      icon: '🏃',
      description: 'View activities for selected date',
      color: '#4CAF50',
    },
    {
      id: 'diet',
      label: 'Diet',
      icon: '🥗',
      description: 'View meals for selected date',
      color: '#FF9800',
    },
    {
      id: 'hobbiesdone',
      label: 'Hobbies',
      icon: '🎨',
      description: 'View hobbies for selected date',
      color: '#9C27B0',
    },
    {
      id: 'sleep',
      label: 'Sleep',
      icon: '😴',
      description: 'View sleep data for selected date',
      color: '#2196F3',
    },
    {
      id: 'water',
      label: 'Water',
      icon: '💧',
      description: 'View water intake for selected date',
      color: '#00BCD4',
    },
    {
      id: 'mood',
      label: 'Mood',
      icon: '😊',
      description: 'View mood data for selected date',
      color: '#FF5722',
    },
  ];

  const selectedDateString = formatDate(selectedDate);

  // Format time from string to display format (e.g., "07:00" -> "07:00 AM")
  const formatTimeDisplay = (timeString: string): string => {
    if (!timeString) return '';
    // If already formatted, return as is
    if (timeString.includes('AM') || timeString.includes('PM')) return timeString;
    // Try to parse and format
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour.toString().padStart(2, '0')}:${minutes || '00'} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  // Format duration from minutes to "X min" or "Xh Ym"
  const formatDuration = (minutes: number | undefined): string => {
    if (!minutes) return '0 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Format sleep duration from hours to "Xh Ym"
  const formatSleepDuration = (hours: number | undefined): string => {
    if (!hours) return '0h 0m';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  // Format quality number to string
  const formatQuality = (quality: number | undefined): string => {
    if (!quality) return 'Unknown';
    const qualityMap: Record<number, string> = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent',
    };
    return qualityMap[quality] || 'Unknown';
  };

  // Fetch data from database
  const fetchCategoryData = async (categoryId: string, date: Date): Promise<any[]> => {
    if (!currentUser) return [];

    try {
      switch (categoryId) {
        case 'activitylist': {
          const activities = await DatabaseService.getActivities(currentUser.uid, date);
          return activities.map((activity: Activity) => ({
            id: activity.id,
            name: activity.name,
            duration: formatDuration(activity.duration),
            calories: activity.caloriesBurned || 0,
            time: formatTimeDisplay(activity.time),
          }));
        }
        case 'diet': {
          const diets = await DatabaseService.getDiets(currentUser.uid, date);
          return diets.map((diet: Diet) => ({
            id: diet.id,
            meal: diet.mealType,
            food: diet.foodItems,
            calories: diet.calories,
            time: formatTimeDisplay(diet.time),
          }));
        }
        case 'hobbiesdone': {
          const hobbies = await DatabaseService.getHobbies(currentUser.uid, date);
          return hobbies.map((hobby: Hobby) => ({
            id: hobby.id,
            hobby: hobby.name || hobby.type || 'Hobby',
            duration: formatDuration(hobby.duration),
            time: formatTimeDisplay(hobby.time),
            // Check notes for additional info like book or song
            book: hobby.notes?.includes('book') || hobby.notes?.includes('Book') ? hobby.notes : undefined,
            song: hobby.notes?.includes('song') || hobby.notes?.includes('Song') ? hobby.notes : undefined,
          }));
        }
        case 'sleep': {
          const sleepEntries = await DatabaseService.getSleep(currentUser.uid, date);
          return sleepEntries.map((sleep: Sleep) => ({
            id: sleep.id,
            bedtime: sleep.bedTime ? formatTimeDisplay(sleep.bedTime) : 'N/A',
            wakeup: sleep.wakeTime ? formatTimeDisplay(sleep.wakeTime) : 'N/A',
            duration: formatSleepDuration(sleep.duration || sleep.hours),
            quality: formatQuality(sleep.quality),
          }));
        }
        case 'water': {
          const waterEntries = await DatabaseService.getWater(currentUser.uid, date);
          return waterEntries.map((water: Water) => {
            // Handle both ml (amount) and liters (backward compatibility)
            const amountInMl = water.amount || (water.liters ? water.liters * 1000 : 0);
            return {
              id: water.id,
              amount: `${amountInMl}ml`,
              time: formatTimeDisplay(water.time),
            };
          });
        }
        case 'mood': {
          const moods = await DatabaseService.getMood(currentUser.uid, date);
          return moods.map((mood: Mood) => ({
            id: mood.id,
            mood: mood.moodType,
            note: mood.notes || `Mood level: ${mood.moodLevel}/5`,
            time: formatTimeDisplay(mood.time),
          }));
        }
        default:
          return [];
      }
    } catch (error) {
      console.error(`Error fetching ${categoryId}:`, error);
      return [];
    }
  };

  const handleSectionClick = async (sectionId: string) => {
    if (activeSection === sectionId) {
      // Close if already open
      setActiveSection(null);
    } else {
      // Open new section
      setActiveSection(sectionId);
      
      // Load data if not already loaded
      if (!categoryData[sectionId]) {
        setCategoryData(prev => ({
          ...prev,
          [sectionId]: { id: sectionId, items: [], loading: true }
        }));
        
        try {
          const items = await fetchCategoryData(sectionId, selectedDate);
          setCategoryData(prev => ({
            ...prev,
            [sectionId]: { id: sectionId, items, loading: false }
          }));
        } catch (error) {
          setCategoryData(prev => ({
            ...prev,
            [sectionId]: { id: sectionId, items: [], loading: false }
          }));
        }
      }
    }
  };

  // Reset data when date changes
  useEffect(() => {
    setCategoryData({});
    setActiveSection(null);
  }, [selectedDate]);

  const renderCategoryItems = (categoryId: string) => {
    const data = categoryData[categoryId];
    
    if (!data) return null;
    
    if (data.loading) {
      return (
        <div className="category-loading">
          <div className="loading-spinner"></div>
          <p>Loading {options.find(opt => opt.id === categoryId)?.label.toLowerCase()}...</p>
        </div>
      );
    }
    
    if (data.items.length === 0) {
      return (
        <div className="category-empty">
          <p>No {options.find(opt => opt.id === categoryId)?.label.toLowerCase()} logged for this date.</p>
        </div>
      );
    }
    
    return (
      <div className="category-items">
        {data.items.map((item, index) => (
          <div key={item.id || index} className="category-item">
            {categoryId === 'activitylist' && (
              <>
                <div className="item-header">
                  <h5>{item.name}</h5>
                  <span className="item-time">{item.time}</span>
                </div>
                <div className="item-details">
                  <span>Duration: {item.duration}</span>
                  <span>Calories: {item.calories}</span>
                </div>
              </>
            )}
            
            {categoryId === 'diet' && (
              <>
                <div className="item-header">
                  <h5>{item.meal}</h5>
                  <span className="item-time">{item.time}</span>
                </div>
                <div className="item-details">
                  <span>{item.food}</span>
                  <span>Calories: {item.calories}</span>
                </div>
              </>
            )}
            
            {categoryId === 'hobbiesdone' && (
              <>
                <div className="item-header">
                  <h5>{item.hobby}</h5>
                  <span className="item-time">{item.time}</span>
                </div>
                <div className="item-details">
                  <span>Duration: {item.duration}</span>
                  {item.book && <span>Book: {item.book}</span>}
                  {item.song && <span>Song: {item.song}</span>}
                </div>
              </>
            )}
            
            {categoryId === 'sleep' && (
              <>
                <div className="item-header">
                  <h5>Sleep Session</h5>
                  <span className="item-time">{item.duration}</span>
                </div>
                <div className="item-details">
                  <span>Bedtime: {item.bedtime}</span>
                  <span>Wake up: {item.wakeup}</span>
                  <span>Quality: {item.quality}</span>
                </div>
              </>
            )}
            
            {categoryId === 'water' && (
              <>
                <div className="item-header">
                  <h5>{item.amount}</h5>
                  <span className="item-time">{item.time}</span>
                </div>
              </>
            )}
            
            {categoryId === 'mood' && (
              <>
                <div className="item-header">
                  <h5>{item.mood}</h5>
                  <span className="item-time">{item.time}</span>
                </div>
                <div className="item-details">
                  <span>{item.note}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-options">
      <div className="options-header">
        <h3 className="options-title">
          View details for {selectedDateString}
        </h3>
        <p className="options-subtitle">Click a category to see your entries</p>
      </div>

      <div className="accordion-container">
        {options.map(option => (
          <div key={option.id} className="accordion-item">
            <button
              className={`accordion-header ${activeSection === option.id ? 'active' : ''}`}
              onClick={() => handleSectionClick(option.id)}
              style={{ '--option-color': option.color } as React.CSSProperties}
            >
              <div className="accordion-header-content">
                <div className="option-icon">
                  <span className="icon-emoji">{option.icon}</span>
                </div>
                <div className="option-info">
                  <h4 className="option-label">{option.label}</h4>
                  <p className="option-description">{option.description}</p>
                </div>
              </div>
              
              <div className={`accordion-arrow ${activeSection === option.id ? 'expanded' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="6,9 12,15 18,9" />
                </svg>
              </div>
            </button>
            
            <div className={`accordion-content ${activeSection === option.id ? 'expanded' : ''}`}>
              {activeSection === option.id && renderCategoryItems(option.id)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarOptions;
