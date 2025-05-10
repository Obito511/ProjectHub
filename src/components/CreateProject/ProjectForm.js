import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import "./ProjectForm.css";

const ProjectForm = ({ isOpen, onClose, onProjectCreated }) => {
  const [projectData, setProjectData] = useState({
    nom: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setProjectData({
        nom: "",
        description: "",
      });
      setError(null);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing");
      }

      const response = await axios.post(
        "http://localhost:9090/api/projects/create",
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsSubmitting(false);
      onProjectCreated(response.data);
      onClose();
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating project:", error);
      setError(
        error.response?.data?.message || "Failed to create project. Please try again."
      );
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar-container ${isOpen ? 'open' : ''}`}
      >
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Create New Project</h2>
            <button
              onClick={onClose}
              className="close-button"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="sidebar-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Project Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={projectData.nom}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Description
              </label>
              <textarea
                name="description"
                value={projectData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Describe your project"
                rows="6"
              />
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={onClose}
                className="cancel-button"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="create-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectForm;