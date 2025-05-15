import React, { useEffect, useState } from 'react';
import './VideoPerformance.css';
import eye from '../Assets/eye.png';
import supabase from '../supabaseClient';

const VideoPerformance = () => {
  const [mostViewed, setMostViewed] = useState(null);

  useEffect(() => {
    const fetchMostViewedVideo = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('id, title, video_url, view_count')
        .order('view_count', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching most viewed video:', error);
        return;
      }

      if (data?.length > 0) {
        setMostViewed(data[0]);
      }
    };

    fetchMostViewedVideo();
  }, []);

  return (
    <div className="video-performance">
      <h2 className="title">Most Viewed Video</h2>
      <div className="cards">
        {mostViewed && (
          <div className="card-1">
            <video
              className="card-image"
              src={mostViewed.video_url}
              controls
              muted
              playsInline
              preload="metadata"
              onMouseOver={async e => {
                try {
                  await e.target.play();
                } catch (err) {
                  console.error('Play interrupted:', err);
                }
              }}
              onMouseOut={e => {
                e.target.pause();
              }}
            />
            <div className="card-info">
            <div className="card-label">{mostViewed.title}</div>
              <div className="card-stats">
                <span className="stat-icon"><img src={eye} alt="eye" /></span>&nbsp;
                <span className="stat-number">{(mostViewed.view_count / 1000).toFixed(1)}k</span>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPerformance;
