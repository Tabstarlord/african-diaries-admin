import React, { useState, useEffect, useRef } from 'react';
import supabase from '../supabaseClient';
import './Settings.css';

const Settings = () => {
  const [profileImage, setProfileImage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(false);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  
  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) return console.error(userError);

      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setName(data.username);
        setEmail(user.email);
        setProfileImage(data.avatar_url || 'https://randomuser.me/api/portraits/men/75.jpg');
      }
      if (error) console.error(error);
    };

    fetchProfile();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error } = await supabase.storage.from('avatars').upload(filePath, file);

      if (error) return console.error('Upload error:', error);

      const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setProfileImage(publicUrl.publicUrl);

      // Save avatar URL to profile table
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase
        .from('profile')
        .update({ avatar_url: publicUrl.publicUrl })
        .eq('id', user.id);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Update email
    if (email && email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email });
      if (emailError) console.error(emailError);
    }

    // Update password
    if (password) {
      const { error: passwordError } = await supabase.auth.updateUser({ password });
      if (passwordError) console.error(passwordError);
    }

    // Update name
    const { error: profileError } = await supabase
      .from('profile')
      .update({ username: name })
      .eq('id', user.id);

    if (profileError) console.error(profileError);

    setAlert(true);
    setTimeout(() => setAlert(false), 3000);
    setLoading(false);
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

        <button className="save-button" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save changes'}
        </button>

        {alert && <div className="alert-success">Changes saved successfully!</div>}
      </div>
    </div>
  );
};

export default Settings;
