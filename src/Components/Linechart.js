import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import supabase from '../supabaseClient'; // adjust path as needed

const ViewsAreaChart = () => {
  const [data, setData] = useState([]);

  const fetchTotalUsersByHour = async () => {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('created_at');

    if (error) {
      console.error('Error fetching user data:', error.message);
      return;
    }

    // Group users by hour of signup
    const hourlyCount = {};

    profiles.forEach(({ created_at }) => {
      const hour = new Date(created_at).getHours();
      const hourLabel = `${hour.toString().padStart(2, '0')}:00`;

      if (!hourlyCount[hourLabel]) {
        hourlyCount[hourLabel] = 0;
      }
      hourlyCount[hourLabel]++;
    });

    // Convert to chart data format
    const chartData = Object.entries(hourlyCount)
      .map(([hour, count]) => ({ hour, visits: count }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    setData(chartData);
  };

  useEffect(() => {
    fetchTotalUsersByHour();

    // Refresh data every hour
    const interval = setInterval(fetchTotalUsersByHour, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5BC4FF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FF5BEF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF5BEF" />
              <stop offset="100%" stopColor="#5BC4FF" />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="hour"
            fontSize="12px"
            fontWeight="400"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            fontSize="12px"
            fontFamily="DM Sans, sans-serif"
            tickFormatter={(value) => `${value}`}
            domain={['auto', 'auto']}
            tickCount={8}
            tickLine={false}
            axisLine={false}
          />
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="visits"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorViews)"
            dot={{ r: 4, stroke: '#ae8ff7', strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ViewsAreaChart;
