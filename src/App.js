import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './components/login/Login';
import Task from './components/Task/Task.js';
import ProjectForm from './components/CreateProject/ProjectForm.js';
import ProfilePage from './components/ProfilePage/ProfilePage';
import ProfileCard from './components/ProfileCard/ProfileCard';
import ProjectsList from './components/ProjectsList/ProjectsList';
import EditProfileForm from './components/EditProfileForm/EditProfileForm';
import ProjectDashboard from './components/Projects/Projects';
import Dashboard from './components/Dashboard/Dashboard';
import TaskForm from './components/createtask/Createtask';
import TaskBoard from './components/TaskBoard/TaskBoard';
import Settings from './components/Settings/Settings'
import Projects from './components/Projects/Projects';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if there's a saved theme in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    // Save the theme preference to localStorage
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    // Apply the dark-mode class to the body element
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    
    <Router>
      <div className="div0">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/accueil" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfileForm />} />
          <Route path="/task-board" element={<TaskBoard />} />
          <Route path="/task" element={<Task />} />
          <Route path="/create-project" element={<ProjectForm />} />
          <Route path="/create-task" element={<TaskForm />} />
          <Route path="/projects" element={<Projects />} />
          <Route 
  path="/settings" 
  element={<Settings toggleTheme={toggleTheme} isDarkMode={isDarkMode} />} 
/>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
