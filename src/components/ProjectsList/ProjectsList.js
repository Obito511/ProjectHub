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

  return (
    <div className="card projects-list">
      <h2>Projects</h2>
      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="project-item">
              <img 
                src={project.imageUrl || "/logo.png"} 
                alt={project.name || "Project"}
              />
              <div className="project-info">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <span>Status: {project.status}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No projects found. Create your first project!</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;