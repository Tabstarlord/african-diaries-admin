import React, { useEffect, useState } from 'react';
import './VideoPerformance.css';
import card1 from '../Assets/card2.png';
import card2 from '../Assets/card1.png';
import eye from '../Assets/eye.png';
import like from '../Assets/like.png';
import  supabase  from '../supabaseClient'; // Make sure this is set up

const VideoPerformance = () => {
  const [mostViewed, setMostViewed] = useState(null);
  const [mostLiked, setMostLiked] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      // Get most viewed video
      const { data: viewedData } = await supabase
        .from('videos')
        .select('id, title, thumbnail_url, view_count')
        .order('view_count', { ascending: false })
        .limit(1);

      // Get most liked video using liked_videos table
      const { data: likedData } = await supabase
        .from('liked_videos')
        .select('video_id, videos!inner(id, title, thumbnail_url)')
        .eq('videos.is_archived', false) // optional filter
        .order('video_id', { ascending: false })
        .limit(1); // Adjust as needed

      // Count likes manually
      const likeCounts = {};
      likedData?.forEach(({ video_id }) => {
        likeCounts[video_id] = (likeCounts[video_id] || 0) + 1;
      });

      const mostLikedVideoId = Object.entries(likeCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      const mostLikedVideo = likedData?.find(v => v.video_id === mostLikedVideoId);

      if (viewedData?.[0]) setMostViewed(viewedData[0]);
      if (mostLikedVideo) setMostLiked({ ...mostLikedVideo.videos, likes: likeCounts[mostLikedVideoId] });
    };

    fetchPerformanceData();
  }, []);

  return (
    <div className="video-performance">
      <h2 className="title">Videos Performance</h2>
      <div className="cards">
        {/* Most Watched Video */}
        {mostViewed && (
          <div className="card">
            <img src={mostViewed.thumbnail_url || card1} alt="Most Watched" className="card-image" />
            <div className="card-info">
              <span className="card-label">Most Watched Video</span>
              <div className="card-stats">
                <span className="stat-number">{(mostViewed.view_count / 1000).toFixed(1)}k</span>
                <span className="stat-icon"><img src={eye} alt='eye' /></span>
              </div>
            </div>
          </div>
        )}

        {/* Most Liked Video */}
        {mostLiked && (
          <div className="card">
            <img src={mostLiked.thumbnail_url || card2} alt="Most Liked" className="card-image" />
            <div className="card-info">
              <span className="card-label">Most Liked Video</span>
              <div className="card-stats">
                <span className="stat-number">{(mostLiked.likes / 1000).toFixed(1)}k</span>
                <span className="stat-icon"><img src={like} alt='like' /></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPerformance;
