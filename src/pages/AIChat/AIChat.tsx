import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { firestoreService, ChatHistory, ChatMessage } from '../../services/firestore';
import { DatabaseService } from '../../services/database';
import { sendMessageToMistral, isMistralConfigured } from '../../services/mistral';
import { getStartOfDay } from '../../utils/helpers';
import Header from '../../components/common/Header/Header';
import BottomNavigation from '../../components/common/BottomNavigation/BottomNavigation';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './AIChat.css';

const AIChat: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [userDataJson, setUserDataJson] = useState<string>('');
  const [mistralConfigured, setMistralConfigured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all user data for today
  const fetchUserDataForToday = async (): Promise<string> => {
    if (!currentUser) return '';

    try {
      const today = getStartOfDay(new Date());
      
      // Fetch all data in parallel
      const [
        activities,
        diets,
        hobbies,
        moods,
        waterEntries,
        sleepEntries,
      ] = await Promise.all([
        DatabaseService.getActivities(currentUser.uid, today),
        DatabaseService.getDiets(currentUser.uid, today),
        DatabaseService.getHobbies(currentUser.uid, today),
        DatabaseService.getMood(currentUser.uid, today),
        DatabaseService.getWater(currentUser.uid, today),
        DatabaseService.getSleep(currentUser.uid, today),
      ]);

      // Calculate totals
      const totalWater = waterEntries.reduce((sum, entry) => {
        return sum + (entry.amount ? entry.amount / 1000 : (entry.liters || 0));
      }, 0);

      const totalSleep = sleepEntries.reduce((sum, entry) => {
        return sum + (entry.duration || entry.hours || 0);
      }, 0);

      const totalActivityMinutes = activities.reduce((sum, entry) => {
        return sum + (entry.duration || 0);
      }, 0);

      const totalHobbyMinutes = hobbies.reduce((sum, entry) => {
        return sum + (entry.duration || 0);
      }, 0);

      // Prepare user data object
      const userData = {
        profile: {
          weight: userProfile?.weight || null,
          height: userProfile?.height || null,
          bmi: userProfile?.bmi || null,
          sleepGoal: userProfile?.sleepGoal || null,
          waterGoal: userProfile?.waterGoal || null,
        },
        today: {
          date: today.toISOString().split('T')[0],
          sleep: {
            entries: sleepEntries.map(entry => ({
              id: entry.id,
              bedTime: entry.bedTime,
              wakeTime: entry.wakeTime,
              duration: entry.duration || entry.hours,
              quality: entry.quality,
            })),
            totalHours: totalSleep,
            goal: userProfile?.sleepGoal || null,
          },
          water: {
            entries: waterEntries.map(entry => ({
              id: entry.id,
              amount: entry.amount || (entry.liters ? entry.liters * 1000 : 0),
              time: entry.time,
            })),
            totalLiters: totalWater,
            goal: userProfile?.waterGoal || null,
          },
          activities: activities.map(entry => ({
            id: entry.id,
            name: entry.name,
            duration: entry.duration,
            time: entry.time,
            caloriesBurned: entry.caloriesBurned,
          })),
          totalActivityMinutes,
          diets: diets.map(entry => ({
            id: entry.id,
            mealType: entry.mealType,
            foodItems: entry.foodItems,
            calories: entry.calories,
            time: entry.time,
          })),
          hobbies: hobbies.map(entry => ({
            id: entry.id,
            name: entry.name || entry.type,
            duration: entry.duration,
            time: entry.time,
            category: entry.category,
          })),
          totalHobbyMinutes,
          moods: moods.map(entry => ({
            id: entry.id,
            moodLevel: entry.moodLevel,
            moodType: entry.moodType,
            time: entry.time,
            factors: entry.factors,
          })),
        },
      };

      // Return as formatted JSON string
      return JSON.stringify(userData, null, 2);
    } catch (error) {
      console.error('Error fetching user data:', error);
      return JSON.stringify({ error: 'Failed to fetch user data', message: error instanceof Error ? error.message : 'Unknown error' }, null, 2);
    }
  };

  // Check Mistral configuration
  useEffect(() => {
    setMistralConfigured(isMistralConfigured());
  }, []);

  // Load user data and set initial message
  useEffect(() => {
    const loadInitialData = async () => {
      if (!currentUser) return;

      setIsLoadingUserData(true);
      try {
        const dataJson = await fetchUserDataForToday();
        setUserDataJson(dataJson);
        
        // Set initial greeting message
        const initialMessage: ChatMessage = {
          id: '1',
          text: "Hello! I'm your AI Chat Assistant. I have access to your wellness data for today. How can I help you with your wellness journey?",
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
      } catch (error) {
        console.error('Error loading initial data:', error);
        const initialMessage: ChatMessage = {
          id: '1',
          text: "Hello! I'm your AI Chat Assistant. How can I help you with your wellness journey today?",
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    loadInitialData();
  }, [currentUser, userProfile]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat histories from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const loadChatHistories = async () => {
      try {
        setIsLoadingHistory(true);
        const histories = await firestoreService.getChatHistories(currentUser.uid);
        setChatHistories(histories);
      } catch (error) {
        console.error('Error loading chat histories:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistories();
  }, [currentUser]);


  // Generate AI response using Mistral AI
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    if (!mistralConfigured) {
      return "AI service is not configured. Please set up Mistral AI API key and Agent ID in environment variables.";
    }

    try {
      // Prepare conversation history for Mistral
      const conversationMessages = messages
        .filter(msg => msg.id !== '1') // Exclude initial greeting
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.text,
        }));

      // Add current user message
      conversationMessages.push({
        role: 'user' as const,
        content: userMessage,
      });

      // Send to Mistral AI with user data context
      const response = await sendMessageToMistral(conversationMessages, userDataJson);
      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      if (error instanceof Error) {
        return `I apologize, but I encountered an error: ${error.message}. Please try again.`;
      }
      return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !currentUser) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Get AI response from Mistral
      const aiResponseText = await generateAIResponse(userMessage.text);
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };

      const updatedMessages = [...currentMessages, aiResponse];
      setMessages(updatedMessages);
      setIsLoading(false);
      
      // Save to Firestore with updated messages
      if (currentChatId) {
        // Update existing chat
        try {
          await firestoreService.updateChatHistory(currentUser.uid, currentChatId, {
            title: updatedMessages[1]?.text.substring(0, 30) || 'New Chat',
            messages: updatedMessages,
          });
          // Reload histories to refresh the list
          const histories = await firestoreService.getChatHistories(currentUser.uid);
          setChatHistories(histories);
        } catch (error) {
          console.error('Error updating chat to Firestore:', error);
        }
      } else {
        // Create new chat
        try {
          const title = updatedMessages[1]?.text.substring(0, 30) || 'New Chat';
          const chatId = await firestoreService.createChatHistory(currentUser.uid, {
            title,
            messages: updatedMessages,
          });
          setCurrentChatId(chatId);
          // Reload histories to show the new chat
          const histories = await firestoreService.getChatHistories(currentUser.uid);
          setChatHistories(histories);
        } catch (error) {
          console.error('Error saving chat to Firestore:', error);
        }
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setIsLoading(false);
      // Show error message to user
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I encountered an error processing your message. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLoadHistory = async (history: ChatHistory) => {
    if (!currentUser) return;
    
    try {
      // Reload current user data for context
      const dataJson = await fetchUserDataForToday();
      setUserDataJson(dataJson);
      
      // Load the full chat history from Firestore
      const fullHistory = await firestoreService.getChatHistory(currentUser.uid, history.id);
      if (fullHistory) {
        setMessages(fullHistory.messages);
        setCurrentChatId(fullHistory.id);
      } else {
        // Fallback to the history from the list
        setMessages(history.messages);
        setCurrentChatId(history.id);
      }
      setIsHistoryOpen(false);
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Fallback to the history from the list
      setMessages(history.messages);
      setCurrentChatId(history.id);
      setIsHistoryOpen(false);
    }
  };

  const handleNewChat = async () => {
    setCurrentChatId(null);
    setIsHistoryOpen(false);
    
    // Reload user data for new chat
    setIsLoadingUserData(true);
    try {
      const dataJson = await fetchUserDataForToday();
      setUserDataJson(dataJson);
      const initialMessage: ChatMessage = {
        id: '1',
        text: "Hello! I'm your AI Chat Assistant. I have access to your wellness data for today. How can I help you with your wellness journey?",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      const initialMessage: ChatMessage = {
        id: '1',
        text: "Hello! I'm your AI Chat Assistant. How can I help you with your wellness journey today?",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    } finally {
      setIsLoadingUserData(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  if (!currentUser) {
    return (
      <div className="ai-chat-page">
        <Header />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Please log in to use AI Chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-chat-page">
      <Header />

      <main className="ai-chat-main">
        <div className="ai-chat-content">
          {/* Header Section */}
          <div className="ai-chat-header">
            <button
              className="ai-chat-back-button"
              onClick={() => navigate('/dashboard')}
              aria-label="Go back"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>

            <h1 className="ai-chat-title">AI Chat Assistant</h1>

            <button
              className="ai-chat-history-button"
              onClick={() => setIsHistoryOpen(true)}
              aria-label="View chat history"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="ai-chat-messages">
            {isLoadingUserData ? (
              <div className="ai-chat-message ai-chat-message--ai">
                <div className="ai-chat-message-bubble">
                  <LoadingSpinner />
                  <p style={{ marginTop: '1rem' }}>Loading your data...</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`ai-chat-message ai-chat-message--${message.sender}`}
                >
                  <div className="ai-chat-message-bubble">
                    <p className="ai-chat-message-text">{message.text}</p>
                    <span className="ai-chat-message-time">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="ai-chat-message ai-chat-message--ai">
                <div className="ai-chat-message-bubble">
                  <div className="ai-chat-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="ai-chat-input-area">
            <input
              ref={inputRef}
              type="text"
              className="ai-chat-input"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
            />

            <button
              className="ai-chat-send-button"
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Chat History Modal */}
      {isHistoryOpen && (
        <div
          className="ai-chat-history-overlay"
          onClick={() => setIsHistoryOpen(false)}
        >
          <div
            className="ai-chat-history-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ai-chat-history-header">
              <h2>Chat History</h2>
              <button
                className="ai-chat-history-close"
                onClick={() => setIsHistoryOpen(false)}
                aria-label="Close history"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="ai-chat-history-content">
              <button
                className="ai-chat-history-item ai-chat-history-item--new"
                onClick={handleNewChat}
              >
                <div className="ai-chat-history-item-icon">+</div>
                <div className="ai-chat-history-item-info">
                  <div className="ai-chat-history-item-title">New Chat</div>
                  <div className="ai-chat-history-item-time">Start a fresh conversation</div>
                </div>
              </button>

              {isLoadingHistory ? (
                <div className="ai-chat-history-empty">
                  <LoadingSpinner />
                  <p>Loading chat history...</p>
                </div>
              ) : chatHistories.length === 0 ? (
                <div className="ai-chat-history-empty">
                  <p>No previous chats yet</p>
                  <p className="ai-chat-history-empty-subtitle">
                    Your conversation history will appear here
                  </p>
                </div>
              ) : (
                chatHistories.map((history) => (
                  <button
                    key={history.id}
                    className="ai-chat-history-item"
                    onClick={() => handleLoadHistory(history)}
                  >
                    <div className="ai-chat-history-item-icon">💬</div>
                    <div className="ai-chat-history-item-info">
                      <div className="ai-chat-history-item-title">{history.title}</div>
                      <div className="ai-chat-history-item-time">
                        {new Intl.DateTimeFormat('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        }).format(history.updatedAt || history.createdAt)}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default AIChat;
