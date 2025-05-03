import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import supabase from '../supabaseClient';
import './Login.css';
import icon from '../Assets/show-icon.png';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password: 'ADiaries@admin_login',
      });
      if (loginError) throw loginError;
      // Check if the logged-in user is the admin
      if (email === 'africandiaries25@gmail.com') {
        navigate('/Dashboard');
      } else {
        setError('Access denied: Only admin can login');
        await supabase.auth.signOut();
      }
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className='login-wrapper'>
      <div className="login-container">
        <form className="login-box" onSubmit={handleLogin}>
          <h2>Log in</h2>
          {error && <p className="error">{error}</p>}
          <label>Email address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Password</label>
          <div className="password-wrapper">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
            <span className="toggle-visibility" onClick={() => setShowPassword(!showPassword)} >
              {showPassword ? <img src={icon} alt="hide" /> : '👁'}
            </span>
          </div>
          <div className="options-row">
            <input type="checkbox" />
            <label className="remember-me">Remember me</label>
            <Link>Forget your password?</Link>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
