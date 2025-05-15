import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import supabase from '../supabaseClient';

ChartJS.register(ArcElement, Tooltip);

const countryNames = {
  NG: 'Nigeria',
  US: 'United States',
  GB: 'United Kingdom',
  GH: 'Ghana',
  MX: 'Mexico',
  CA: 'Canada',
  IN: 'India',
  // Add more as needed
};

const TrafficChart = () => {
  const chartRef = useRef(null);
  const solidColors = useMemo(() => ['#A8C5DA', '#A1E3CB', '#B1E3FF'], []);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: [], hoverOffset: 8 }],
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('traffic_by_country')
        .select('country, views');

      if (error) {
        console.error('Error fetching traffic data:', error);
        return;
      }

      if (!data || data.length === 0) return;

      const totalViews = data.reduce((sum, row) => sum + row.views, 0);

      const labels = data.map(row => countryNames[row.country] || row.country);
      const percentages = data.map(row =>
        ((row.views / totalViews) * 100).toFixed(1)
      );

      const chart = chartRef.current;
      if (!chart) return;

      const ctx = chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 120);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(1, '#1C1C1C99');

      const backgroundColor = [gradient, ...solidColors.slice(0, percentages.length - 1)];

      setChartData({
        labels,
        datasets: [
          {
            data: percentages,
            backgroundColor,
            hoverOffset: 8,
          },
        ],
      });
    };

    fetchData();
  }, [solidColors]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => `${context.label}: ${context.parsed}%`,
        },
      },
    },
    cutout: '40%',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <h1 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '20px', marginTop: '-0.5rem' }}>
        Users by Location
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '180px', height: '180px' }}>
          <Doughnut ref={chartRef} data={chartData} options={options} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {chartData.labels.map((label, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                width: '160px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor:
                      index === 0 ? '#00000099' : solidColors[index - 1] || '#ccc',
                    borderRadius: '50%',
                  }}
                />
                <span>{label}</span>
              </div>
              <span>{chartData.datasets[0].data[index]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrafficChart;
