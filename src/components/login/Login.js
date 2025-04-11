
import React, { useState } from 'react';
import ProjectsList from '../ProjectsList/ProjectsList';

import './Login.css';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');


  const navigate = useNavigate();

  const handleApiError = async (response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      return errorData.message || 'Unknown error occurred';
    }
    return await response.text();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = isLogin ? 'login' : 'register';
    const body = isLogin 
      ? { email, password }
      : { 
          first_name: firstName,
          last_name: lastName,
          email, 
          password 
        };
  
    try {
      const response = await fetch(`http://localhost:8080/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
  
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Non-JSON response:', text);
        throw new Error('Server returned unexpected format');
      }
  
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
  
      if (!isLogin) {
        // Registration success
        alert('Account created successfully! Please login.');
        setIsLogin(true); // Switch to login form
        setFirstName('');
        setLastName('');
        setPassword(''); // Clear password field
      } else {
        localStorage.setItem('token', data.token);
console.log('Token stored in localStorage:', data.token);

const userResponse = await fetch('http://localhost:8080/api/auth/me', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.token}`
  }
});

if (!userResponse.ok) {
  throw new Error('Failed to fetch user data');
}

const userData = await userResponse.json();
localStorage.setItem('userId', userData.id);
console.log('User ID stored in localStorage:', userData.id); 

navigate('/accueil');

      }
  
    } catch (err) {
      console.error('Error:', err);
      alert(`Operation failed: ${err.message}`);
    }
  };
  // The rest of your JSX remains the same
  return (
    <>
      <header className="login-header">
        <div className="logo-section">
          <img src="logo.png" alt="Logo" className="logo-image" />
        </div>
        <div className="switch-tabs">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Register</button>
        </div>
      </header>

      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-image-section">
            <img src="/assets/imagelogin.png" alt="Login Illustration" className="login-image" />
          </div>
          <div className="login-form-section">
            <h2>{isLogin ? 'Welcome back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Please enter your credentials.' : 'Sign up to get started.'}</p>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div className="input-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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


              {isLogin && (
                <div className="form-options">
                  <label>
                    <input type="checkbox" /> Remember me
                  </label>
                  <a href="#">Forgot Password?</a>
                </div>
              )}

              <button type="submit">{isLogin ? 'Log in' : 'Register'}</button>

              <p className="signup-prompt">
                {isLogin ? (
                  <>Don't have an account? <a onClick={() => setIsLogin(false)}>Sign up for free</a></>
                ) : (
                  <>Already have an account? <a onClick={() => setIsLogin(true)}>Log in</a></>
                )}
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;