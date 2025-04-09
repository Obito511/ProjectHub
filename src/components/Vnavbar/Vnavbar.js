import Login from "../login/Login";
import { Link } from 'react-router-dom';

import './Vnavbar.css';
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import TaskBoard from "../TaskBoard/TaskBoard";
import ProjectDashboard from '../Projects/Projects';

import ListAltIcon from "@mui/icons-material/ListAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
function Vnavbar (){
    return(
        <div className="sidebar">
        <ul className="sidebar-menu">
        <li className="sidebar-item active">
        <Link to="/projectslist">
          <DashboardIcon className="icon" />
          <span>Project</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/TaskBoard">
          <TaskIcon className="icon" />
          <span>Tasks</span>
          </Link>
        </li>
        <li className="sidebar-item">
          <ListAltIcon className="icon" />
          <span>Work Logs</span>
        </li>
        <li className="sidebar-item">
          <BarChartIcon className="icon" />
          <span>Performance</span>
        </li>
        <li className="sidebar-item">
          <SettingsIcon className="icon" />
          <span>Settings</span>
        </li>
      </ul>
      </div>
    );
}
export default Vnavbar