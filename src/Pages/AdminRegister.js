import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import './AdminRegister.css'

function AdminRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Full Supabase Error:', error); // Add this
      alert('Error creating admin: ' + error.message);
    }
     else {
      alert("Admin created. Please check your email to verify.");
      navigate('/Login') (data); // or to your dashboard if desired
    }
    
  };

  return (
    <div className="register-wrapper">
      <form onSubmit={handleRegister}>
        <h2>Create Admin Account</h2>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register Admin</button>
      </form>
    </div>
  );
}

export default AdminRegister;
