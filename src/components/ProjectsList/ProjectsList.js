import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProjectsList.css";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Get the authenticated user's ID (adjust based on your auth storage)
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:9090/api/projects/owner/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
  }, []); // Empty dependency array = runs once on mount

  if (loading) return <div className="card">Loading projects...</div>;
  if (error) return <div className="card">Error: {error}</div>;
  const lastProject = projects.length > 0 ? projects[projects.length - 1] : null;

  return (
    <div className="card projects-list">
      <h2>Latest Project</h2>
      <div className="projects-grid">
        {lastProject ? (
          <div key={lastProject.id} className="project-item">
            <img 
              src={lastProject.imageUrl || "/logo.png"} 
              alt={lastProject.name || "Project"}
              className="project-image"
            />
            <div className="project-info">
              <h3 className="project-name">{lastProject.name}</h3>
              <p className="project-description">{lastProject.description}</p>
              <div className={`project-status ${(lastProject.status || 'unknown').toLowerCase()}`}>
                {lastProject.status || 'Status unavailable'}
              </div>
            </div>
          </div>
        ) : (
          <p className="no-projects">No projects found. Create your first project!</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;