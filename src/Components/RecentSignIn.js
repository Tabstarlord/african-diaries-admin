// RecentSignUps.js
import React, { useState } from "react";
import "./RecentSignIn.css";
import refresh from '../Assets/refresh-2.png'
import avatar from '../Assets/Avatar.png'
import avatar2 from '../Assets/Avatar2.png'
import avatar3 from '../Assets/Avatar3.png'


const users = [
  { name: "Ebri", location: "Enugu, NG", email: "Emmy...ma@gmail.com", time: "12:23:05", avatar: avatar },
  { name: "Ishang", location: "Lagos, NG", email: "Jane...ma@gmail.com", time: "12:23:05", avatar: avatar2 },
  { name: "MissBusty", location: "Calabar, NG", email: "Zay...ma@gmail.com", time: "12:23:05", avatar: avatar3 },
  { name: "BBC Oge", location: "Kaduna, NG", email: "Susk...ma@gmail.com", time: "12:23:05", avatar: avatar2 },
  { name: "Sexy Kim", location: "Jos, NG", email: "Vera...ma@gmail.com", time: "12:23:05", avatar: avatar },
];

function RecentSignIn() {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1000); // 1 second spin
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
          <span>Date</span>
        </div>
        {users.map((user, index) => (
          <div className="card-row fade-in" key={index}>
            <div className="profile">
              <img src={user.avatar} alt={user.name} className="avatar" />
              <span>{user.name}</span>
            </div>
            <span>{user.location}</span>
            <span>{user.email}</span>
            <span>{user.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentSignIn;
