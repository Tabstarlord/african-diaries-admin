import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { device: 'Linux', traffic: 10000, color: '#95A4FC' },
  { device: 'IOS', traffic: 25000, color: '#BAEDBD' },
  { device: 'Mac', traffic: 15000, color: '#000000' },
  { device: 'Android', traffic: 30000, color: '#B1E3FF' },
  { device: 'Windows', traffic: 5000, color: '#A8C5DA' },
  { device: 'Other', traffic: 20000, color: '#A1E3CB' },
];

const TrafficByDeviceChart = () => {
  return (
    <div
      style={{
        width: '100%',
        float: 'left',
        height: 245,
        borderRadius: 12,
        overflow: 'hidden',

      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: -10, left: -15, bottom: 20 }} // 👈 chart padding inside here
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false} />
          <XAxis dataKey="device" tick={{ fontSize: 14 }} />
          <YAxis tickFormatter={(value) => `${value / 1000}k`} tick={{ fontSize: 14 }} />
          <Tooltip
            formatter={(value) => `${value / 1000}k`}
            contentStyle={{ fontSize: '14px' }}
          />
          <Bar dataKey="traffic" radius={[8, 8, 0, 0]} barSize={50}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficByDeviceChart;
