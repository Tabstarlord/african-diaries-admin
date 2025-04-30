import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import wave from '../Assets/noto_waving-hand.png';

import search from '../Assets/Search.png';

import './Navbar.css'; // Include the CSS you’ll get next

function Navbar() {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState({ users: [], videos: [] });
  const [selectedDate, setSelectedDate] = useState('');
  const [activities, setActivities] = useState([]);

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

  useEffect(() => {
    const fetchActivitiesByDate = async () => {
      if (!selectedDate) return;

      const { data: viewLogs } = await supabase
        .from('views')
        .select('*')
        .gte('viewed_at', `${selectedDate}T00:00:00`)
        .lte('viewed_at', `${selectedDate}T23:59:59`);

      const { data: logins } = await supabase
        .from('login_logs')
        .select('*')
        .gte('logged_in_at', `${selectedDate}T00:00:00`)
        .lte('logged_in_at', `${selectedDate}T23:59:59`);

      setActivities([...(viewLogs || []), ...(logins || [])]);
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

      {selectedDate && activities.length > 0 && (
        <div className="activity-results">
          <h4>Activities on {selectedDate}</h4>
          <ul>
            {activities.map((act, idx) => (
              <li key={idx}>
                {act.viewed_at
                  ? `Viewed Video ID: ${act.video_id} at ${act.viewed_at}`
                  : `User ID: ${act.user_id} logged in at ${act.logged_in_at}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
