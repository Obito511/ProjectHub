import React, { useState } from "react";
import axios from "axios";
import "./DeleteTaskPopup.css";

const DeleteTaskPopup = ({ isOpen, onClose, taskId, taskTitle, projectId, onTaskDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      await axios.delete(
        `http://localhost:9090/api/tasks/${taskId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          }
        }
      );
      
      setIsDeleting(false);
      onTaskDeleted(taskId);
      onClose();
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(
        err.response?.data?.message || 
        "Failed to delete task. You may not have permission."
      );
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="delete-task-popup">
        <div className="popup-header">
          <h2>Delete Task</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="popup-content">
          <p>Are you sure you want to delete the task:</p>
          <p className="task-name">"{taskTitle}"</p>
          <p className="warning-text">This action cannot be undone.</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="popup-actions">
            <button 
              className="cancel-btn" 
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button 
              className="delete-btn" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskPopup;