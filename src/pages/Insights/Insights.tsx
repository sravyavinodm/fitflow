import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DatabaseService } from '../../services/database';
import {
  aggregateSleepByDay,
  aggregateWaterByDay,
  aggregateActivityByDay,
  aggregateDietByDay,
  calculateSleepStats,
  calculateWaterStats,
  calculateActivityStats,
  calculateDietStats,
  groupActivitiesByType,
  groupDietsByMealType,
  getDateRange,
} from '../../utils/insightsHelpers';
import Header from '../../components/common/Header/Header';
import BottomNavigation from '../../components/common/BottomNavigation/BottomNavigation';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import SleepGraph from '../../components/insights/SleepGraph/SleepGraph';
import WaterGraph from '../../components/insights/WaterGraph/WaterGraph';
import ActivityDurationGraph from '../../components/insights/ActivityDurationGraph/ActivityDurationGraph';
import ActivityTypeChart from '../../components/insights/ActivityTypeChart/ActivityTypeChart';
import CalorieIntakeGraph from '../../components/insights/CalorieIntakeGraph/CalorieIntakeGraph';
import MealTypeChart from '../../components/insights/MealTypeChart/MealTypeChart';
import CaloriesPerMealChart from '../../components/insights/CaloriesPerMealChart/CaloriesPerMealChart';
import AIInsights from '../../components/insights/AIInsights/AIInsights';
import './Insights.css';

