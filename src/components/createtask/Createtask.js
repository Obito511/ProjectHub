import React, { useState, useEffect } from "react";
import "./Createtask.css";
import Vnavbar from '../Vnavbar/Vnavbar';
import Navbar from "../Navbar/Navbar";
import axios from 'axios';

const TaskForm = () => {
  const [projects, setProjects] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [task, setTask] = useState({
    title: "",
    type: "",
    startDate: "",
    endDate: "",
    description: "",
    priority: "",
    status: "",
    project: ""
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.priority || !task.status || !task.project) {
      alert("Please select a priority, status, and project.");
      return;
    }
    try {
      const filteredTask = {
        title: task.title,
        type: task.type,
        startDate: formatDate(task.startDate),
        endDate: formatDate(task.endDate),
        description: task.description,
        project: { idprojet: parseInt(task.project) }
      };

      console.log("Submitting task:", filteredTask, "Priority ID:", task.priority, "Status ID:", task.status);

      const response = await axios.post(
        `http://localhost:9090/api/tasks/create?priorityId=${task.priority}&statusId=${task.status}`,
        filteredTask,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token").trim()}`
          }
        }
      );
      console.log("priority"+task.priority)

      console.log("Task created successfully!");
      setTask({
        title: "",
        type: "",
        startDate: "",
        endDate: "",
        description: "",
        priority: "",
        status: "",
        project: ""
      });
      alert("Task created successfully!");
    } catch (error) {
      console.error("Error:", error.response || error.message);
      if (error.response) {
        alert(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        alert("No response received from server. Check your connection.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [projectResponse, priorityResponse, statusResponse] = await Promise.all([
          axios.get(`http://localhost:9090/api/projects/owner/${localStorage.userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:9090/api/priorities`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:9090/api/statuses`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setProjects(projectResponse.data || []);
        setPriorities(priorityResponse.data || []);
        setStatuses(statusResponse.data || []);
        console.log("Priorities:", priorityResponse.data);
        console.log("Statuses:", statusResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load projects, priorities, or statuses.");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="div0">
      <Navbar />
      <div className="div2_task">
        <div className="div3"><Vnavbar /></div>
        <div className="div4">
          <div className="task-form-container">
            <form className="task-form" onSubmit={handleSubmit}>
              <div className="task-inputs">
                <div>
                  <label>Task Title</label>
                  <input type="text" name="title" placeholder="Task Title" value={task.title} onChange={handleChange} />
                </div>
                <div>
                  <label>Task Type</label>
                  <input type="text" name="type" placeholder="Task Type" value={task.type} onChange={handleChange} />
                </div>
                <div>
                  <label>Start Date</label>
                  <input type="date" name="startDate" value={task.startDate} onChange={handleChange} />
                </div>
                <div>
                  <label>End Date</label>
                  <input type="date" name="endDate" value={task.endDate} onChange={handleChange} />
                </div>
              </div>
              <div className="select-group">
                <label>Project</label>
                <select name="project" value={task.project} onChange={handleChange}>
                  <option value="">Select a project</option>
                  {Array.isArray(projects) && projects.map((proj, index) => (
                    <option key={proj.idprojet || index} value={proj.idprojet}>{proj.nom}</option>
                  ))}
                </select>
              </div>
              <textarea name="description" placeholder="Task Description" value={task.description} onChange={handleChange} />
              <div className="task-op-row">
                <div className="select-group">
                  <label>Priority</label>
                  <select name="priority" value={task.priority} onChange={handleChange}>
                    <option value="">Select Priority</option>
                    {priorities.map((priority) => (
                      <option key={priority.id} value={priority.id}>{priority.name}</option>
                    ))}
                  </select>
                </div>
                <div className="select-group">
                  <label>Status</label>
                  <select name="status" value={task.status} onChange={handleChange}>
                    <option value="">Select Status</option>
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id}>{status.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="buttons">
                <button type="submit" className="create">Create</button>
                <button type="button" className="delete">Delete</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;