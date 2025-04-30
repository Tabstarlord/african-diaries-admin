import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient"; // adjust if necessary
import "./RecentSignIn.css";
import refresh from '../Assets/refresh-2.png';
import defaultAvatar from '../Assets/Avatar.png';

function RecentSignIn() {
  const [users, setUsers] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);



useEffect(() => {
  fetchRecentSignups();
}, []);

const fetchRecentSignups = async () => {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (!error) setUsers(data);
};


  const handleRefresh = () => {
    setIsSpinning(true);
    fetchRecentSignups();
    setTimeout(() => setIsSpinning(false), 1000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="signup-card">
      <div className="card-header">
        <h2>Recent Sign Up</h2>
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
            <span>{formatTime(user.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentSignIn;
