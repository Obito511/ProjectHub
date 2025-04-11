
import Login from "../login/Login";
import { Link } from 'react-router-dom';

import './Vnavbar.css';
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Vnavbar.css";

import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import TaskBoard from "../TaskBoard/TaskBoard";
import ProjectDashboard from '../Projects/Projects';

import ListAltIcon from "@mui/icons-material/ListAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";

import PersonIcon from "@mui/icons-material/Person";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AddBoxIcon from "@mui/icons-material/AddBox";

function Vnavbar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className="sidebar-item" onClick={() => navigate("/dashboard")}>
          <DashboardIcon className="icon" />
          <span>Dashboard</span>
        </li>
        <li className="sidebar-item" onClick={() => navigate("/task")}>
          <TaskIcon className="icon" />
          <span>Tasks</span>
        </li>
        <li className="sidebar-item" onClick={() => navigate("/create-task")}>
          <AddTaskIcon className="icon" />
          <span>Create Task</span>
        </li>
        <li className="sidebar-item" onClick={() => navigate("/projects")}>
          <ListAltIcon className="icon" />
          <span>Projects</span>
        </li>
        <li className="sidebar-item" onClick={() => navigate("/create-project")}>
          <AddBoxIcon className="icon" />
          <span>Create Project</span>
        </li>
        <li className="sidebar-item" onClick={() => navigate("/profile")}>
          <PersonIcon className="icon" />
          <span>Profile</span>
        </li>
        <li className="sidebar-item" onClick={() => navigate("/settings")}>
          <SettingsIcon className="icon" />
          <span>Settings</span>
        </li>
      </ul>
    </div>
  );
}

export default Vnavbar;
