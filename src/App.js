import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './components/login/Login';
import Navbar from './components/Navbar/Navbar';
import Vnavbar from './components/Vnavbar/Vnavbar';
import Task from './components/Task/Task.js';
import ProjectForm from './components/CreateProject/ProjectForm.js';
import TaskBoard from './components/TaskBoard/TaskBoard';
import ProfilePage from './components/ProfilePage/ProfilePage';
import ProfileCard from './components/ProfileCard/ProfileCard';
import ProjectsList from './components/ProjectsList/ProjectsList';
import EditProfileForm from './components/EditProfileForm/EditProfileForm';
import ProjectDashboard from './components/Projects/Projects';
import Dashboard from './components/Dashboard/Dashboard';
import TaskForm from './components/createtask/Createtask';

function App() {
  return (
    <Router>
      <div className="div0">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/accueil" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfileForm />} />
          <Route path="/task-board" element={<TaskBoard />} />
          <Route path="/task" element={<Task />} />
          <Route path="/create-project" element={<ProjectForm />} />
          <Route path="/create-task" element={<TaskForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
