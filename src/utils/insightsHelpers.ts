import { Sleep, Water, Activity, Diet } from '../services/database';
import { format, startOfDay, eachDayOfInterval } from 'date-fns';

export interface DailySleepData {
  date: string;
  dateObj: Date;
  hours: number;
  quality?: number;
  goal?: number;
}

export interface DailyWaterData {
  date: string;
  dateObj: Date;
  liters: number;
  goal?: number;
}

/**
 * Aggregate sleep data by day
 */
export function aggregateSleepByDay(
  sleepEntries: Sleep[],
  startDate: Date,
  endDate: Date,
  goal?: number
): DailySleepData[] {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Group entries by day
  const entriesByDay = new Map<string, Sleep[]>();
  sleepEntries.forEach(entry => {
    const dayKey = format(startOfDay(entry.entryDate), 'yyyy-MM-dd');
    if (!entriesByDay.has(dayKey)) {
      entriesByDay.set(dayKey, []);
    }
    entriesByDay.get(dayKey)!.push(entry);
  });

  // Aggregate data for each day
  return days.map(date => {
    const dayKey = format(startOfDay(date), 'yyyy-MM-dd');
    const dayEntries = entriesByDay.get(dayKey) || [];
    
    // Sum all sleep hours for the day
    const totalHours = dayEntries.reduce((sum, entry) => {
      return sum + (entry.duration || entry.hours || 0);
    }, 0);

    // Average quality if available
    const qualities = dayEntries
      .map(e => e.quality)
      .filter((q): q is number => q !== undefined && q !== null);
    const avgQuality = qualities.length > 0
      ? qualities.reduce((sum, q) => sum + q, 0) / qualities.length
      : undefined;

    return {
      date: dayKey,
      dateObj: date,
      hours: totalHours,
      quality: avgQuality,
      goal,
    };
  });
}

/**
 * Aggregate water data by day
 */
export function aggregateWaterByDay(
  waterEntries: Water[],
  startDate: Date,
  endDate: Date,
  goal?: number
): DailyWaterData[] {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Group entries by day
  const entriesByDay = new Map<string, Water[]>();
  waterEntries.forEach(entry => {
    const dayKey = format(startOfDay(entry.entryDate), 'yyyy-MM-dd');
    if (!entriesByDay.has(dayKey)) {
      entriesByDay.set(dayKey, []);
    }
    entriesByDay.get(dayKey)!.push(entry);
  });

  // Aggregate data for each day
  return days.map(date => {
    const dayKey = format(startOfDay(date), 'yyyy-MM-dd');
    const dayEntries = entriesByDay.get(dayKey) || [];
    
    // Sum all water intake for the day (convert ml to liters)
    const totalLiters = dayEntries.reduce((sum, entry) => {
      const liters = entry.amount ? entry.amount / 1000 : (entry.liters || 0);
      return sum + liters;
    }, 0);

    return {
      date: dayKey,
      dateObj: date,
      liters: totalLiters,
      goal,
    };
  });
}

/**
 * Calculate statistics for sleep data
 */
export function calculateSleepStats(data: DailySleepData[]) {
  const hours = data.map(d => d.hours).filter(h => h > 0);
  if (hours.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0,
      goalAchievement: 0,
      consistency: 0,
    };
  }

  const average = hours.reduce((sum, h) => sum + h, 0) / hours.length;
  const min = Math.min(...hours);
  const max = Math.max(...hours);
  
  const goal = data[0]?.goal;
  const goalAchievement = goal
    ? (hours.filter(h => h >= goal).length / hours.length) * 100
    : 0;

  // Consistency: percentage of days with data
  const consistency = (hours.length / data.length) * 100;

  return {
    average: Math.round(average * 10) / 10,
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    goalAchievement: Math.round(goalAchievement),
    consistency: Math.round(consistency),
  };
}

/**
 * Calculate statistics for water data
 */
