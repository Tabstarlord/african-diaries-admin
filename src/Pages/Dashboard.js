import React, { useEffect, useState, useCallback } from 'react';
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
  const [lastRefreshed, setLastRefreshed] = useState({
    views: '',
    today: '',
    users: '',
    active: '',
  });

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const refreshTotalViews = useCallback(async () => {
    const { count, error } = await supabase
      .from('video_views')
      .select('*', { count: 'exact', head: true });
  
    if (!error) {
      setTotalViews(count || 0);
      setLastRefreshed(prev => ({ ...prev, views: getCurrentTime() }));
    }
  }, []);
  
  const refreshTodaysViews = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    const { count, error } = await supabase
      .from('video_views')
      .select('*', { count: 'exact', head: true })
      .gte('viewed_at', `${today}T00:00:00`)
      .lte('viewed_at', `${today}T23:59:59`);
  
    if (!error) {
      setTodaysViews(count || 0);
      setLastRefreshed(prev => ({ ...prev, today: getCurrentTime() }));
    }
  }, []);
  
  const refreshActiveUsers = useCallback(async () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen_at', tenMinutesAgo);
  
    if (!error) {
      setActiveUsers(count || 0);
      setLastRefreshed(prev => ({ ...prev, active: getCurrentTime() }));
    }
  }, []);
  
  const fetchTotalUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('count_users');
      if (!error) {
        setTotalUsers(data || 0);
        setLastRefreshed(prev => ({ ...prev, users: getCurrentTime() }));
      }
    } catch (err) {
      console.error('Unexpected Error:', err.message);
    }
  }, []);
  

  useEffect(() => {
    refreshTotalViews();
    refreshTodaysViews();
    refreshActiveUsers();
    fetchTotalUsers();
  
    const fetchVisits = async () => {
      const { data, error } = await supabase
        .from('site_visits')
        .select('hour, visits')
        .order('hour', { ascending: true });
  
      if (!error) setHourlyVisits(data);
    };
  
    fetchVisits();
  
    const interval = setInterval(() => {
      refreshTodaysViews();
      refreshActiveUsers();
    }, 5 * 60 * 1000);
  
    const subscription = supabase
      .channel('realtime-users')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'profiles',
      }, fetchTotalUsers)
      .subscribe();
  
    return () => {
      clearInterval(interval);
      supabase.removeChannel(subscription);
    };
  }, [refreshTotalViews, refreshTodaysViews, refreshActiveUsers, fetchTotalUsers]);
  

  return (
    <section className="dashboard">
      <div className="dashbord-container">
        <h1 className="dashboard-header">Dashboard</h1>

        <div className="dashboard-container-1">
          <div className="dashboard-card">
            <img src={view} alt="Total Views" />
            <span className="dashboard-label">Total Views</span>
            <span className="dashboard-value">{totalViews.toLocaleString()}</span>
            <p className="dashboard-refresh" onClick={refreshTotalViews} style={{ cursor: 'pointer' }}>
              Refreshed at {lastRefreshed.views || '...'}
              <img src={refresh} alt="Refresh" />
            </p>
          </div>

          <div className="dashboard-card">
            <img src={view2} alt="Today's Views" />
            <span className="dashboard-label">Today's Views</span>
            <span className="dashboard-value">{todaysViews.toLocaleString()}</span>
            <p className="dashboard-refresh" onClick={refreshTodaysViews} style={{ cursor: 'pointer' }}>
              Refreshed at {lastRefreshed.today || '...'}
              <img src={refresh} alt="Refresh" />
            </p>
          </div>

          <div className="dashboard-card">
            <img src={view3} alt="Total Users" />
            <span className="dashboard-label">Total Users</span>
            <span className="dashboard-value">{totalUsers.toLocaleString()}</span>
            <p className="dashboard-refresh">
              Refreshed at {lastRefreshed.users || '...'}
            </p>
          </div>

          <div className="dashboard-card">
            <img src={active} alt="Active Users" />
            <span className="dashboard-label">Active Users</span>
            <span className="dashboard-value">{activeUsers.toLocaleString()}</span>
            <p className="dashboard-refresh" onClick={refreshActiveUsers} style={{ cursor: 'pointer' }}>
              Refreshed at {lastRefreshed.active || '...'}
              <img src={refresh} alt="Refresh" />
            </p>
          </div>
        </div>

        <div className='charts'>
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
      </div>
    </section>
  );
}

export default Dashboard;