const Insights: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [aggregatedSleep, setAggregatedSleep] = useState<any[]>([]);
  const [aggregatedWater, setAggregatedWater] = useState<any[]>([]);
  const [aggregatedActivity, setAggregatedActivity] = useState<any[]>([]);
  const [aggregatedDiet, setAggregatedDiet] = useState<any[]>([]);
  const [activityTypes, setActivityTypes] = useState<any[]>([]);
  const [mealTypes, setMealTypes] = useState<any[]>([]);
  const [sleepStats, setSleepStats] = useState<any>(null);
  const [waterStats, setWaterStats] = useState<any>(null);
  const [activityStats, setActivityStats] = useState<any>(null);
  const [dietStats, setDietStats] = useState<any>(null);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser, timeRange]);

  const loadData = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const { startDate, endDate } = getDateRange(timeRange);

      // Fetch data in parallel
      const [sleepEntries, waterEntries, activityEntries, dietEntries] = await Promise.all([
        DatabaseService.getSleepRange(currentUser.uid, startDate, endDate),
        DatabaseService.getWaterRange(currentUser.uid, startDate, endDate),
        DatabaseService.getActivitiesRange(currentUser.uid, startDate, endDate),
        DatabaseService.getDietsRange(currentUser.uid, startDate, endDate),
      ]);

      // Aggregate data by day
      const sleepGoal = userProfile?.sleepGoal || undefined;
      const waterGoal = userProfile?.waterGoal || undefined;

      const aggregatedSleepData = aggregateSleepByDay(
        sleepEntries,
        startDate,
        endDate,
        sleepGoal
      );
      const aggregatedWaterData = aggregateWaterByDay(
        waterEntries,
        startDate,
        endDate,
        waterGoal
      );
      const aggregatedActivityData = aggregateActivityByDay(
        activityEntries,
        startDate,
        endDate
      );
      const aggregatedDietData = aggregateDietByDay(
        dietEntries,
        startDate,
        endDate
      );

      setAggregatedSleep(aggregatedSleepData);
      setAggregatedWater(aggregatedWaterData);
      setAggregatedActivity(aggregatedActivityData);
      setAggregatedDiet(aggregatedDietData);

      // Group activities and diets by type
      setActivityTypes(groupActivitiesByType(activityEntries));
      setMealTypes(groupDietsByMealType(dietEntries));

      // Calculate statistics
      setSleepStats(calculateSleepStats(aggregatedSleepData));
      setWaterStats(calculateWaterStats(aggregatedWaterData));
      setActivityStats(calculateActivityStats(aggregatedActivityData));
      setDietStats(calculateDietStats(aggregatedDietData));
    } catch (err) {
      console.error('Error loading insights data:', err);
      setError('Failed to load insights data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="insights-page">
        <Header />
        <LoadingSpinner overlay text="Redirecting to login..." />
      </div>
    );
  }

  return (
    <div className="insights-page">
      <Header />

      <main className="insights-main">
        <div className="insights-content">
          <div className="insights-header">
            <h1 className="page-title">Insights</h1>
            <div className="time-range-selector">
              <button
                className={`range-button ${timeRange === 7 ? 'active' : ''}`}
                onClick={() => setTimeRange(7)}
              >
                7 Days
              </button>
              <button
                className={`range-button ${timeRange === 30 ? 'active' : ''}`}
                onClick={() => setTimeRange(30)}
              >
                30 Days
              </button>
              <button
                className={`range-button ${timeRange === 90 ? 'active' : ''}`}
                onClick={() => setTimeRange(90)}
              >
                90 Days
              </button>
            </div>
          </div>

          {loading ? (
            <div className="insights-loading">
              <LoadingSpinner text="Loading insights..." />
            </div>
          ) : error ? (
            <div className="insights-error">
              <p>{error}</p>
              <button onClick={loadData} className="retry-button">
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Quick Stats */}
              {sleepStats && waterStats && (
                <div className="quick-stats">
                  <div className="stat-card">
                    <div className="stat-label">Sleep Avg</div>
                    <div className="stat-value">{sleepStats.average}h</div>
                    <div className="stat-subtext">
                      {sleepStats.goalAchievement}% goal met
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Water Avg</div>
                    <div className="stat-value">{waterStats.average}L</div>
                    <div className="stat-subtext">
                      {waterStats.goalAchievement}% goal met
                    </div>
                  </div>
                  {activityStats && (
                    <div className="stat-card">
                      <div className="stat-label">Activity Avg</div>
                      <div className="stat-value">{activityStats.averageMinutes} min</div>
                      <div className="stat-subtext">
                        {activityStats.consistency}% consistency
                      </div>
                    </div>
                  )}
                  {dietStats && (
                    <div className="stat-card">
                      <div className="stat-label">Calories Avg</div>
                      <div className="stat-value">{dietStats.averageCalories} cal</div>
                      <div className="stat-subtext">
                        {dietStats.totalMeals} meals logged
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sleep Graph */}
              {aggregatedSleep.length > 0 ? (
                <SleepGraph
                  data={aggregatedSleep}
                  daysBack={timeRange}
                  goal={userProfile?.sleepGoal}
                />
              ) : (
                <div className="empty-state">
                  <p>No sleep data available for this period.</p>
                  <p className="empty-state-subtext">
                    Start tracking your sleep to see insights here.
                  </p>
                </div>
              )}

              {/* Water Graph */}
              {aggregatedWater.length > 0 ? (
                <WaterGraph
                  data={aggregatedWater}
                  daysBack={timeRange}
                  goal={userProfile?.waterGoal}
                />
              ) : (
                <div className="empty-state">
                  <p>No water data available for this period.</p>
                  <p className="empty-state-subtext">
                    Start tracking your water intake to see insights here.
                  </p>
                </div>
              )}

              {/* Activity Duration Graph */}
              {aggregatedActivity.length > 0 ? (
                <ActivityDurationGraph
                  data={aggregatedActivity}
                  daysBack={timeRange}
                />
              ) : (
                <div className="empty-state">
                  <p>No activity data available for this period.</p>
                  <p className="empty-state-subtext">
                    Start tracking your activities to see insights here.
                  </p>
                </div>
              )}

              {/* Activity Type Chart */}
              {activityTypes.length > 0 && (
                <ActivityTypeChart data={activityTypes} />
              )}

              {/* Calorie Intake Graph */}
              {aggregatedDiet.length > 0 ? (
                <CalorieIntakeGraph
                  data={aggregatedDiet}
                  daysBack={timeRange}
                />
              ) : (
                <div className="empty-state">
                  <p>No diet data available for this period.</p>
                  <p className="empty-state-subtext">
                    Start tracking your meals to see insights here.
                  </p>
                </div>
              )}

              {/* Meal Type Chart */}
              {mealTypes.length > 0 && (
                <MealTypeChart data={mealTypes} />
              )}

              {/* Calories Per Meal Chart */}
              {mealTypes.length > 0 && (
                <CaloriesPerMealChart data={mealTypes} />
              )}

              {/* AI Insights */}
              {sleepStats && waterStats && (
                <AIInsights
                  sleepData={aggregatedSleep}
                  waterData={aggregatedWater}
                  activityData={aggregatedActivity}
                  dietData={aggregatedDiet}
                  sleepStats={sleepStats}
                  waterStats={waterStats}
                  activityStats={activityStats}
                  dietStats={dietStats}
                  daysBack={timeRange}
                />
              )}
            </>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Insights;

