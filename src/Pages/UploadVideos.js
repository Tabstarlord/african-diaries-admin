import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import '../Pages/UploadVideos.css';
import uploadicon from '../Assets/Upload icon.png';
import { v4 as uuidv4 } from "uuid";

const tags = [
  "Amatuer", "Anal", "BDSM", "Bi", "Big Ass", "Orgy",
  "Creampie", "Gangbang", "Big Tits", "Black Men", "Big Dick",
  "Blonde", "Gay", "Cumshot", "Hardcore", "Milf", "Blow job",
  "Solo", "Squirting", "Straight", "Student", "Teacher", "Trans",
  "Boobs", "Cum", "Lesbian", "Cougar", "Wanking"
];

const VideoUpload = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Straight');
  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  return (
    <section className="upload">
      <h1 className="upload-videos-header">Upload Videos</h1>
      <div className="upload-container">
        <div className="upload-box">
          <label htmlFor="file-upload" className="drag-drop">
            <div className="upload-icon"><img src={uploadicon} alt="upload" /></div>
            <p>Drag & drop files or <span className="browse">Browse</span></p>
            <p className="format-text">Supported formats: MP4, AVI, WEBP…</p>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            hidden
          />
        </div>

        {file && (
          <div className="uploading-box">
            <input type="text" value={file.name} readOnly />
            {uploading && <div className="progress-bar"><div className="progress" /></div>}
          </div>
        )}

        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Straight</option>
            <option>Gay</option>
            <option>Trans</option>
            <option>Best Videos</option>
            <option>Newest Videos</option>
            <option>Liked Videos</option>
          </select>
        </div>

        <div className="form-group">
          <label>Sub Category</label>
          <div className="tags-grid">
            {tags.map((tag, index) => (
              <button
                key={index}
                type="button"
                className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button className="upload-btn" onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
      </div>
    </section>
  );

  // --- 🔽 FUNCTIONS BELOW ---

  function handleTagToggle(tag) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  }

  async function handleUpload() {
    if (!file || !category || !title.trim()) {
      alert('All fields are required.');
      return;
    }

    if (!user) {
      alert('You must be logged in to upload.');
      return;
    }

    setUploading(true);

    try {
      const videoId = uuidv4();
      const filePath = `${videoId}/${file.name}`;

      const { error: storageError } = await supabase
        .storage
        .from('videos')
        .upload(filePath, file);

      if (storageError) throw new Error(storageError.message);

      const videoUrl = `https://mbksobahlnvqnihwvwmj.supabase.co/storage/v1/object/public/videos/${filePath}`;

      const { error: insertError } = await supabase.from('videos').insert([
        {
          id: videoId,
          title,
          category,
          tags: selectedTags,
          video_url: videoUrl,
          uploaded_at: new Date().toISOString(),
          user_id: user.id,
        },
      ]);

      if (insertError) throw new Error(insertError.message);

      alert('Upload successful!');
      setTitle('');
      setCategory('Straight');
      setSelectedTags([]);
      setFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }
};

export default VideoUpload;
