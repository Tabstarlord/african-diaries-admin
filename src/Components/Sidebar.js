import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import './Sidebar.css';
import dashboard from '../Assets/dashboard-2.png';
import user from '../Assets/profile-2user.png';
import video from '../Assets/video-play.png';
import video2 from '../Assets/video-play2.png';
import settings from '../Assets/setting-2.png';
import notification from '../Assets/notification-bing.png';
import logout from '../Assets/logout.png';
import link from '../Assets/link.png';
import logo from '../Assets/Logo.png';
import dp from '../Assets/profile.png';

function Sidebar() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ username: '', email: '', avatar_url: '' });

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profile')
          .select('username, email, avatar_url')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setAdmin(data);
        }
      }
    };

    fetchAdmin();
  }, []);

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-container">
          <div className="sidebar-logo">
            <NavLink to="/">
              <img className="sidebar-logo-img" src={logo} alt="Logo" />
            </NavLink>
          </div>

          <div className="sidebar-links">
            <NavLink to="/Dashboard" className="sidebar-link">
              <img className="sidebar-icon" src={dashboard} alt="Dashboard" />
              Dashboard
            </NavLink>
            <NavLink to="/UploadVideos" className="sidebar-link">
              <img className="sidebar-icon" src={video2} alt="Upload Videos" />
              Upload Videos
            </NavLink>
            <NavLink to="/ManageVideos" className="sidebar-link">
              <img className="sidebar-icon" src={video} alt="Manage Videos" />
              Manage Videos
            </NavLink>
            <NavLink to="/ManageUsers" className="sidebar-link">
              <img className="sidebar-icon" src={user} alt="Manage Users" />
              Manage Users
            </NavLink>
            <NavLink to="/Notifications" className="sidebar-link">
              <img className="sidebar-icon" src={notification} alt="Notifications" />
              Notifications
            </NavLink>
            <NavLink to="/Settings" className="sidebar-link">
              <img className="sidebar-icon" src={settings} alt="Settings" />
              Settings
            </NavLink>
          </div>

          <div className="sidebar-profile">
            <img className="sidebar-profile-dp" src={admin.avatar_url || dp} alt="Profile" />
            <span className="sidebar-profile-user">{admin.username || 'Admin'}</span>
            <img
              className="sidebar-profile-logout"
              src={logout}
              alt="Logout"
              onClick={handleLogout}
              title="Logout"
            />
          </div>

          <div className="sidebar-profile-2">
            <img className="sidebar-profile-2-link" src={link} alt="Link" />
            <p className="sidebar-profile-2-email">{admin.email || 'admin@example.com'}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
