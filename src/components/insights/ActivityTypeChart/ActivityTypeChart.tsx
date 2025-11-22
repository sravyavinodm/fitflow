import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { ActivityTypeData } from '../../../utils/insightsHelpers';
import './ActivityTypeChart.css';

interface ActivityTypeChartProps {
  data: ActivityTypeData[];
}

const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

const ActivityTypeChart: React.FC<ActivityTypeChartProps> = ({ data }) => {
  // Take top 8 activities for better visualization
  const topActivities = data.slice(0, 8);
  
  // Group others if there are more than 8
  const others = data.slice(8);
  const othersTotal = others.reduce((sum, item) => sum + item.totalMinutes, 0);
  
  const chartData = othersTotal > 0
    ? [...topActivities, { name: 'Others', totalMinutes: othersTotal, count: others.length }]
    : topActivities;

  const renderCustomLabel = (entry: any) => {
    const total = chartData.reduce((sum, d) => sum + d.totalMinutes, 0);
    const percent = total > 0 ? ((entry.totalMinutes / total) * 100).toFixed(0) : '0';
    return Number(percent) > 5 ? `${entry.name}: ${percent}%` : '';
  };

  return (
    <div className="activity-type-chart-container">
      <h3 className="graph-title">Activity Types</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData as any}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="totalMinutes"
            >
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                `${value} min (${props.payload.count} times)`,
                props.payload.name,
              ]}
            />
            <Legend
              wrapperStyle={{ color: 'var(--text-color)' }}
              formatter={(value, entry: any) => `${value}: ${entry.payload?.totalMinutes || 0} min`}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="empty-chart">
          <p>No activity data available</p>
        </div>
      )}
    </div>
  );
};

export default ActivityTypeChart;

