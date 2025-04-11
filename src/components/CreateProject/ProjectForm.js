import React, { useState } from "react";
import axios from "axios";
import "./ProjectForm.css";
import Vnavbar from "../Vnavbar/Vnavbar";
import Navbar from "../Navbar/Navbar";

const ProjectForm = () => {
  const [projectData, setProjectData] = useState({
    nom: "",
    description: "",
  });

  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await axios.post(
        "http://localhost:9090/api/projects/create", // Fixed endpoint (added 's' in projects)
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Project created:", response.data);
      alert("Project created successfully!");
      // Reset form after successful creation
      setProjectData({ nom: "", description: "" });
    } catch (error) {
      console.error("Error creating project:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create project");
    }
  };

  const handleInputChange = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Navbar />
      <div className="main-layout">
        <Vnavbar />
        <div className="page-container">
          <h2 className="breadcrumb">Projects / Create Project</h2>
          <div className="container">
            <div className="form-section">
              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  name="nom"
                  value={projectData.nom}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Project Description</label>
              <textarea
                name="description"
                value={projectData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="button-group">
              <button className="create-btn" onClick={handleCreate}>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectForm;