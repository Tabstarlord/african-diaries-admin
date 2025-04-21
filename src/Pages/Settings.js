import React, { useState, useRef } from 'react';
import './Settings.css';

const Settings = () => {
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/75.jpg');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setAlert(true);
    setTimeout(() => setAlert(false), 3000); // Alert disappears after 3 seconds
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <div className="settings-card">
        <div className="profile-photo" onClick={handleImageClick}>
          <img src={profileImage} alt="Profile" />
          <div className="camera-icon">📷</div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        <label>Name</label>
        <input
          type="text"
          placeholder="Change Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email Address</label>
        <input
          type="email"
          placeholder="Update Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Change Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="save-button" onClick={handleSave}>
          Save changes
        </button>

        {alert && <div className="alert-success">Changes saved successfully!</div>}
      </div>
    </div>
  );
};

export default Settings;
