import React, { useState } from "react";
import "./Createtask.css";
import Vnavbar from '../Vnavbar/Vnavbar';
import Navbar from "../Navbar/Navbar";
import { useEffect } from "react";
import axios from 'axios';

const TaskForm = () => {
  const priorityOptions = ["High", "Medium", "Low"];
  const statusOptions = ["Pending", "In Progress", "Completed"];
  const [projects, setProjects] = useState([]);

  const [task, setTask] = useState({
    title: "",
    type: "",
    startDate: "",
    endDate: "",
    description: "",
    priority: ["High"],
    status: ["Pending"],
    project: "" 
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSelect = (e, field) => {
    const value = e.target.value;
    if (value && !task[field].includes(value)) {
      setTask({ ...task, [field]: [...task[field], value] });
    }
  };

  const handleRemove = (value, field) => {
    setTask({ ...task, [field]: task[field].filter(item => item !== value) });
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

  const formatClassName = (text) => text.toLowerCase().replace(/\s+/g, '-');
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const filteredTask = {
        title: task.title,
        type: task.type,
        startDate: formatDate(task.startDate),
        endDate: formatDate(task.endDate),
        description: task.description,
        project: {
          idprojet: parseInt(task.project)
        }
      };
      
      console.log("Submitting task:", filteredTask);

      // Send data to API
      const response = await axios.post(
        "http://localhost:9090/api/tasks/create",
        filteredTask,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token").trim()}`
          },
        }
      );

      // Only reset task state, not the projects list
      console.log("Task created successfully!");
      setTask({
        title: "",
        type: "",
        startDate: "",
        endDate: "",
        description: "",
        priority: ["High"], // Reset to default values
        status: ["Pending"],
        project: "" 
      });

      alert("Task created successfully!");
    } catch (error) {
      console.error("Error:", error.response || error.message);
      if (error.response) {
        console.log("Response data:", error.response.data);
        alert(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.log("Request:", error.request);
        alert("No response received from server. Check your connection.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
};

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:9090/api/projects/owner/${localStorage.userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("token: " + localStorage.getItem("token"));
        setProjects(response.data || []); // Fallback to empty array if response.data is undefined or null
      } catch (error) {
        console.error("Error:", error);
        if (error.response) {
          console.log("Response data:", error.response.data);
          console.log("Response status:", error.response.status);
          alert(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          console.log("Request:", error.request);
          alert("No response received from server. Check your connection.");
        } else {
          alert(`Error: ${error.message}`);
        }
      }
    };
  
    fetchProjects();
  }, []);
  
  return (
    <div className="div0">
      <Navbar />
      <div className="div2">
        <div className="div3"><Vnavbar /></div>
        <div className="div4">
          <div className="task-form-container">
            <form className="task-form"onSubmit={handleSubmit}>
            <div className="task-inputs">
                <div>
                  <label htmlFor="title">Task Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Task Title"
                    value={task.title}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="type">Task Type</label>
                  <input
                    type="text"
                    name="type"
                    placeholder="Task Type"
                    value={task.type}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={task.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={task.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="select-group">
                <label>Project</label>
                <select name="project" value={task.project} onChange={handleChange}>
                  <option value="">Select a project</option>
                  {Array.isArray(projects) && projects.map((proj, index) => (
                    <option key={proj.idprojet || index} value={proj.idprojet}>
                      {proj.nom}
                    </option>
                  ))}
                </select>
              </div>


              <textarea
                name="description"
                placeholder="Task Description"
                value={task.description}
                onChange={handleChange}
              />

              <div className="task-op-row">
                <div className="select-group">
                  <label>Assignee</label>
                  <select name="assignee" value="" onChange={handleChange}>
                    <option>Yash Ghori</option>
                  </select>
                </div>

                {["priority", "status"].map((field) => (
                  <div className="select-group" key={field}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <div className="multi-select">
                      {task[field].map((item) => (
                        <span className={`tag ${formatClassName(item)}`} key={item}>
                          {item}
                          <button onClick={() => handleRemove(item, field)}>✖</button>
                        </span>
                      ))}
                      <select onChange={(e) => handleSelect(e, field)}>
                        <option value="">Select {field.charAt(0).toUpperCase() + field.slice(1)}</option>
                        {(field === "priority" ? priorityOptions : statusOptions).map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
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