export function calculateWaterStats(data: DailyWaterData[]) {
  const liters = data.map(d => d.liters).filter(l => l > 0);
  if (liters.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0,
      goalAchievement: 0,
      consistency: 0,
    };
  }

  const average = liters.reduce((sum, l) => sum + l, 0) / liters.length;
  const min = Math.min(...liters);
  const max = Math.max(...liters);
  
  const goal = data[0]?.goal;
  const goalAchievement = goal
    ? (liters.filter(l => l >= goal).length / liters.length) * 100
    : 0;

  // Consistency: percentage of days with data
  const consistency = (liters.length / data.length) * 100;

  return {
    average: Math.round(average * 10) / 10,
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    goalAchievement: Math.round(goalAchievement),
    consistency: Math.round(consistency),
  };
}

/**
 * Get date range based on days back
 */
export function getDateRange(daysBack: number): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);
  startDate.setHours(0, 0, 0, 0);

  return { startDate, endDate };
}

/**
 * Format date for chart display
 */
export function formatChartDate(date: Date, daysBack: number): string {
  if (daysBack <= 7) {
    return format(date, 'EEE'); // Mon, Tue, etc.
  } else if (daysBack <= 30) {
    return format(date, 'MMM d'); // Jan 1, Jan 2, etc.
  } else {
    return format(date, 'MMM d'); // Jan 1, etc.
  }
}

// Activity interfaces
export interface DailyActivityData {
  date: string;
  dateObj: Date;
  minutes: number;
  calories?: number;
}

export interface ActivityTypeData {
  name: string;
  totalMinutes: number;
  count: number;
  totalCalories: number;
}

// Diet interfaces
export interface DailyDietData {
  date: string;
  dateObj: Date;
  calories: number;
  mealCount: number;
}

export interface MealTypeData {
  mealType: string;
  count: number;
  totalCalories: number;
  averageCalories: number;
}

/**
 * Aggregate activity data by day
 */
export function aggregateActivityByDay(
  activities: Activity[],
  startDate: Date,
  endDate: Date
): DailyActivityData[] {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Group entries by day
  const entriesByDay = new Map<string, Activity[]>();
  activities.forEach(entry => {
    const dayKey = format(startOfDay(entry.entryDate), 'yyyy-MM-dd');
    if (!entriesByDay.has(dayKey)) {
      entriesByDay.set(dayKey, []);
    }
    entriesByDay.get(dayKey)!.push(entry);
  });

  // Aggregate data for each day
  return days.map(date => {
    const dayKey = format(startOfDay(date), 'yyyy-MM-dd');
    const dayEntries = entriesByDay.get(dayKey) || [];
    
    // Sum all activity minutes for the day
    const totalMinutes = dayEntries.reduce((sum, entry) => {
      return sum + (entry.duration || 0);
    }, 0);

    // Sum all calories burned for the day
    const totalCalories = dayEntries.reduce((sum, entry) => {
      return sum + (entry.caloriesBurned || 0);
    }, 0);

    return {
      date: dayKey,
      dateObj: date,
      minutes: totalMinutes,
      calories: totalCalories > 0 ? totalCalories : undefined,
    };
  });
}

/**
 * Group activities by type
 */
