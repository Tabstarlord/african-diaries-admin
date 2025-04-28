import React from 'react';
import './VideoPerformance.css';
import card1 from '../Assets/card2.png'
import card2 from '../Assets/card1.png'
import eye from '../Assets/eye.png'
import like from '../Assets/like.png'

const VideoPerformance = () => {
  return (
    <div className="video-performance">
      <h2 className="title">Videos Performance</h2>
      <div className="cards">
        {/* Most Watched Video */}
        <div className="card">
          <img 
            src={card1}
            alt="Most Watched" 
            className="card-image" 
          />
          <div className="card-info">
            <span className="card-label">Most Watched Video</span>
            <div className="card-stats">
              <span className="stat-number">456.4k</span>
              <span className="stat-icon"><img src={eye} alt='eye' /></span>
            </div>
          </div>
        </div>

        {/* Most Liked Video */}
        <div className="card">
          <img 
            src={card2} 
            alt="Most Liked" 
            className="card-image" 
          />
          <div className="card-info">
            <span className="card-label">Most Liked Video</span>
            <div className="card-stats">
              <span className="stat-number">56.4k</span>
              <span className="stat-icon"><img src={like} alt='like' /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPerformance;
