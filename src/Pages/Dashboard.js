import React from 'react';
import './Dashboard.css';
import view from '../Assets/view-Icon.png';
import view2 from '../Assets/view-Icon2.png';
import view3 from '../Assets/view-Icon3.png';
import refresh from '../Assets/refresh-2.png';
import active from '../Assets/ph_clock-user-light.png';
import Linechart from '../Components/Linechart';
import DoughnutChart from '../Components/DoughnutChart';
import TrafficChart from '../Components/TrafficChart';
import TrafficByDeviceChart from '../Components/TrafficByDeviceChart';
import VideoPerformance from '../Components/VideoPerformance';
import RecentSignUps from '../Components/RecentSignIn';

const hourlyData = [
  { hour: '10am', views: 50 },
  { hour: '11am', views: 30 },
  { hour: '12am', views: 59 },
  { hour: '01am', views: 35 },
  { hour: '02am', views: 20 },
  { hour: '03am', views: 45 },
  { hour: '04am', views: 15 },
  { hour: '05am', views: 35 },
  { hour: '06am', views: 62 },
  { hour: '07am', views: 58 },
];

function Dashboard() {
  return (
    <section className="dashboard">
      <div className="dashbord-container">
        <h1 className="dashboard-header">Dashboard</h1>

        <div className="dashboard-container-1">
          <div className="dashboard-card">
            <img src={view} alt="Total Views" />
            <span className="dashboard-label">Total Views</span>
            <span className="dashboard-value">65.7M</span>
            <p className="dashboard-refresh">
              Refreshed just now
              <img src={refresh} alt="Refresh" />
            </p>
          </div>

          <div className="dashboard-card">
            <img src={view2} alt="Today's Views" />
            <span className="dashboard-label">Today's Views</span>
            <span className="dashboard-value">350K</span>
            <p className="dashboard-refresh">
              Refreshed just now
              <img src={refresh} alt="Refresh" />
            </p>
          </div>

          <div className="dashboard-card">
            <img src={view3} alt="Total Users" />
            <span className="dashboard-label">Total Users</span>
            <span className="dashboard-value">350.6K</span>
          </div>

          <div className="dashboard-card">
            <img src={active} alt="Active Users" />
            <span className="dashboard-label">Active Users</span>
            <span className="dashboard-value">200K</span>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart1">
            <h1 className="chart-header">User Most Active Time</h1>
            <Linechart data={hourlyData} />
          </div>

          <div className="chart2">
            <h1 className="chart-header">Viewed Categories</h1>
            <DoughnutChart />
          </div>
          </div>

          <div className="chart-section-2">
          <div className="chart3">
            <TrafficChart />
          </div>

          <div className="chart4">
            <TrafficByDeviceChart />
          </div>
          </div>

          <div className='chart-section-3'>
          <div className='chart5'>
            <VideoPerformance />
          </div>

          <div className='chart6'>
            <RecentSignUps />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
