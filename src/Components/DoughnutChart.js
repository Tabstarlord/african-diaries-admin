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
    cutout: '50%%',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: false,
          PointStyle: 'square',
          boxWidth: 20,
          boxHeight: 20,
          padding: 20,
          font: {
            size: 15
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
    <div style={{position: 'relative', width: '90%', height: '90%', margin: '0 auto'}}>
      <Doughnut data={data} options={options} />
      
    </div>
  );
};

export default DoughnutChart;
