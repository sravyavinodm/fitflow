import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MealTypeData } from '../../../utils/insightsHelpers';
import './CaloriesPerMealChart.css';

interface CaloriesPerMealChartProps {
  data: MealTypeData[];
}

const CaloriesPerMealChart: React.FC<CaloriesPerMealChartProps> = ({ data }) => {
  // Sort by meal type order: Breakfast, Lunch, Dinner, Snacks
  const mealOrder = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const sortedData = [...data].sort((a, b) => {
    const indexA = mealOrder.indexOf(a.mealType);
    const indexB = mealOrder.indexOf(b.mealType);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="calories-per-meal-chart-container">
      <h3 className="graph-title">Average Calories per Meal Type</h3>
      {sortedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} />
            <XAxis 
              dataKey="mealType" 
              stroke="var(--text-color)"
              style={{ fontSize: '12px', fill: 'var(--text-color)' }}
            />
            <YAxis 
              stroke="var(--text-color)"
              style={{ fontSize: '12px', fill: 'var(--text-color)' }}
              label={{ value: 'Calories', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'var(--text-color)' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-color)',
              }}
              labelStyle={{ color: 'var(--text-color)' }}
              formatter={(value: number, _name: string, props: any) => [
                `${value} cal (${props.payload.count} meals)`,
                'Avg Calories',
              ]}
            />
            <Legend wrapperStyle={{ color: 'var(--text-color)' }} />
            <Bar 
              dataKey="averageCalories" 
              fill="var(--diet-color)"
              name="Average Calories"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="empty-chart">
          <p>No meal data available</p>
        </div>
      )}
    </div>
  );
};

export default CaloriesPerMealChart;

