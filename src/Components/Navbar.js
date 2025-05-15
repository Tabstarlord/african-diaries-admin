import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import wave from '../Assets/noto_waving-hand.png';
import search from '../Assets/Search.png';
import './Navbar.css';

function Navbar() {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState({ users: [], videos: [] });
  const [selectedDate, setSelectedDate] = useState('');
  const [activities, setActivities] = useState([]);

  // Fetch users and videos based on search input
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchInput.trim()) {
        setResults({ users: [], videos: [] });
        return;
      }

      const { data: users } = await supabase
        .from('profile')
        .select('id, username, email')
        .ilike('username', `%${searchInput}%`);

      const { data: videos } = await supabase
        .from('videos')
        .select('id, title')
        .ilike('title', `%${searchInput}%`);

      setResults({ users: users || [], videos: videos || [] });
    };

    fetchSearchResults();
  }, [searchInput]);

  // Fetch all activities by selected date
  useEffect(() => {
    const fetchActivitiesByDate = async () => {
      if (!selectedDate) {
        setActivities([]);
        return;
      }

      const start = `${selectedDate}T00:00:00`;
      const end = `${selectedDate}T23:59:59`;

      const [viewLogsRes, loginLogsRes] = await Promise.all([
        supabase.from('views').select('video_id, viewed_at, user_id').gte('viewed_at', start).lte('viewed_at', end),
        supabase.from('login_logs').select('user_id, logged_in_at').gte('logged_in_at', start).lte('logged_in_at', end),
      ]);

      const viewLogs = viewLogsRes.data || [];
      const loginLogs = loginLogsRes.data || [];

      // Combine and sort by time (most recent first)
      const combined = [...viewLogs, ...loginLogs].sort((a, b) => {
        const aTime = a.viewed_at || a.logged_in_at;
        const bTime = b.viewed_at || b.logged_in_at;
        return new Date(bTime) - new Date(aTime);
      });

      setActivities(combined);
    };

    fetchActivitiesByDate();
  }, [selectedDate]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <span className="navbar-brand">
          Hey Emmyrazy <img className="navbar-brand-wave" src={wave} alt="wave" />
        </span>
        <p className="navbar-brand-p">Welcome back to your dashboard!</p>

        <form className="navbar-search" onSubmit={(e) => e.preventDefault()}>
          <img className="navbar-search-btn" src={search} alt="search" />
          <input
            className="navbar-input"
            type="search"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        {searchInput && (results.users.length > 0 || results.videos.length > 0) && (
          <div className="search-results">
            {results.users.length > 0 && (
              <div className="search-category">
                <h4>Users</h4>
                <ul>
                  {results.users.map((user) => (
                    <li key={user.id}>
                      <strong>{user.username}</strong> ({user.email})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.videos.length > 0 && (
              <div className="search-category">
                <h4>Videos</h4>
                <ul>
                  {results.videos.map((video) => (
                    <li key={video.id}>{video.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* DATE PICKER */}
        <div className="navbar-date-calendar">
          <label className="navbar-date">
            <input
              type="date"
              className="date-picker-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </label>
        </div>
      </div>

      {selectedDate && (
        <div className="activity-results">
          <h4>Activities on {selectedDate}</h4>
          {activities.length > 0 ? (
            <ul>
              {activities.map((act, idx) => (
                <li key={idx}>
                  {act.viewed_at
                    ? `User ${act.user_id} viewed video ${act.video_id} at ${new Date(act.viewed_at).toLocaleTimeString()}`
                    : `User ${act.user_id} logged in at ${new Date(act.logged_in_at).toLocaleTimeString()}`}
                </li>
              ))}
            </ul>
          ) : (
            <p>No activity recorded on this day.</p>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
