import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/login/Login';
import Navbar from './components/Navbar/Navbar';

import Vnavbar from './components/Vnavbar/Vnavbar';
import TaskBoard from "./components/TaskBoard/TaskBoard";

import ProfilePage from './components/ProfilePage/ProfilePage';
import ProfileCard from './components/ProfileCard/ProfileCard';
import ProjectsList from './components/ProjectsList/ProjectsList';
import EditProfileForm from './components/EditProfileForm/EditProfileForm';
import ProjectDashboard from './components/Projects/Projects';
import TaskForm from './components/createtask/Createtask';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/projectslist" element={<ProjectDashboard />} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
