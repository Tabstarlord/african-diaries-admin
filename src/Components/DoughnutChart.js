import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import  supabase from '../supabaseClient'; // <-- import your supabase client here
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
        .from('category_views')
        .select('category, view_count');

      if (error) {
        console.error('Error fetching category views:', error);
        return;
      }

      // Calculate total views
      const totalViews = data.reduce((sum, item) => sum + item.view_count, 0);

      // Build chart labels and datasets
      const labels = data.map(item => {
        const percentage = ((item.view_count / totalViews) * 100).toFixed(1);
        return `${item.category} ${percentage}%`;
      });

      const values = data.map(item => item.view_count);

      setChartData({
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              '#5B93FF', '#FF8F6B', '#FFd66b', '#8AFF8A', '#FF6BCB' // Add more if needed
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
          usePointStyle: false,
          boxWidth: 20,
          boxHeight: 20,
          padding: 20,
          font: {
            size: 15
          }
        },
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
    <div style={{position: 'relative', width: '90%', height: '90%', margin: '0 auto'}}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
