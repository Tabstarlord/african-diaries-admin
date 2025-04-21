import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const data = {
    labels: ['Straight 60.9%', 'Gay 27%', 'Trans 12.1%'],
    datasets: [
      {
        data: [30, 20, 15], // Total should be 100%
        backgroundColor: [
          '#5B93FF',
          '#FF8F6B',
          '#FFd66b'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: false,
          PointStyle: 'square',
          boxWidth: 10,
          boxHeight: 10,
          padding: 12,
          font: {
            size: 10
          },
          
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '1rem' }}>
      <Doughnut data={data} options={options} />
      
    </div>
  );
};

export default DoughnutChart;
