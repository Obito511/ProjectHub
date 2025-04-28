import React from "react";
import Vnavbar from '../Vnavbar/Vnavbar';
import Navbar from '../Navbar/Navbar';
import { FaPalette, FaBell, FaGlobe, FaUserCog } from 'react-icons/fa'; // Modern icons

const Settings = ({ toggleTheme, isDarkMode }) => {
  return (
    <div className="div0">
      <Navbar />
      <div className="div2">
        <div className="div3"><Vnavbar /></div>
        <div className="div4">
          <div className="settings-content">
            <div className="settings-header">
              <h1 className="settings-title">Settings</h1>
            </div>

            {/* Theme Preference */}
            <div className="settings-item">
              <div className="settings-item-inner">
                <div className="settings-label">
                  <FaPalette className="settings-icon" />
                  <span>Theme Preference</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`theme-button ${isDarkMode ? 'dark' : 'light'}`}
                >
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="settings-item">
              <div className="settings-item-inner">
                <div className="settings-label">
                  <FaBell className="settings-icon" />
                  <span>Email Notifications</span>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {/* Language Selection */}
            <div className="settings-item">
              <div className="settings-item-inner">
                <div className="settings-label">
                  <FaGlobe className="settings-icon" />
                  <span>Language</span>
                </div>
                <select className="language-dropdown">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>

            {/* Account Settings */}
            <div className="settings-item">
              <div className="settings-item-inner">
                <div className="settings-label">
                  <FaUserCog className="settings-icon" />
                  <span>Account Settings</span>
                </div>
                <button className="account-button">Manage Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;