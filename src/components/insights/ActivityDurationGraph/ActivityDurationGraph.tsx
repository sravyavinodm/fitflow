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
import { DailyActivityData } from '../../../utils/insightsHelpers';
import { formatChartDate } from '../../../utils/insightsHelpers';
import './ActivityDurationGraph.css';

interface ActivityDurationGraphProps {
  data: DailyActivityData[];
  daysBack: number;
}

const ActivityDurationGraph: React.FC<ActivityDurationGraphProps> = ({ data, daysBack }) => {
  // Prepare chart data
  const chartData = data.map(item => ({
    date: formatChartDate(item.dateObj, daysBack),
    fullDate: item.date,
    minutes: Math.round(item.minutes),
  }));

  return (
    <div className="activity-duration-graph-container">
      <h3 className="graph-title">Activity Duration</h3>
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
            label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'var(--text-color)' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-color)',
            }}
            labelStyle={{ color: 'var(--text-color)' }}
            formatter={(value: number) => [`${value} min`, 'Activity']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend wrapperStyle={{ color: 'var(--text-color)' }} />
          <Line
            type="monotone"
            dataKey="minutes"
            stroke="var(--activity-color)"
            strokeWidth={2}
            dot={{ fill: 'var(--activity-color)', r: 4 }}
            activeDot={{ r: 6, fill: 'var(--activity-color)' }}
            name="Minutes"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityDurationGraph;

