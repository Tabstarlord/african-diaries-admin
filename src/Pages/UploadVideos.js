import React, { useState } from 'react';
import supabase from '../supabaseClient'; // Ensure correct path
import '../Pages/UploadVideos.css';
import uploadicon from '../Assets/Upload icon.png';

const tags = [
  "Amatuer", "Anal", "BDSM", "Bi", "Big Ass", "Orgy",
  "Creampie", "Gangbang", "Big Tits", "Black Men", "Big Dick",
  "Blonde", "Gay", "Cumshot", "Hardcore", "Milf", "Blow job",
  "Solo", "Squirting", "Straight", "Student", "Teacher", "Trans",
  "Boobs", "Cum", "Boobs", "Lesbian", "Cougar", "Wanking"
];

const VideoUpload = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Straight');
  const [selectedTags, setSelectedTags] = useState([]);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setUploading(true);
      setTimeout(() => setUploading(false), 1000);
    }
  };

  const handleUpload = async () => {
    const file = document.getElementById('file-upload').files[0];

    if (!file || !title.trim()) {
      alert("Please select a file and enter a title.");
      return;
    }

    setUploading(true);

    try {
      const { data, error: storageError } = await supabase
        .storage
        .from('videos')
        .upload(`videos/${Date.now()}_${file.name}`, file);

      if (storageError) {
        console.error("Upload error:", storageError);
        alert("Error uploading file.");
        setUploading(false);
        return;
      }

      const videoUrl = `https://mbksobahlnvqnihwvwmj.supabase.co/storage/v1/object/public/videos/${data.path}`;

      const { error: insertError } = await supabase
        .from('videos')
        .insert([
          {
            title,
            category,
            tags: selectedTags,
            video_url: videoUrl,
            uploaded_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error("DB insert error:", insertError);
        alert("Error saving video metadata.");
      } else {
        alert("Upload successful!");
        setTitle('');
        setSelectedTags([]);
        setFileName('');
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className='upload'>
      <h1 className="upload-videos-header">Upload Videos</h1>
      <div className="upload-container">
        <div className="upload-box">
          <label htmlFor="file-upload" className="drag-drop">
            <div className="upload-icon"><img src={uploadicon} alt='upload' /></div>
            <p>Drag & drop files or <span className="browse">Browse</span></p>
            <p className="format-text">Supported formats: Mp4, Avi, Webp…</p>
          </label>
          <input id="file-upload" type="file" onChange={handleFileChange} hidden />
        </div>

        {fileName && (
          <div className="uploading-box">
            <input type="text" value={fileName} readOnly />
            {uploading && <div className="progress-bar"><div className="progress" /></div>}
          </div>
        )}

        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Straight</option>
            <option>Gay</option>
            <option>Trans</option>
            <option>Best Videos</option>
            <option>Newest Videos</option>
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
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button className="upload-btn" onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
      </div>
    </section>
  );
};

export default VideoUpload;
