import React from 'react'
import view3 from '../Assets/view-Icon3.png';

function TotalUsers() {
  return (
   <>
    <div className="dashboard-card">
               <img src={view3} alt="Total Users" />
               <span className="dashboard-label">Total Users</span>
               <span className="dashboard-value">{totalUsers.toLocaleString()}</span>
             </div>
   </>
  )
}

export default TotalUsers