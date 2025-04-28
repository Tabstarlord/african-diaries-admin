import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { useEffect, useMemo, useRef, useState } from 'react';

ChartJS.register(ArcElement, Tooltip);

const TrafficChart = () => {
  const chartRef = useRef(null);

  // UseMemo to memoize `labels` and `solidColors` to avoid unnecessary re-renders
  const labels = useMemo(() => ['Nigeria', 'Ghana', 'Mexico', 'Other'], []);
  const solidColors = useMemo(() => ['#A8C5DA', '#A1E3CB', '#B1E3FF'], []);

  // Initial dataset
  const [chartData, setChartData] = useState({
    labels,
    datasets: [
      {
        data: [38.6, 22.5, 30.8, 87],
        backgroundColor: [], // Will be filled with gradient and solid colors
        hoverOffset: 8,
      },
    ],
  });

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;

    // Create gradient for the first slice
    const gradient = ctx.createLinearGradient(0, 0, 0, 120);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(1, '#1C1C1C99');
    gradient.addColorStop(1, '#00000099');

    // Combine gradient and solid colors
    const updatedColors = [gradient, ...solidColors];

    setChartData((prev) => ({
      ...prev,
      datasets: [
        {
          ...prev.datasets[0],
          backgroundColor: updatedColors,
        },
      ],
    }));
  }, [solidColors, labels]); // ✅ Proper ESLint fix

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        bodyFont: { size: 10 },
        titleFont: { size: 10 },
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}%`,
        },
      },
    },
    cutout: '40%',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <h1 style={{ fontSize: '14px', marginBottom: '20px', marginTop: '-0.5rem' }}>Traffic by Location</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '180px', height: '180px' }}>
          <Doughnut ref={chartRef} data={chartData} options={options} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {labels.map((label, index) => (
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: index === 0 ? '#00000099' : solidColors[index - 1],
                    borderRadius: '50%',
                    marginRight: '2px',
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
