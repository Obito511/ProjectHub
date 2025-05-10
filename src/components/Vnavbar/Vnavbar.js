import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Vnavbar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import ListAltIcon from "@mui/icons-material/ListAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

function Vnavbar({ isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate();
  
  // Close sidebar when navigating on mobile
  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  return (
    <div className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">ProjectHub</div>
        {isMobileOpen && (
          <button className="close-sidebar" onClick={() => setIsMobileOpen(false)}>
            <CloseIcon />
          </button>
        )}
      </div>
      
      <ul className="sidebar-menu">
        <li 
          className="sidebar-item" 
          onClick={() => handleNavigation("/accueil")}
        >
          <DashboardIcon className="icon" />
          <span>Dashboard</span>
        </li>
       
        
        
        <li 
          className="sidebar-item" 
          onClick={() => handleNavigation("/create-task")}
        >
          <AddTaskIcon className="icon" />
          <span>Create Task</span>
        </li>
        
        <li 
          className="sidebar-item" 
          onClick={() => handleNavigation("/projects")}
        >
          <ListAltIcon className="icon" />
          <span>My Projects</span>
        </li>
        
        <li 
          className="sidebar-item" 
          onClick={() => handleNavigation("/memberprojects")}
        >
          <TaskIcon className="icon" />
          <span>Assigned Projects</span>
        </li>
        
        
        <li 
          className="sidebar-item" 
          onClick={() => handleNavigation("/profile")}
        >
          <PersonIcon className="icon" />
          <span>Profile</span>
        </li>
        <li 
          className="sidebar-item" 
          onClick={() => handleNavigation("/settings/reminders")}
        >
          <NotificationsActiveIcon className="nav-icon" />
          <span>Task Reminders</span>
        </li>
        
        <li 
          className="sidebar-item" 
          onClick={() => handleNavigation("/settings")}
        >
          <SettingsIcon className="icon" />
          <span>Settings</span>
        </li>
      </ul>
    </div>
  );
}

export default Vnavbar;