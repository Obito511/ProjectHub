import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import axios from "axios";
import "./AssignMembersPopup.css"; // You'll need to create this CSS file

const AssignMembersPopup = ({ isOpen, onClose, projectName, projectId, taskId, onMemberAssigned }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchProjectMembers();
    }
  }, [isOpen, projectId]);

  const fetchProjectMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:9090/api/projects/${projectId}/members`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setMembers(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching project members:", err);
      setError("Failed to load project members");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignMember = async (memberId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing");
        console.error("No token found in localStorage");
        return;
      }
  
      // Assign member to task
      const response = await axios.post(
        `http://localhost:9090/api/tasks/${taskId}/assignees/${memberId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      console.log("Assign response:", response.data);
      setError(null);
      
      // Notify parent component about the assignment
      if (onMemberAssigned) {
        onMemberAssigned(memberId);
      }
    } catch (error) {
      console.error("Error assigning member:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      if (error.response?.status === 404) {
        setError("Task or member not found");
      } else if (error.response?.status === 403) {
        setError("You do not have permission to assign members");
      } else if (error.response?.status === 401) {
        setError("Authentication failed. Please log in again");
      } else if (error.response?.status === 409) {
        setError("Member is already assigned to this task");
      } else {
        setError("Failed to assign member to task");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container1">
        <div className="popup-header1">
          <h2>Assign Members - {projectName}</h2>
          <button className="close-button2" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        
        <div className="popup-content1">
          {loading ? (
            <div className="loading-message">Loading members...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : members.length === 0 ? (
            <div className="no-members-message">No members found for this project.</div>
          ) : (
            <div className="members-list">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="member-item">
                      <td className="member-info">
                        <img 
                          src={member.profilePicture || "/placeholder.jpg"} 
                          alt="avatar" 
                          className="member-avatar" 
                        />
                        <div className="member-details">
                          <div className="member-name">{member.name}</div>
                          <div className="member-email">{member.email}</div>
                        </div>
                      </td>
                      <td className="member-role">{member.role || "Member"}</td>
                      <td className="member-actions">
                        <button 
                          className="assign-member-btn"
                          onClick={() => handleAssignMember(member.id)}
                          title="Assign to task"
                        >
                          <PersonAddIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="popup-footer">
          <button className="close-button2" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AssignMembersPopup;