import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
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

function Dashboard() {
  const [hourlyVisits, setHourlyVisits] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [todaysViews, setTodaysViews] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0]; // e.g. 2025-04-29
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();

      // 1. Total Views from videos table
      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select('view_count');

      if (videos && !videosError) {
        const total = videos.reduce((acc, video) => acc + (video.view_count || 0), 0);
        setTotalViews(total);
      }

      // 2. Today's Views from video_views table
      const { count: todayViewsCount, error: viewsError } = await supabase
        .from('video_views')
        .select('*', { count: 'exact', head: true })
        .gte('viewed_at', `${today}T00:00:00`)
        .lte('viewed_at', `${today}T23:59:59`);

      if (!viewsError) {
        setTodaysViews(todayViewsCount || 0);
      }

      // 3. Total Users from profiles
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (!userError) {
        setTotalUsers(userCount || 0);
      }

      // 4. Active Users in last 10 minutes
      const { count: activeCount, error: activeError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_seen', tenMinutesAgo);

      if (!activeError) {
        setActiveUsers(activeCount || 0);
      }
    };

    fetchStats();

    // Optional: Refresh every 5 mins
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchVisits = async () => {
      const { data, error } = await supabase
        .from('site_visits')
        .select('hour, visits')
        .order('hour', { ascending: true });

      if (!error) setHourlyVisits(data);
    };

    fetchVisits();
  }, []);

  return (
    <section className="dashboard">
      <div className="dashbord-container">
        <h1 className="dashboard-header">Dashboard</h1>

        <div className="dashboard-container-1">
          <div className="dashboard-card">
            <img src={view} alt="Total Views" />
            <span className="dashboard-label">Total Views</span>
            <span className="dashboard-value">{totalViews.toLocaleString()}</span>
            <p className="dashboard-refresh">
              Refreshed just now
              <img src={refresh} alt="Refresh" />
            </p>
          </div>

          <div className="dashboard-card">
            <img src={view2} alt="Today's Views" />
            <span className="dashboard-label">Today's Views</span>
            <span className="dashboard-value">{todaysViews.toLocaleString()}</span>
            <p className="dashboard-refresh">
              Refreshed just now
              <img src={refresh} alt="Refresh" />
            </p>
          </div>

          <div className="dashboard-card">
            <img src={view3} alt="Total Users" />
            <span className="dashboard-label">Total Users</span>
            <span className="dashboard-value">{totalUsers.toLocaleString()}</span>
          </div>

          <div className="dashboard-card">
            <img src={active} alt="Active Users" />
            <span className="dashboard-label">Active Users</span>
            <span className="dashboard-value">{activeUsers.toLocaleString()}</span>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart1">
            <h1 className="chart-header">User Most Active Time</h1>
            <Linechart data={hourlyVisits} />
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
