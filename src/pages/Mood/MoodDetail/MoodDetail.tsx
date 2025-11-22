import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/common/Header/Header';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import { DatabaseService } from '../../../services/database';
import { formatDate } from '../../../utils/helpers';
import { getTimeInputValue, formatTimeForDisplay, getDateInputValue, getCurrentTime, parseDateFromNavigation } from '../../../utils/timeHelpers';
import './MoodDetail.css';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  category: 'positive' | 'neutral' | 'negative' | 'other';
}

const MoodDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(getCurrentTime());
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  
  const selectedMood: Mood = location.state?.selectedMood;


  const getMoodSuggestions = (mood: Mood) => {
    const suggestions: { [key: string]: string[] } = {
      happy: [
        "Keep doing what makes you happy!",
        "Share your joy with others",
        "Take a moment to appreciate this feeling"
      ],
      excited: [
        "Channel this energy into something productive",
        "Share your excitement with friends",
        "Use this momentum to tackle new challenges"
      ],
      relaxed: [
        "Maintain this peaceful state",
        "Practice deep breathing exercises",
        "Enjoy this moment of calm"
      ],
      energetic: [
        "Use this energy for physical activity",
        "Tackle tasks that require focus",
        "Share your energy with others"
      ],
      grateful: [
        "Write down what you're grateful for",
        "Express gratitude to someone important",
        "Reflect on positive experiences"
      ],
      motivated: [
        "Set a small goal and work towards it",
        "Break down big tasks into smaller steps",
        "Celebrate your progress"
      ],
      sad: [
        "It's okay to feel sad - emotions are temporary",
        "Reach out to a friend or loved one",
        "Engage in activities that bring you comfort"
      ],
      anxious: [
        "Practice deep breathing or meditation",
        "Focus on what you can control",
        "Consider talking to someone about your feelings"
      ],
      angry: [
        "Take a moment to cool down",
        "Express your feelings in a healthy way",
        "Consider what's really bothering you"
      ],
      stressed: [
        "Take a break and do something relaxing",
        "Prioritize your tasks and focus on one thing",
        "Practice stress-relief techniques"
      ],
      lonely: [
        "Reach out to friends or family",
        "Join a community or group activity",
        "Remember that you're not alone"
      ],
      overwhelmed: [
        "Break tasks into smaller, manageable pieces",
        "Ask for help when you need it",
        "Take time to rest and recharge"
      ]
    };

    return suggestions[mood.id] || [
      "Take care of yourself",
      "Remember that feelings are temporary",
      "Be kind to yourself"
    ];
  };

  const handleSave = async () => {
    if (!currentUser || !selectedMood) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const moodData = {
        moodLevel: getMoodLevel(selectedMood.category),
        moodType: selectedMood.name,
        time: selectedTime,
        entryDate: selectedDate,
        notes: notes.trim(),
        factors: [],
      };

      await DatabaseService.createMood(currentUser.uid, moodData);

      setSuccess('Mood saved successfully!');
      setTimeout(() => {
        navigate('/mood', {
          state: { 
            refresh: true,
            selectedDate: formatDate(selectedDate)
          },
        });
      }, 1500);
    } catch (error: any) {
      setError('Failed to save mood');
      console.error('Error saving mood:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodLevel = (category: string): number => {
    switch (category) {
      case 'positive':
        return 5;
      case 'neutral':
        return 3;
      case 'negative':
        return 1;
      default:
        return 3;
    }
  };


  useEffect(() => {
    // Get selected date from navigation state if available
    if (location.state?.selectedDate) {
      const parsedDate = parseDateFromNavigation(location.state.selectedDate);
      setSelectedDate(parsedDate);
    }
  }, [location.state]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    setSelectedTime(timeValue);
  };
  
  const handleDateInputClick = () => {
    if (dateInputRef.current && 'showPicker' in dateInputRef.current) {
      try {
        (dateInputRef.current as any).showPicker();
      } catch (err) {
        // Fallback to default behavior
      }
    }
  };
  
  const handleTimeInputClick = () => {
    if (timeInputRef.current && 'showPicker' in timeInputRef.current) {
      try {
        (timeInputRef.current as any).showPicker();
      } catch (err) {
        // Fallback to default behavior
      }
    }
  };

  if (!currentUser) {
    return <LoadingSpinner overlay text="Redirecting to login..." />;
  }

  if (!selectedMood) {
    return (
      <div className="mood-detail-page">
        <Header />
        <main className="mood-detail-main">
          <div className="error-container">
            <h2>No mood selected</h2>
            <button onClick={() => navigate('/create')}>
              Go back to Create
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="mood-detail-page">
      <Header />
      
      <main className="mood-detail-main">
        <div className="mood-detail-content">
          {/* Header Section */}
          <div className="mood-detail-header">
            <button className="back-arrow" onClick={() => navigate(-1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            
            <h1 className="mood-detail-title">{selectedMood.name}</h1>
          </div>

          {/* Mood Display */}
          <div className="mood-display">
            <div className="mood-emoji-large">{selectedMood.emoji}</div>
            <h2 className="mood-name-large">{selectedMood.name}</h2>
          </div>

          {/* Mood Improvement Suggestions */}
          <div className="suggestions-box">
            <h3 className="suggestions-title">Mood Improvement Suggestions</h3>
            <ul className="suggestions-list">
              {getMoodSuggestions(selectedMood).map((suggestion, index) => (
                <li key={index} className="suggestion-item">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Date Picker */}
          <div className="form-section">
            <label className="section-label">Date</label>
            <div className="picker-wrapper">
              <button
                type="button"
                className="interactive-box date-box"
              >
                <div className="box-content">
                  <div className="box-icon">📅</div>
                  <div className="box-text">
                    <div className="box-value">{formatDate(selectedDate)}</div>
                    <div className="box-subtitle">Tap to change</div>
                  </div>
                </div>
                <div className="box-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </div>
              </button>
              <input
                ref={dateInputRef}
                type="date"
                value={getDateInputValue(selectedDate)}
                onChange={handleDateChange}
                onClick={handleDateInputClick}
                className="hidden-input"
              />
            </div>
          </div>

          {/* Time Picker */}
          <div className="form-section">
            <label className="section-label">Time</label>
            <div className="picker-wrapper">
              <button
                type="button"
                className="interactive-box time-box"
              >
                <div className="box-content">
                  <div className="box-icon">🕐</div>
                  <div className="box-text">
                    <div className="box-value">{formatTimeForDisplay(selectedTime)}</div>
                    <div className="box-subtitle">Tap to change</div>
                  </div>
                </div>
                <div className="box-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </div>
              </button>
              <input
                ref={timeInputRef}
                type="time"
                value={getTimeInputValue(selectedTime)}
                onChange={handleTimeChange}
                onClick={handleTimeInputClick}
                className="hidden-input"
              />
            </div>
          </div>

          {/* Notes Entry */}
          <div className="notes-box">
            <h3 className="notes-title">Notes</h3>
            <textarea
              className="notes-textarea"
              placeholder="Write notes about your mood, e.g., 'Today I worked out for 2 hours' or 'Done the hobby for 3 hours'"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* Save Button */}
          <button 
            className="save-button" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </main>

    </div>
  );
};

export default MoodDetail;
