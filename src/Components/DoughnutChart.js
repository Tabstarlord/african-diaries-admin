import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import supabase from '../supabaseClient';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchCategoryViews = async () => {
      const { data, error } = await supabase
        .rpc('get_category_views'); // assumes you use a Supabase function to group views by category

      if (error) {
        console.error('Error fetching category views:', error);
        return;
      }

      const totalViews = data.reduce((sum, item) => sum + item.total_views, 0);

      const labels = data.map(item => {
        const percentage = ((item.total_views / totalViews) * 100).toFixed(1);
        return `${item.category} ${percentage}%`;
      });

      const values = data.map(item => item.total_views);

      setChartData({
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              '#5B93FF', '#FF8F6B', '#FFD66B', '#8AFF8A', '#FF6BCB', '#8C52FF'
            ],
            borderWidth: 1
          }
        ]
      });
    };

    fetchCategoryViews();
  }, []);

  const options = {
    cutout: '50%',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 20,
          padding: 20,
          font: { size: 15 }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}`;
          }
        }
      }
    }
  };

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div style={{ position: 'relative', width: '90%', height: '90%', margin: '0 auto' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
