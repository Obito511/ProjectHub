import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './components/login/Login';
import NotificationListener from './components/Navbar/NotificationListener';
import TaskReminder from './components/TaskReminder/TaskReminder'; // Correct import
import MemberProjects from './components/MemberProjects/MemberProjects'; // Correct import

import Task from './components/Task/Task.js';
import ProfilePage from './components/ProfilePage/ProfilePage';
import EditProfileForm from './components/EditProfileForm/EditProfileForm';
import Dashboard from './components/Dashboard/Dashboard';
import ReminderSettings from './components/ReminderSettings/ReminderSettings';
import TaskBoard from './components/TaskBoard/TaskBoard';
import Settings from './components/Settings/Settings';
import Projects from './components/Projects/Projects';
import TaskForm from './components/createtask/Createtask';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    return localStorage.getItem("userId") || null;
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
  function runAnalysisOnPageLoad() {
    fetch('http://localhost:9090/api/reminders/run-analysis', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add any required headers, e.g., Authorization if needed
        },
        body: JSON.stringify({}) // Add your request body here if needed
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Analysis response:', data);
        // Handle the response data as needed
    })
    .catch(error => {
        console.error('Error calling run-analysis API:', error);
    });
}

// Call the function when the page loads
window.onload = runAnalysisOnPageLoad;

  return (
    <Router>
      <div className="div0">
        {user && (
          <>
            <TaskReminder userId={user} setNotifications={setNotifications} />
            <NotificationListener userId={user} setNotifications={setNotifications} />
          </>
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/accueil" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfileForm />} />
          <Route path="/task-board" element={<TaskBoard />} />
          <Route path="/task" element={<Task />} />
          <Route path="/memberprojects" element={<MemberProjects />} />
          <Route path="/create-task" element={<TaskForm />} />
          <Route path="/project/:projectId/tasks" element={<TaskBoard />} />
          <Route path="/settings/reminders" element={<ReminderSettings />} />
          <Route path="/settings" element={<Settings toggleTheme={toggleTheme} isDarkMode={isDarkMode} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
