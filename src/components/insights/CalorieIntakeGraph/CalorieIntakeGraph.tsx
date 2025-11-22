import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DailyDietData } from '../../../utils/insightsHelpers';
import { formatChartDate } from '../../../utils/insightsHelpers';
import './CalorieIntakeGraph.css';

interface CalorieIntakeGraphProps {
  data: DailyDietData[];
  daysBack: number;
}

const CalorieIntakeGraph: React.FC<CalorieIntakeGraphProps> = ({ data, daysBack }) => {
  // Prepare chart data
  const chartData = data.map(item => ({
    date: formatChartDate(item.dateObj, daysBack),
    fullDate: item.date,
    calories: Math.round(item.calories),
  }));

  return (
    <div className="calorie-intake-graph-container">
      <h3 className="graph-title">Calorie Intake</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} />
          <XAxis 
            dataKey="date" 
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
            formatter={(value: number) => [`${value} cal`, 'Calories']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend wrapperStyle={{ color: 'var(--text-color)' }} />
          <Line
            type="monotone"
            dataKey="calories"
            stroke="var(--diet-color)"
            strokeWidth={2}
            dot={{ fill: 'var(--diet-color)', r: 4 }}
            activeDot={{ r: 6, fill: 'var(--diet-color)' }}
            name="Calories"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CalorieIntakeGraph;

