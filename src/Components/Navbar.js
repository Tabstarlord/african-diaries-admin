import React from 'react'
import wave from '../Assets/noto_waving-hand.png'
import calendar from '../Assets/tabler_calendar-cog.png'
import search from '../Assets/Search.png'
import close from '../Assets/Close.png'
import './Navbar.css'

function Navbar() {
  return (
    <>
    <nav className="navbar">
  <div className="navbar-container">
    <span className="navbar-brand">Hey Emmyrazy <img className='navbar-brand-wave' src={wave} alt='hey' /></span>
    <p className='navbar-brand-p'>Welcome back to your dashboard!</p>
      <form className="navbar-search" role="search">
      <img className='navbar-search-btn' src={search} alt='jpg' />
        <input className="navbar-input" type="search" placeholder="Search" aria-label="Search"/>
        <img className='navbar-search-close' src={close} alt='jpg' />
      </form>

          <div className='navbar-date-calendar'>
          <h6 className="navbar-date"><img className='navbar-calendar' src={calendar} alt='jpg' /> 20 June - 25 July 2024</h6>
          </div>
          
  </div>
</nav>
    </>
  )
}

export default Navbar