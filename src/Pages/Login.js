import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import icon from '../Assets/show-icon.png'

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const adminEmail = 'ad_admin@login';
  const adminPassword = 'african-diaries';

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === adminEmail && password === adminPassword) {
      setError('');
      navigate('/Dashboard'); // 🔁 Redirect on success
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Log in</h2>

        {error && <p className="error">{error}</p>}

        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle-visibility"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <img src={icon} alt="hide" /> : '👁️'}
          </span>
        </div>

        <div className="options-row">
        <input type="checkbox" />
          <label className="remember-me">
            Remember me
          </label>
          <Link>Forget your password?</Link>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
