import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Sidebar.css'
import dashboard from '../Assets/dashboard-2.png'
import user from '../Assets/profile-2user.png'
import video from '../Assets/video-play.png'
import video2 from '../Assets/video-play2.png'
import settings from '../Assets/setting-2.png'
import notification from '../Assets/notification-bing.png'
import dp from '../Assets/profile.png'
import logout from '../Assets/logout.png'
import link from '../Assets/link.png'
import logo from '../Assets/Logo.png'



function Sidebar() {
  const navigate = useNavigate();

const handleLogout = () => {
  // Optional: Clear authentication info from localStorage/sessionStorage
  localStorage.removeItem('isLoggedIn'); // if you're using this flag
  // Navigate to login page
  navigate('/');
};


  return (
   <>
   <div className='sidebar'>
    <div className='sidebar-container'>

    <div className='sidebar-logo'>
        <Link to='/'><img className='sidebar-logo-img' src={logo} alt='jpg' /></Link>
      </div>

      <div className='sidebar-dashboard'>
        <Link to='/Dashboard'><img className='sidebar-dashboard-img' src={dashboard} alt='jpg' />Dashboard</Link>
      </div>

      <div className='sidebar-upload-videos'>
        <Link to='/UploadVideos'><img className='sidebar-upload-img' src={video2} alt='jpg' />Upload Videos</Link>
      </div>

      <div className='sidebar-manage-videos'>
        <Link to='/ManageVideos'><img className='sidebar-manage-img' src={video} alt='jpg' />Manage Videos</Link>
      </div>

      <div className='sidebar-manage-users'>
        <Link to='/ManageUsers'><img className='sidebar-user-img' src={user} alt='jpg' />Manage Users</Link>
      </div>

      <div className='sidebar-notifications'>
        <Link to='/Notifications'><img className='sidebar-notifications-img' src={notification} alt='jpg' />Notifications</Link>
      </div>

      <div className='sidebar-settings'>
        <Link to='/Settings'><img className='sidebar-settings-img' src={settings} alt='jpg' />Settings</Link>
      </div>

      <div className='sidebar-profile'>
        <img className='sidebar-profile-dp' src={dp} alt='dp' /><span className='sidebar-profile-user'>Ishang Emmanuel</span><img className='sidebar-profile-logout' src={logout} alt='logout' onClick={handleLogout} style={{cursor: "pointer"}} title='logout' />
      </div>
      <div className='sidebar-profile-2'>
      <img className='sidebar-profile-2-link' src={link} alt='link' /><p className='sidebar-profile-2-email'>Emmy...ma@gmail.com</p>
      </div>

    </div>
   </div>
   </>
  )
}

export default Sidebar