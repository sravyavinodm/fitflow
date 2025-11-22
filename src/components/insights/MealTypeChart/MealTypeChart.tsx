import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { MealTypeData } from '../../../utils/insightsHelpers';
import './MealTypeChart.css';

interface MealTypeChartProps {
  data: MealTypeData[];
}

const MEAL_COLORS: { [key: string]: string } = {
  'Breakfast': '#FF9800',
  'Lunch': '#4CAF50',
  'Dinner': '#9C27B0',
  'Snacks': '#FF5722',
};

const MealTypeChart: React.FC<MealTypeChartProps> = ({ data }) => {
  const renderCustomLabel = (entry: any) => {
    const total = data.reduce((sum, d) => sum + d.count, 0);
    const percent = ((entry.count / total) * 100).toFixed(0);
    return `${entry.mealType}: ${percent}%`;
  };

  return (
    <div className="meal-type-chart-container">
      <h3 className="graph-title">Meal Types</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data as any}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={MEAL_COLORS[entry.mealType] || `#${Math.floor(Math.random()*16777215).toString(16)}`} 
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-color)',
              }}
              labelStyle={{ color: 'var(--text-color)' }}
              formatter={(value: number, _name: string, props: any) => [
                `${value} meals (${props.payload.averageCalories} avg cal)`,
                props.payload.mealType,
              ]}
            />
            <Legend
              wrapperStyle={{ color: 'var(--text-color)' }}
              formatter={(value, entry: any) => `${value}: ${entry.payload.count} meals`}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="empty-chart">
          <p>No meal data available</p>
        </div>
      )}
    </div>
  );
};

export default MealTypeChart;

