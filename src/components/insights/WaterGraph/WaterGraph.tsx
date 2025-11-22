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
import { DailyWaterData } from '../../../utils/insightsHelpers';
import { formatChartDate } from '../../../utils/insightsHelpers';
import './WaterGraph.css';

interface WaterGraphProps {
  data: DailyWaterData[];
  daysBack: number;
  goal?: number;
}

const WaterGraph: React.FC<WaterGraphProps> = ({ data, daysBack, goal }) => {
  // Prepare chart data
  const chartData = data.map(item => ({
    date: formatChartDate(item.dateObj, daysBack),
    fullDate: item.date,
    liters: Math.round(item.liters * 10) / 10,
    goal: goal || 0,
  }));

  return (
    <div className="water-graph-container">
      <h3 className="graph-title">Water Intake</h3>
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
            label={{ value: 'Liters', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'var(--text-color)' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-color)',
            }}
            labelStyle={{ color: 'var(--text-color)' }}
            formatter={(value: number) => [`${value} L`, 'Water']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend wrapperStyle={{ color: 'var(--text-color)' }} />
          {goal && goal > 0 && (
            <ReferenceLine
              y={goal}
              stroke="var(--success-color)"
              strokeDasharray="5 5"
              label={{ value: `Goal: ${goal}L`, position: 'right', style: { fill: 'var(--text-secondary)' } }}
            />
          )}
          <Line
            type="monotone"
            dataKey="liters"
            stroke="var(--water-color)"
            strokeWidth={2}
            dot={{ fill: 'var(--water-color)', r: 4 }}
            activeDot={{ r: 6, fill: 'var(--water-color)' }}
            name="Water (Liters)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaterGraph;

