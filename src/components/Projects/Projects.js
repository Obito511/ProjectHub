import React, { useState, useEffect } from "react";
import Vnavbar from '../Vnavbar/Vnavbar';
import "./Projects.css";
import Navbar from "../Navbar/Navbar";
import axios from "axios";

import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { useNavigate } from "react-router-dom";


export default function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:9090/api/projects/owner/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setProjects(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="main-layout">
        <Vnavbar />

        <div className="projects-page">
          <div className="projects-header">
            <h1>Projects</h1>
            <button className="create-button"onClick={() => navigate("/create-project")}>Create</button>
          </div>

          {loading ? (
            <div className="card">Loading projects...</div>
          ) : error ? (
            <div className="card">Error: {error}</div>
          ) : (
            <>
              <div className="projects-grid">
                {currentProjects.map((project, index) => (
                  <div className="project-card" key={project.id || index}>
                    <div className="project-card-header">
                      <div className="project-card-title">
                        {project.nom}
                        <span className="edit-icon" title="Edit">
                          <EditNoteOutlinedIcon />
                        </span>
                      </div>
                      <span className="badge badge-offline">
                        {project.status || "Offline"}
                      </span>
                    </div>
                    <hr className="line" />
                    <p className="project-description">{project.description}</p>
                    <div className="project-date">
                      <HourglassTopIcon className="icon" /> {project.createdDate || "Unknown date"}
                    </div>
                    <div className="project-card-footer">
                      <div className="avatars">
                        <img src={`https://i.pravatar.cc/32?img=1`} alt="avatar1" />
                        <img src={`https://i.pravatar.cc/32?img=2`} alt="avatar2" />
                        <img src={`https://i.pravatar.cc/32?img=3`} alt="avatar3" />
                      </div>
                      <div className="project-issues">
                        <ErrorOutlineIcon className="icon" /> {project.issues || 0} Issues
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
            </>
          )}
        </div>
      </div>
    </>
  );
}
