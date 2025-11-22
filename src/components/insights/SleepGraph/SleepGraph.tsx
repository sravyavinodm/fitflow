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
  ReferenceLine,
} from 'recharts';
import { DailySleepData } from '../../../utils/insightsHelpers';
import { formatChartDate } from '../../../utils/insightsHelpers';
import './SleepGraph.css';

interface SleepGraphProps {
  data: DailySleepData[];
  daysBack: number;
  goal?: number;
}

const SleepGraph: React.FC<SleepGraphProps> = ({ data, daysBack, goal }) => {
  // Prepare chart data
  const chartData = data.map(item => ({
    date: formatChartDate(item.dateObj, daysBack),
    fullDate: item.date,
    hours: Math.round(item.hours * 10) / 10,
    goal: goal || 0,
  }));

  return (
    <div className="sleep-graph-container">
      <h3 className="graph-title">Sleep Hours</h3>
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
            label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'var(--text-color)' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-color)',
            }}
            labelStyle={{ color: 'var(--text-color)' }}
            formatter={(value: number) => [`${value} hrs`, 'Sleep']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend wrapperStyle={{ color: 'var(--text-color)' }} />
          {goal && goal > 0 && (
            <ReferenceLine
              y={goal}
              stroke="var(--success-color)"
              strokeDasharray="5 5"
              label={{ value: `Goal: ${goal}h`, position: 'right', style: { fill: 'var(--text-secondary)' } }}
            />
          )}
          <Line
            type="monotone"
            dataKey="hours"
            stroke="var(--primary-color)"
            strokeWidth={2}
            dot={{ fill: 'var(--primary-color)', r: 4 }}
            activeDot={{ r: 6, fill: 'var(--primary-color)' }}
            name="Sleep Hours"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SleepGraph;