export function groupActivitiesByType(activities: Activity[]): ActivityTypeData[] {
  const activityMap = new Map<string, { minutes: number; count: number; calories: number }>();
  
  activities.forEach(activity => {
    const name = activity.name || 'Unknown';
    const existing = activityMap.get(name) || { minutes: 0, count: 0, calories: 0 };
    
    activityMap.set(name, {
      minutes: existing.minutes + (activity.duration || 0),
      count: existing.count + 1,
      calories: existing.calories + (activity.caloriesBurned || 0),
    });
  });

  return Array.from(activityMap.entries())
    .map(([name, data]) => ({
      name,
      totalMinutes: data.minutes,
      count: data.count,
      totalCalories: data.calories,
    }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes); // Sort by total minutes
}

/**
 * Aggregate diet data by day
 */
export function aggregateDietByDay(
  diets: Diet[],
  startDate: Date,
  endDate: Date
): DailyDietData[] {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Group entries by day
  const entriesByDay = new Map<string, Diet[]>();
  diets.forEach(entry => {
    const dayKey = format(startOfDay(entry.entryDate), 'yyyy-MM-dd');
    if (!entriesByDay.has(dayKey)) {
      entriesByDay.set(dayKey, []);
    }
    entriesByDay.get(dayKey)!.push(entry);
  });

  // Aggregate data for each day
  return days.map(date => {
    const dayKey = format(startOfDay(date), 'yyyy-MM-dd');
    const dayEntries = entriesByDay.get(dayKey) || [];
    
    // Sum all calories for the day
    const totalCalories = dayEntries.reduce((sum, entry) => {
      return sum + (entry.calories || 0);
    }, 0);

    return {
      date: dayKey,
      dateObj: date,
      calories: totalCalories,
      mealCount: dayEntries.length,
    };
  });
}

/**
 * Group diets by meal type
 */
export function groupDietsByMealType(diets: Diet[]): MealTypeData[] {
  const mealMap = new Map<string, { count: number; totalCalories: number }>();
  
  diets.forEach(diet => {
    const mealType = diet.mealType || 'Unknown';
    const existing = mealMap.get(mealType) || { count: 0, totalCalories: 0 };
    
    mealMap.set(mealType, {
      count: existing.count + 1,
      totalCalories: existing.totalCalories + (diet.calories || 0),
    });
  });

  return Array.from(mealMap.entries())
    .map(([mealType, data]) => ({
      mealType,
      count: data.count,
      totalCalories: data.totalCalories,
      averageCalories: data.count > 0 ? Math.round(data.totalCalories / data.count) : 0,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count
}

/**
 * Calculate statistics for activity data
 */
export function calculateActivityStats(data: DailyActivityData[]) {
  const minutes = data.map(d => d.minutes).filter(m => m > 0);
  const calories = data.map(d => d.calories).filter((c): c is number => c !== undefined && c > 0);
  
  if (minutes.length === 0) {
    return {
      totalMinutes: 0,
      averageMinutes: 0,
      minMinutes: 0,
      maxMinutes: 0,
      totalCalories: 0,
      averageCalories: 0,
      consistency: 0,
    };
  }

  const totalMinutes = minutes.reduce((sum, m) => sum + m, 0);
  const averageMinutes = totalMinutes / minutes.length;
  const minMinutes = Math.min(...minutes);
  const maxMinutes = Math.max(...minutes);
  
  const totalCalories = calories.reduce((sum, c) => sum + c, 0);
  const averageCalories = calories.length > 0 ? totalCalories / calories.length : 0;

  // Consistency: percentage of days with activity
  const consistency = (minutes.length / data.length) * 100;

  return {
    totalMinutes: Math.round(totalMinutes),
    averageMinutes: Math.round(averageMinutes * 10) / 10,
    minMinutes: Math.round(minMinutes),
    maxMinutes: Math.round(maxMinutes),
    totalCalories: Math.round(totalCalories),
    averageCalories: Math.round(averageCalories * 10) / 10,
    consistency: Math.round(consistency),
  };
}

/**
 * Calculate statistics for diet data
 */
export function calculateDietStats(data: DailyDietData[]) {
  const calories = data.map(d => d.calories).filter(c => c > 0);
  const mealCounts = data.map(d => d.mealCount).filter(m => m > 0);
  
  if (calories.length === 0) {
    return {
      totalCalories: 0,
      averageCalories: 0,
      minCalories: 0,
      maxCalories: 0,
      totalMeals: 0,
      averageMealsPerDay: 0,
      consistency: 0,
    };
  }

  const totalCalories = calories.reduce((sum, c) => sum + c, 0);
  const averageCalories = totalCalories / calories.length;
  const minCalories = Math.min(...calories);
  const maxCalories = Math.max(...calories);
  
  const totalMeals = mealCounts.reduce((sum, m) => sum + m, 0);
  const averageMealsPerDay = mealCounts.length > 0 ? totalMeals / mealCounts.length : 0;

  // Consistency: percentage of days with diet entries
  const consistency = (calories.length / data.length) * 100;

  return {
    totalCalories: Math.round(totalCalories),
    averageCalories: Math.round(averageCalories * 10) / 10,
    minCalories: Math.round(minCalories),
    maxCalories: Math.round(maxCalories),
    totalMeals: Math.round(totalMeals),
    averageMealsPerDay: Math.round(averageMealsPerDay * 10) / 10,
    consistency: Math.round(consistency),
  };
}

