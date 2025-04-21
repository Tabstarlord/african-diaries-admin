import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ViewsAreaChart = ({ data }) => {
  return (
    <div style={{ width: '105%', height: 300 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart
          data={data}
          margin={{ top: 10, right: -10, left: -10, bottom: 0 }}
        
        >
          <defs>
            <linearGradient id="colorViews" x1="1" y1="1" x2="0" y2="1">
              <stop offset="10%" stopColor="hsla(202, 100.00%, 68.40%, 0.10)" stopOpacity={1} />
              <stop offset="60%" stopColor="rgba(247, 207, 240, 0.32)" stopOpacity={1} />
            </linearGradient>
            <linearGradient id='lineGradient' x1='0' y1='0' x2='1' y2='0'>
              <stop offset='10%' stopColor="#FF5BEF" />
              <stop offset='60%' stopColor=" #5BC4FF" />
            </linearGradient>
          </defs>
          <XAxis dataKey="hour" padding={{left: 0, right: 25}} fontSize='11.18px' fontWeight='400'/>
          <YAxis fontSize='11.18px' fontFamily='DM Sans,sans serif' tickFormatter={(value) => `${value / 1}k`} domain={[10, 100, 'dataMin', 'dataMax']} tickCount={10} />
          <CartesianGrid  strokeDasharray='0 0' horizontal={true} vertical={false}  />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="views"
            stroke="url(#lineGradient)"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorViews)"
            dot={{ r: 6, stroke: '#ae8ff7', strokeWidth: 2.79, fill: '#fff' }}
          />
          
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ViewsAreaChart;



/*import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineGraph = () => {
  const sampleData = [43, 40, 50, 40, 70, 40, 45, 33, 40, 60, 40, 50, 36];

  const canvasData = {
 
    datasets: [
      {
        label: "Home",
        borderColor: "#5EC3FF",
        pointRadius: 0,
        fill: 'origin',
        backgroundColor: 'rgba(247, 207, 240, 0.45)',
        lineTension: 0.4,
        data: sampleData,
        borderWidth: 4,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          stepSize: 3,
        },
        grid: {
          display: false,
        },
        labels:  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        ticks: {
          color: "red",
          font: {
            family: "DM Sans",
            size: 12,
          },
        },
        
      },
      y: {
        grid: {
          display: true,
        },
        border: {
          display: false,
        },
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
          color: "green",
          font: {
            family: "DM Sans, sans-serif",
            size: 12, 
          },
        },
      
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  const graphStyle = {
    minHeight: "20rem",
    maxWidth: "600px",
    backgroundColor: '#fff',
    borderRadius: "0.375rem",
    padding: "0.5rem 0rem 0.5rem 4rem",
  };

  return (
    <div style={graphStyle}>
      <Line id="home" options={options} data={canvasData} />
    </div>
  );
};

export default LineGraph;*/