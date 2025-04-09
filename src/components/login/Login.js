
import React, { useState } from 'react';
import ProjectsList from '../ProjectsList/ProjectsList';

import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,  
          password: password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      const token = data.token;
      console.log('Login successful, token:', token);

      localStorage.setItem('token', token);

      window.location.href = '/ProjectsList';
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMsg(error.message);
    }
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
              <button type="submit" >Log in</button>
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