import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { sendMessageToMistral, isMistralConfigured } from '../../../services/mistral';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import './AIInsights.css';

interface AIInsightsProps {
  sleepData: any[];
  waterData: any[];
  activityData?: any[];
  dietData?: any[];
  sleepStats: any;
  waterStats: any;
  activityStats?: any;
  dietStats?: any;
  daysBack: number;
}

const AIInsights: React.FC<AIInsightsProps> = ({
  sleepStats,
  waterStats,
  activityStats,
  dietStats,
  daysBack,
}) => {
  const { currentUser } = useAuth();
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mistralConfigured, setMistralConfigured] = useState(false);
  
  // Refs to prevent duplicate calls
  const isGeneratingRef = useRef(false);
  const lastRequestKeyRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMistralConfigured(isMistralConfigured());
  }, []);

  // Create a stable key from stats to detect actual changes
  const getRequestKey = useCallback(() => {
    if (!sleepStats || !waterStats) return '';
    return JSON.stringify({
      daysBack,
      sleepAvg: sleepStats.average,
      waterAvg: waterStats.average,
      activityAvg: activityStats?.averageMinutes || 0,
      dietAvg: dietStats?.averageCalories || 0,
    });
  }, [sleepStats?.average, waterStats?.average, activityStats?.averageMinutes, dietStats?.averageCalories, daysBack]);

  useEffect(() => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only generate insights if Mistral is configured, user is logged in, and stats are available
    if (!mistralConfigured || !currentUser || !sleepStats || !waterStats) {
      return;
    }

    // Check if we already have insights for this data
    const requestKey = getRequestKey();
    if (requestKey === lastRequestKeyRef.current) {
      return; // Already have insights for this data (or already requested)
    }

    // Debounce the API call to prevent rapid-fire requests
    timeoutRef.current = setTimeout(() => {
      // Double-check we're not already generating and data hasn't changed
      const currentKey = getRequestKey();
      if (!isGeneratingRef.current && currentKey === requestKey) {
        generateInsights();
      }
    }, 1000); // 1 second debounce to prevent rate limiting

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sleepStats?.average, waterStats?.average, activityStats?.averageMinutes, dietStats?.averageCalories, daysBack, mistralConfigured, currentUser, getRequestKey]);

  const generateInsights = async () => {
    if (!mistralConfigured || !currentUser || !sleepStats || !waterStats) {
      return;
    }

    // Prevent multiple simultaneous calls
    if (isGeneratingRef.current) {
      console.log('AI insights generation already in progress, skipping...');
      return;
    }

    // Check if we already have insights for this exact data
    const requestKey = getRequestKey();
    if (requestKey === lastRequestKeyRef.current) {
      console.log('Already have insights for this data, skipping...');
      return;
    }

    isGeneratingRef.current = true;
    setLoading(true);
    setError(null);
    lastRequestKeyRef.current = requestKey;

    try {
      // Prepare data context for AI
      const context = {
        period: daysBack === 7 ? 'last 7 days' : daysBack === 30 ? 'last 30 days' : 'last 90 days',
        sleep: {
          average: sleepStats.average || 0,
          min: sleepStats.min || 0,
          max: sleepStats.max || 0,
          goalAchievement: sleepStats.goalAchievement || 0,
          consistency: sleepStats.consistency || 0,
        },
        water: {
          average: waterStats.average || 0,
          min: waterStats.min || 0,
          max: waterStats.max || 0,
          goalAchievement: waterStats.goalAchievement || 0,
          consistency: waterStats.consistency || 0,
        },
        activity: activityStats ? {
          averageMinutes: activityStats.averageMinutes || 0,
          totalMinutes: activityStats.totalMinutes || 0,
          consistency: activityStats.consistency || 0,
          totalCalories: activityStats.totalCalories || 0,
        } : null,
        diet: dietStats ? {
          averageCalories: dietStats.averageCalories || 0,
          totalCalories: dietStats.totalCalories || 0,
          totalMeals: dietStats.totalMeals || 0,
          consistency: dietStats.consistency || 0,
        } : null,
      };

      let prompt = `Based on the following health tracking data for the ${context.period}, provide a brief, friendly, and actionable summary with 2-3 key insights and recommendations. Keep it concise (4-5 sentences max).

Sleep: Average ${context.sleep.average}h/day, Goal achievement: ${context.sleep.goalAchievement}%, Consistency: ${context.sleep.consistency}%
Water: Average ${context.water.average}L/day, Goal achievement: ${context.water.goalAchievement}%, Consistency: ${context.water.consistency}%`;

      if (context.activity) {
        prompt += `\nActivity: Average ${context.activity.averageMinutes} min/day, Total: ${context.activity.totalMinutes} min, Consistency: ${context.activity.consistency}%`;
        if (context.activity.totalCalories > 0) {
          prompt += `, Calories burned: ${context.activity.totalCalories} cal`;
        }
      }

      if (context.diet) {
        prompt += `\nDiet: Average ${context.diet.averageCalories} cal/day, Total meals: ${context.diet.totalMeals}, Consistency: ${context.diet.consistency}%`;
      }

      prompt += `\n\nFocus on patterns, achievements, correlations between metrics, and one actionable tip.`;

      const response = await sendMessageToMistral(
        [{ role: 'user', content: prompt }],
        JSON.stringify(context)
      );

      setInsights(response);
    } catch (err: any) {
      console.error('Error generating AI insights:', err);
      
      // Handle 429 rate limit error specifically
      if (err?.message?.includes('429') || err?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError('Unable to generate insights at this time.');
      }
      
      // Reset the request key on error so we can retry
      lastRequestKeyRef.current = '';
    } finally {
      setLoading(false);
      isGeneratingRef.current = false;
    }
  };

  if (!mistralConfigured) {
    return (
      <div className="ai-insights-container">
        <h3 className="ai-insights-title">AI Insights</h3>
        <div className="ai-insights-placeholder">
          <p>AI insights are not configured. Please set up Mistral AI API key and Agent ID.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-insights-container">
      <h3 className="ai-insights-title">AI Insights</h3>
      {loading ? (
        <div className="ai-insights-loading">
          <LoadingSpinner text="Generating insights..." />
        </div>
      ) : error ? (
        <div className="ai-insights-error">
          <p>{error}</p>
          <button onClick={generateInsights} className="retry-button">
            Retry
          </button>
        </div>
      ) : insights ? (
        <div className="ai-insights-content">
          <p>{insights}</p>
        </div>
      ) : (
        <div className="ai-insights-placeholder">
          <p>No insights available yet. Start tracking your health data to get personalized insights!</p>
        </div>
      )}
    </div>
  );
};

export default AIInsights;

