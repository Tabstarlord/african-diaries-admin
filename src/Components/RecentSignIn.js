import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "./RecentSignIn.css";
import refresh from '../Assets/refresh-2.png';
import defaultAvatar from '../Assets/Avatar.png';

function RecentSignIn() {
  const [users, setUsers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    fetchRecentSignins();
    const interval = setInterval(fetchRecentSignins, 15000); // refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchRecentSignins = async () => {
    const { data, error } = await supabase
    .from('recent_signins')
    .select('*')
    .limit(5);
  

    if (!error) setUsers(data);
  };

  const handleRefresh = () => {
    setIsSpinning(true);
    fetchRecentSignins();
    setTimeout(() => setIsSpinning(false), 1000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="signup-card">
      <div className="card-header">
        <h2>Recent Sign In</h2>
        <button 
          className={`refresh-button ${isSpinning ? 'spin' : ''}`} 
          onClick={handleRefresh}
        >
          <img src={refresh} alt="refresh" />
        </button>
      </div>
      <div className="card-body">
        <div className="card-columns">
          <span>Profile</span>
          <span>Location</span>
          <span>Email Address</span>
          <span>Time</span>
        </div>
        {users.map((user, index) => (
          <div className="card-row fade-in" key={index}>
            <div className="profile">
              <img
                src={user.avatar_url || defaultAvatar}
                alt={user.username}
                className="avatar"
              />
              <span>{user.username}</span>
            </div>
            <span>{user.location || 'N/A'}</span>
            <span>{user.email}</span>
            <span>{formatTime(user.last_sign_in_at)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentSignIn;
