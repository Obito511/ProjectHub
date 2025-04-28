import React, { useState, useEffect } from "react";
import Vnavbar from '../Vnavbar/Vnavbar';
import "./Projects.css";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from "react-router-dom";

const AddMemberPopup = ({ isOpen, onClose, projectName, projectId, onMembersAdded }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (query.length > 1) {
      const delayDebounceFn = setTimeout(() => {
        axios
          .get('http://localhost:9090/api/user/search?keyword=' + query, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            console.log(res.data);
            
            setSuggestions(Array.isArray(res.data) ? res.data : []);
          })
          .catch(error => {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);  // In case of error, reset the suggestions to empty array
          });
      }, 300);
      
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSuggestions([]);
    setQuery("");
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      const role = document.querySelector('select.form-control').value || 'Member';
      
      const addRequests = selectedUsers.map(user => {
        return axios.post(
          
          `http://localhost:9090/api/projects/${projectId}/members`,
          null,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token"),
            },
            params: {
              userId: user.id,
              role: role
            }
          }
        );
      });
      
      await Promise.all(addRequests);
      
      // Show success message or refresh project data
      onClose();
      // Call the callback to refresh the project data
      if (onMembersAdded) {
        onMembersAdded();
      }
    } catch (error) {
      console.error("Error adding members:", error);
      // Show error message to user
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>Add people to {projectName}</h2>
          <button className="close-button" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        
        <div className="popup-content">
          <div className="form-group">
            <label>Names or emails <span className="required">*</span></label>
            <div className="search-input-container">
              {selectedUsers.map(user => (
                <div key={user.id} className="selected-user-tag">
                  <img src={user.avatar || "https://i.pravatar.cc/32?img=1"} alt="" className="selected-user-avatar" />
                  <span>{user.name}</span>
                  <button onClick={() => handleRemoveUser(user.id)} className="remove-user-btn">×</button>
                </div>
              ))}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={selectedUsers.length > 0 ? "" : "e.g., aziz, jallali@gmail.com"}
                className="form-control search-input"
              />
            </div>
            
            {Array.isArray(suggestions) && suggestions.length > 0 && (
              <div className="suggestions-container">
                <ul className="suggestions-list">
                  {suggestions.map((user, index) => (
                    <li 
                      key={index} 
                      className="suggestion-item"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="suggestion-avatar">
                        <img src={user.avatar || "https://i.pravatar.cc/32?img=1"} alt="avatar" />
                      </div>
                      <div className="suggestion-info">
                        <div className="suggestion-name">{user.name}</div>
                        <div className="suggestion-email">{user.email}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="or-divider">
            <span>or add from</span>
          </div>
          
          <div className="service-buttons">
            <button className="service-button">
              <GoogleIcon className="icon" /> Google
            </button>
            <button className="service-button">
              <LinkedInIcon className="icon" /> LinkedIn
            </button>
            <button className="service-button">
              <MicrosoftIcon className="icon" /> Microsoft
            </button>
          </div>
          
          <div className="form-group">
            <label>Role</label>
            <select className="form-control">
              <option>Member</option>
              <option>Admin</option>
              <option>Viewer</option>
            </select>
          </div>
          
          <div className="recaptcha-notice">
            <small>
              This site is protected by reCAPTCHA and the Google 
              <a href="#" className="policy-link">Privacy Policy</a> and 
              <a href="#" className="policy-link">Terms of Service</a> apply.
            </small>
          </div>
        </div>
        
        <div className="popup-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="add-button" disabled={selectedUsers.length === 0} onClick={handleAddMembers}>Add</button>
        </div>
      </div>
    </div>
  );
};

const ViewMembersPopup = ({ isOpen, onClose, projectName, projectId, onMemberDeleted }) => {
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
      console.log("token : "+localStorage.getItem("token"));
      setMembers(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching project members:", err);
      setError("Failed to load project members");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing");
        console.error("No token found in localStorage");
        return;
      }
  
      const response = await axios.delete(
        `http://localhost:9090/api/projects/${projectId}/members/${memberId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      console.log("Delete response:", response.data);
      setMembers(members.filter(member => member.id !== memberId));
      setError(null);
      if (onMemberDeleted) {
        onMemberDeleted();
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      if (error.response?.status === 404) {
        setError("Member not found in project");
      } else if (error.response?.status === 403) {
        setError("You do not have permission to delete members");
      } else if (error.response?.status === 401) {
        setError("Authentication failed. Please log in again");
      } else {
        setError("Failed to delete member");
      }
    }
  };
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>Project Members - {projectName}</h2>
          <button className="close-button" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        
        <div className="popup-content">
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
                          src={member.avatar || "https://i.pravatar.cc/32?img=1"} 
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
                          className="delete-member-btn"
                          onClick={() => handleDeleteMember(member.id)}
                          title="Remove member"
                        >
                          <DeleteOutlineIcon />
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
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const EditProjectPopup = ({ 
  isOpen, 
  onClose, 
  project, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: project?.nom || "",       // Add null checks
    description: project?.description || ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:9090/api/projects/${project.idprojet}`, // Changed from project.id
        {
          nom: formData.name,
          description: formData.description
        },
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json"
          }
        }
      );
      onSave(response.data);
      onClose();
    } catch (error)  {
      console.error("Error updating project:", error);
      if (error.response) {
        if (error.response.status === 403) {
          alert("Only the project owner can make changes");
        } else if (error.response.status === 404) {
          alert("Project not found");
        }
      } else {
        alert("Error updating project");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>Edit Project</h2>
          <button className="close-button" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="popup-content">
            <div className="form-group">
              <label>Project Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                rows="4"
              />
            </div>
          </div>

          <div className="popup-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
  const [isViewMembersPopupOpen, setIsViewMembersPopupOpen] = useState(false);
  const [currentProjectName, setCurrentProjectName] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  
  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}/tasks`);
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
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
      console.log("Projects response:", response.data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const openAddMemberPopup = (projectName, projectId) => {
    setCurrentProjectName(projectName);
    setCurrentProjectId(projectId);
    setIsAddMemberPopupOpen(true);
  };

  const closeAddMemberPopup = () => {
    setIsAddMemberPopupOpen(false);
  };

  const handleSaveProject = (updatedProject) => {
    setProjects(projects.map(project => 
      project.idprojet === updatedProject.idprojet ? updatedProject : project
    ));
  };
  
  const handleEditClick = (project) => {
    setCurrentProject(project);
    setIsEditPopupOpen(true);
  };

  const openViewMembersPopup = (projectName, projectId) => {
    setCurrentProjectName(projectName);
    setCurrentProjectId(projectId);
    setIsViewMembersPopupOpen(true);
  };

  const closeViewMembersPopup = () => {
    setIsViewMembersPopupOpen(false);
  };

  return (
    <div className="div0">
      <Navbar />
      <div className="div2">
        <div className="div3"><Vnavbar /></div>
        <div className="div4">
          <div className="projects-page">
            <div className="projects-header">
              <h1>Projects</h1>
              <button className="create-button" onClick={() => navigate("/create-project")}>Create</button>
            </div>

            {loading ? (
              <div className="card">Loading projects...</div>
            ) : error ? (
              <div className="card">Error: {error}</div>
            ) : (
              <>
                <div className="projects-grid">
                  {currentProjects.map((project, index) => (
                    <div className="project-card" key={project.idprojet || index}>
                      <div className="project-card-header">
                        <div className="project-card-title">
                          <span 
                            onClick={() => handleProjectClick(project.idprojet)}
                            style={{ cursor: 'pointer' }}
                          >
                            {project.nom}
                          </span>
                          <span className="edit-icon" title="Edit" onClick={() => handleEditClick(project)}>
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
                        <div className="task-members">
                          <button 
                            className="add-member"
                            onClick={() => openAddMemberPopup(project.nom, project.idprojet)}
                          >
                            <AddIcon className="icon" />
                          </button>
                          
                          <div 
                            className="member-avatars"
                            onClick={() => openViewMembersPopup(project.nom, project.idprojet)}
                            style={{ cursor: 'pointer' }}
                          >
                            <img src={`https://i.pravatar.cc/32?img=1`} alt="avatar1" className="avatar" />
                            <img src={`https://i.pravatar.cc/32?img=2`} alt="avatar2" className="avatar" />
                            <img src={`https://i.pravatar.cc/32?img=3`} alt="avatar3" className="avatar" />
                          </div>
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
      </div>

      {/* Edit Project Popup */}
      <EditProjectPopup
        isOpen={isEditPopupOpen}
        onClose={() => setIsEditPopupOpen(false)}
        project={currentProject}
        onSave={handleSaveProject}
      />

      {/* Add Member Popup */}
      <AddMemberPopup 
        isOpen={isAddMemberPopupOpen}
        onClose={closeAddMemberPopup}
        projectName={currentProjectName}
        projectId={currentProjectId}
        onMembersAdded={fetchProjects}
      />

      {/* View Members Popup */}
      <ViewMembersPopup 
        isOpen={isViewMembersPopupOpen}
        onClose={closeViewMembersPopup}
        projectName={currentProjectName}
        projectId={currentProjectId}
        onMemberDeleted={fetchProjects}
      />
    </div>
  );
}