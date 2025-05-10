import React, { useState, useEffect } from "react";
import axios from "axios";
import { Switch, Slider } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import "./ReminderSettings.css";
import SearchIcon from "@mui/icons-material/Search";
import Vnavbar from "../Vnavbar/Vnavbar";
import Navbar from "../Navbar/Navbar";
const ReminderSettings = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    daysBeforeDeadline: 7,
    hourOfDay: 9,
    notifyProjectOwner: true,
    highRiskThreshold: 0.7,
  });

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user is an admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (token && userId) {
      axios
        .get(`http://localhost:9090/api/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          const userRoles = response.data.roles || [];
          setIsAdmin(userRoles.some(role => role.name === "ROLE_ADMIN"));
        })
        .catch((error) => {
          console.error("Error checking admin status:", error);
        });
    }
  }, []);

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:9090/api/reminders/settings", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        
        setSettings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reminder settings:", error);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle saving settings
  const handleSave = async () => {
    try {
      setSaveStatus("saving");
      
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:9090/api/reminders/settings",
        settings,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error saving reminder settings:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Handle running manual analysis
  const triggerManualAnalysis = async () => {
    try {
      setSaveStatus("analyzing");
      
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:9090/api/reminders/run-analysis",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error triggering reminder analysis:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Handle form input changes
  const handleChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  if (loading) {
    return <div className="reminder-settings-loading">Loading settings...</div>;
  }

  return (
    <div className="div0">
      <Navbar />
      <div className="div2">
          <div className="div3"><Vnavbar /></div>
          <div className="div4">
          <div className="reminder-settings-container">
      <div className="reminder-settings-header">
        <NotificationsActiveIcon className="reminder-icon" />
        <h2>Task Reminder Settings</h2>
      </div>

      <div className="reminder-settings-form">
        <div className="form-group">
          <label>Enable Automated Reminders</label>
          <Switch
            checked={settings.enabled}
            onChange={(e) => handleChange("enabled", e.target.checked)}
            color="primary"
            disabled={!isAdmin}
          />
        </div>

        <div className="form-group">
          <label>Days Before Deadline to Start Checking</label>
          <div className="slider-container">
            <Slider
              value={settings.daysBeforeDeadline}
              onChange={(_, value) => handleChange("daysBeforeDeadline", value)}
              step={1}
              marks
              min={1}
              max={14}
              valueLabelDisplay="auto"
              disabled={!isAdmin}
            />
            <span className="slider-value">{settings.daysBeforeDeadline} days</span>
          </div>
        </div>

        <div className="form-group">
          <label>Hour of Day to Send Notifications (24-hour format)</label>
          <div className="slider-container">
            <Slider
              value={settings.hourOfDay}
              onChange={(_, value) => handleChange("hourOfDay", value)}
              step={1}
              marks
              min={0}
              max={23}
              valueLabelDisplay="auto"
              disabled={!isAdmin}
            />
            <span className="slider-value">{settings.hourOfDay}:00</span>
          </div>
        </div>

        <div className="form-group">
          <label>Notify Project Owner on High Risk Tasks</label>
          <Switch
            checked={settings.notifyProjectOwner}
            onChange={(e) => handleChange("notifyProjectOwner", e.target.checked)}
            color="primary"
            disabled={!isAdmin}
          />
        </div>

        <div className="form-group">
          <label>High Risk Threshold (0.0 - 1.0)</label>
          <div className="slider-container">
            <Slider
              value={settings.highRiskThreshold}
              onChange={(_, value) => handleChange("highRiskThreshold", value)}
              step={0.05}
              min={0.5}
              max={0.95}
              valueLabelDisplay="auto"
              disabled={!isAdmin}
            />
            <span className="slider-value">{settings.highRiskThreshold}</span>
          </div>
        </div>

        {isAdmin && (
          <div className="reminder-settings-actions">
            <button 
              className="save-button" 
              onClick={handleSave}
              disabled={saveStatus === "saving"}
            >
              <SaveIcon />
              {saveStatus === "saving" ? "Saving..." : "Save Settings"}
            </button>
            
            <button 
              className="analyze-button" 
              onClick={triggerManualAnalysis}
              disabled={saveStatus === "analyzing"}
            >
              <NotificationsActiveIcon />
              {saveStatus === "analyzing" ? "Running Analysis..." : "Run Analysis Now"}
            </button>
          </div>
        )}

        {saveStatus === "success" && (
          <div className="success-message">Operation completed successfully!</div>
        )}
        
        {saveStatus === "error" && (
          <div className="error-message">Error occurred. Please try again.</div>
        )}

        {!isAdmin && (
          <div className="admin-notice">
            Note: Only administrators can modify reminder settings.
          </div>
        )}
      </div>

      <div className="reminder-info-section">
        <h3>About Task Reminders</h3>
        <p>
          The task reminder system automatically analyzes task progress and sends notifications
          to team members when tasks are at risk of missing deadlines.
        </p>
        <ul>
          <li>
            <strong>Days Before Deadline:</strong> How many days before the due date the system starts checking task status.
          </li>
          <li>
            <strong>Hour of Day:</strong> What time reminders are sent (in 24-hour format).
          </li>
          <li>
            <strong>Notify Project Owner:</strong> Whether to alert the project owner about high-risk tasks.
          </li>
          <li>
            <strong>High Risk Threshold:</strong> The risk score at which tasks are considered high risk (0.7 means 70% risk).
          </li>
        </ul>
      </div>
    </div>
          </div>
      </div>
    </div>
    
  );
};

export default ReminderSettings;