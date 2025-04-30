import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import supabase from '../supabaseClient'; // Adjust path

const COLORS = {
  Linux: '#95A4FC',
  iOS: '#BAEDBD',
  Mac: '#000000',
  Android: '#B1E3FF',
  Windows: '#A8C5DA',
  Other: '#A1E3CB',
};

const TrafficByDeviceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDeviceData = async () => {
      const { data, error } = await supabase
        .from('views_by_device')
        .select('device');

      if (error) {
        console.error('Error fetching device data:', error);
        return;
      }

      const counts = {};

      data.forEach((row) => {
        counts[row.device] = (counts[row.device] || 0) + 1;
      });

      const chartData = Object.keys(COLORS).map((device) => ({
        device,
        traffic: counts[device] || 0,
        color: COLORS[device],
      }));

      setData(chartData);
    };

    fetchDeviceData();
  }, []);

  return (
    <div style={{ width: '100%', float: 'left', height: 245, borderRadius: 12, overflow: 'hidden' }}>
      <h1 style={{ fontSize: '16px', fontWeight: '500', marginTop: '-0.1rem', float: 'left' }}>Traffic By Device</h1>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: -10, left: -15, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false} />
          <XAxis dataKey="device" tick={{ fontSize: 14 }} />
          <YAxis tickFormatter={(value) => `${value} views`} tick={{ fontSize: 14 }} />
          <Tooltip formatter={(value) => `${value} views`} contentStyle={{ fontSize: '14px' }} />
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
