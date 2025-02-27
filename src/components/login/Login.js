import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <>
      <header className="login-header">
        <div className="logo-section">
          <img src="logo.png" alt="Logo" className="logo-image" />
        </div>
        <img src="name.png" alt="Logo" className="logo-image" />
        </header>
  
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-image-section">
            <img src="/assets/imagelogin.png" alt="Login Illustration" className="login-image" />
          </div>
          <div className="login-form-section">
            <h2>Welcome back, Yash</h2>
            <p>Welcome back! Please enter your details.</p>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-options">
                <label>
                  <input type="checkbox" /> Terms & Conditions
                </label>
                <a href="#">Forgot Password</a>
              </div>
              <button type="submit">Log in</button>
              <p className="signup-prompt">
                Don't have an account? <a href="#">Sign up for free</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
  
};

export default Login;