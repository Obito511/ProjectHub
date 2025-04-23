import React from "react";
import Vnavbar from '../Vnavbar/Vnavbar';
import Navbar from '../Navbar/Navbar';

const Settings = ({ toggleTheme, isDarkMode }) => {
  return (
    <div className="div0">
      <Navbar />
      <div className="div2">
        <div className="div3"><Vnavbar /></div>
        <div className="div4">
        <div className="settings-content">
          <div className="settings-header">
            <h1 className="settings-title">App Settings</h1>
          </div>
          
          <div className="settings-item">
            <div className="theme-toggle">
              <span>Theme Preference</span>
              <button 
                onClick={toggleTheme}
                className={`theme-button ${isDarkMode ? 'dark' : 'light'}`}
              >
                {isDarkMode ? "🌞 Light Theme" : "🌙 Dark Theme"}
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;