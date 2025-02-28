import React from "react";
import "./ProjectsList.css"
const projects = [
    { name: "Emo Stuff", image: "obito.webp" },
    { name: "Tim Burton", image: "obito.webp" },
    { name: "Halloween", image: "obito.webp" },
  ];
const ProjectsList = ({ projects = [] }) => {
  return (
    <div className="card projects-list">
      <h2>Projects</h2>
      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div key={index} className="project-item">
              <img src={project.image || "logo.png"} alt={project.name || "Project"} />
              <p>{project.name || "Untitled Project"}</p>
            </div>
          ))
        ) : (
          <p>No projects available</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
