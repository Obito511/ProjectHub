import React, { useState } from "react";

import Vnavbar from '../Vnavbar/Vnavbar';
import Navbar from '../Navbar/Navbar';
import "./Projects.css"; 
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';

export default function ProjectDashboard() {
  const projects = Array.from({ length: 16 }, (_, i) => ({
    title: `Project ${i + 1}`,
    description: "xcv xcvxc v   xcv  xcv  xv  x vc xc v x cv x cv x cv x cv xvx cvxvc  cx v xcv  xcv cx  v x   xcv xcvx",
    date: "05 April 2023",
    issues: 14,
    status: "Offline",
  }));

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="App">
      <div className='div0'>
           <Navbar />
          
        <div className='div2'>
            <div className='div3'><Vnavbar/></div>
            <div className='div4'>
            <div className="projects-page">
      <div className="projects-header">
        <h1>Projects</h1>
        <button className="create-button">Create</button>
      </div>

      <div className="projects-grid">
        {currentProjects.map((project, index) => (
          <div className="project-card" key={index}>
            <div className="project-card-header">
              <div className="project-card-title">
                {project.title}
                <span className="edit-icon" title="Edit">
                  <EditNoteOutlinedIcon />
                </span>
              </div>
              <span className="badge badge-offline">{project.status}</span>
            </div>
            <hr className="line" />
            <p className="project-description">{project.description}</p>
            <div className="project-date">
              <span className="calendar-icon" role="img" aria-label="calendar">
                <HourglassTopIcon className="icon" />
              </span>{" "}
              {project.date}
            </div>
            <div className="project-card-footer">
              <div className="avatars">
                <img src={`https://i.pravatar.cc/32?img=1`} alt="avatar1" />
                <img src={`https://i.pravatar.cc/32?img=1`} alt="avatar2" />
                <img src={`https://i.pravatar.cc/32?img=1`} alt="avatar3" />
              </div>
              <div className="project-issues">
                <span className="issue-icon" role="img" aria-label="issues">
                  <ErrorOutlineIcon className="icon" />
                </span>{" "}
                {project.issues} Issues
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          className="btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
            </div>
                
        </div>    
      </div>
    </div>
    

  );
}
