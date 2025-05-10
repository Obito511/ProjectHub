import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./TaskBoard.css";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CommentIcon from "@mui/icons-material/Comment";
import SearchIcon from "@mui/icons-material/Search";
import Vnavbar from "../Vnavbar/Vnavbar";
import Navbar from "../Navbar/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import AssignMembersPopup from "../AssignMembersPopup/AssignMembersPopup";
import TaskCommentsPopup from "./TaskCommentsPopup";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteTaskPopup from "./DeleteTaskPopup";
const TaskBoard = () => {
  const { projectId } = useParams();
  const [view, setView] = useState("Grid View");
  const [projectName, setProjectName] = useState("");
  const [projectOwner, setProjectOwner] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAssignMembersOpen, setIsAssignMembersOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [currentTaskTitle, setCurrentTaskTitle] = useState("");
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

const [currentTaskToDelete, setCurrentTaskToDelete] = useState({ 
  id: null, 
  title: '' 
});
const handleTaskDeleted = (deletedTaskId) => {
  const updatedColumns = { ...columns };
  Object.keys(updatedColumns).forEach((columnKey) => {
    updatedColumns[columnKey] = updatedColumns[columnKey].filter(
      (task) => task.id !== deletedTaskId
    );
  });
  setColumns(updatedColumns);
};

  const [columns, setColumns] = useState({
    backlog: [],
    inProgress: [],
    completed: [],
  });

  // Helper function to format task data from API
  const formatTask = (task) => {
    return {
      id: task.id.toString(),
      title: task.title || "Untitled Task",
      description: task.description || "No description",
      days: calculateRemainingDays(task.endDate),
      comments: task.comments?.length || 0,
      attachments: task.attachments?.length || 0,
      users: task.assignees?.map(user => user.id) || []
    };
  };

  // Calculate remaining days
  const calculateRemainingDays = (endDate) => {
    if (!endDate) return 0;
    
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  const fetchCurrentUser = async () => {
    try {
      // Get current user's ID
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      if (userId && token) {
        const response = await axios.get(
          `http://localhost:9090/api/user/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token,
            },
          }
        );
        setCurrentUser(response.data);
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  
  // Fetch project and tasks
  useEffect(() => {
    if (!projectId) return;
    
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // Fetch project details
        const projectResponse = await axios.get(
          `http://localhost:9090/api/projects/${projectId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        
        setProjectName(projectResponse.data.nom || "Project Tasks");
        console.log("Project data:", projectResponse.data);



        
        // Fetch tasks for this project
        const tasksResponse = await axios.get(
          `http://localhost:9090/api/tasks/project/${projectId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        
        // Organize tasks by status
        const tasksByStatus = {
          backlog: [],
          inProgress: [],
          completed: []
        };
        
        if (Array.isArray(tasksResponse.data)) {
          tasksResponse.data.forEach(task => {
            const status = task.statusId || "1";
            
            if (status == "3") {
              tasksByStatus.completed.push(formatTask(task));
            } else if (status == "2") {
              tasksByStatus.inProgress.push(formatTask(task));
            } else {
              tasksByStatus.backlog.push(formatTask(task));
            }
          });
        }
        
        setColumns(tasksByStatus);
        setError(null);
        
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError("Failed to load project tasks");
        
        // Set default data if API fails
        setColumns({
          backlog: [
            {
              id: "1",
              title: "Example Task",
              description: "This is an example task.",
              days: 5,
              comments: 0,
              attachments: 0,
              users: ["A"]
            }
          ],
          inProgress: [],
          completed: []
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);
  

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;

    const updatedColumns = { ...columns };

    if (sourceColumnId === destColumnId) {
      // Reorder within the same column/section
      const column = updatedColumns[sourceColumnId];
      const [movedTask] = column.splice(source.index, 1);
      column.splice(destination.index, 0, movedTask);
    } else {
      // Move to a different column/section
      const sourceColumn = updatedColumns[sourceColumnId];
      const destColumn = updatedColumns[destColumnId];
      const [movedTask] = sourceColumn.splice(source.index, 1);
      destColumn.splice(destination.index, 0, movedTask);
      
      // Here you would update the task status in the backend
      updateTaskStatus(movedTask.id, destColumnId);
    }

    setColumns(updatedColumns);
  };
  
  // Function to update task status in the backend
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      // Map the column ID to a status ID
      let statusId;
      switch(newStatus) {
        case 'inProgress':
          statusId = 2; // Assuming 2 is the ID for "In Progress"
          break;
        case 'completed':
          statusId = 3; // Assuming 3 is the ID for "Completed"
          break;
        default:
          statusId = 1; // Assuming 1 is the ID for "Backlog"
      }
      
      await axios.put(
        `http://localhost:9090/api/tasks/${taskId}`,
        {}, // Empty body since we're just updating status via query param
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          params: {
            statusId: statusId
          }
        }
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Add this function to handle opening the assign members popup
  const handleOpenAssignMembers = (taskId) => {
    setCurrentTaskId(taskId);
    setIsAssignMembersOpen(true);
  };

  const handleOpenComments = (taskId, taskTitle) => {
    setCurrentTaskId(taskId);
    setCurrentTaskTitle(taskTitle);
    setIsCommentsOpen(true);
  };

  const handleMemberAssigned = async (memberId) => {
    try {
      const tasksResponse = await axios.get(
        `http://localhost:9090/api/tasks/project/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      
      // Update the state with refreshed data
      const tasksByStatus = {
        backlog: [],
        inProgress: [],
        completed: []
      };
      
      if (Array.isArray(tasksResponse.data)) {
        tasksResponse.data.forEach(task => {
          const status = task.statusId || 1;
          
          if (status === 3) {
            tasksByStatus.completed.push(formatTask(task));
          } else if (status === 2) {
            tasksByStatus.inProgress.push(formatTask(task));
          } else {
            tasksByStatus.backlog.push(formatTask(task));
          }
        });
      }
      
      setColumns(tasksByStatus);
      
    } catch (error) {
      console.error("Error refreshing tasks:", error);
    }
  };

  const renderTaskCard = (task, index) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="task-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="drag-handle">
            <h4>{task.title}</h4>
            <span>{task.days} Days</span>
           
                              <span 
                              className="delete-icon-container"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentTaskToDelete({ id: task.id, title: task.title });
                                setIsDeletePopupOpen(true);
                              }}
                            >
                              <DeleteIcon className="icon delete-icon" />
                            </span>
            
          </div>
          <p className="disc">{task.description}</p>
          <div className="task-info">
            <span 
              className="comment-icon-container"
              onClick={(e) => {
                e.stopPropagation(); // Prevent dragging when clicking
                handleOpenComments(task.id, task.title);
              }}
            >
              
              <CommentIcon className="icon" /> {task.comments}
            </span>
            <span>
              <FileUploadIcon className="icon" /> {task.attachments}
            </span>
            <div className="task-members">
              <button 
                className="add-member"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent dragging when clicking
                  handleOpenAssignMembers(task.id);
                }}
              >
                <AddIcon className="icon" />
              </button>
              {task.users.map((user, idx) => (
                <img
                  key={idx}
                  src={user?.profilePicture || "/placeholder.jpg"}
                  alt={`User ${idx}`}
                  className="avatar"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
  
  

  return (
    <div className="App">
      <div className="div0">
        <Navbar />
        <div className="div2">
          <div className="div3">
            <Vnavbar />
          </div>
          <div className="div4">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="task-board">
                <h2>{projectName} - Tasks</h2>
                <div className="tasks">
                  {loading ? (
                    <div className="loading-message">Loading tasks...</div>
                  ) : error ? (
                    <div className="error-message">{error}</div>
                  ) : (
                    <>
                      <h3>Overview</h3>
                      <p className="dashboard-subtitle">
                        Edit or modify all cards as you want
                      </p>
                      <div className="dashboard-controls">
                        <div className="search">
                          <SearchIcon className="search-icon" />
                          <input
                            type="text"
                            placeholder="Search Tasks"
                            className="search-input1"
                          />
                        </div>
                        <select
                          className="view-selector"
                          value={view}
                          onChange={(e) => setView(e.target.value)}
                        >
                          <option>List View</option>
                          <option>Grid View</option>
                        </select>
                      </div>
                      <hr />
                      {view === "Grid View" ? (
                        <div className="columns">
                          {Object.entries(columns).map(([columnId, tasks]) => (
                            <Droppable key={columnId} droppableId={columnId}>
                              {(provided) => (
                                <div
                                  className="column"
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  <div className="title">
                                    <h3>{columnId.replace(/([A-Z])/g, " $1")}</h3>
                                    <span className="task-count">{tasks.length}</span>
                                  </div>
                                  <button className="add-btn">
                                    <AddIcon className="icon" />
                                  </button>
                                  <div className="task-list">
                                    {tasks.map((task, index) =>
                                      renderTaskCard(task, index)
                                    )}
                                    {provided.placeholder}
                                  </div>
                                </div>
                              )}
                            </Droppable>
                          ))}
                        </div>
                      ) : (
                        <div className="list-view">
                          {Object.entries(columns).map(([columnId, tasks]) => (
                            <Droppable key={columnId} droppableId={columnId}>
                              {(provided) => (
                                <div
                                  className="list-section"
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  <div className="title">
                                    <h3>{columnId.replace(/([A-Z])/g, " $1")}</h3>
                                    <span className="task-count">{tasks.length}</span>
                                  </div>
                                  <button className="add-btn">
                                    <AddIcon className="icon" />
                                  </button>
                                  <div className="task-list">
                                    {tasks.map((task, index) =>
                                      renderTaskCard(task, index)
                                    )}
                                    {provided.placeholder}
                                  </div>
                                </div>
                              )}
                            </Droppable>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>
      {isDeletePopupOpen && (
        <DeleteTaskPopup
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          taskId={currentTaskToDelete.id}
          taskTitle={currentTaskToDelete.title}
          projectId={projectId}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
      
      {/* Render the AssignMembersPopup component */}
      {isAssignMembersOpen && (
        <AssignMembersPopup
          isOpen={isAssignMembersOpen}
          onClose={() => setIsAssignMembersOpen(false)}
          projectName={projectName}
          projectId={projectId}
          taskId={currentTaskId}
          onMemberAssigned={handleMemberAssigned}
        />
      )}

      {/* Render the TaskCommentsPopup component */}
      {isCommentsOpen && (
        <TaskCommentsPopup
          isOpen={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
          taskId={currentTaskId}
          taskTitle={currentTaskTitle}
        />
      )}
    </div>
  );
};

export default TaskBoard;