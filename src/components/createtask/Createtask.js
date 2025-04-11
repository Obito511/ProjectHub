import React, { useState } from "react";
import "./Createtask.css";
import Vnavbar from '../Vnavbar/Vnavbar';
import Navbar from "../Navbar/Navbar";
import { useEffect } from "react";

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
    assignee: "Yash Ghori",
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

  const formatClassName = (text) => text.toLowerCase().replace(/\s+/g, '-');
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8080/api/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
  
      const data = await response.json();
      console.log("Task created:", data);
      alert("Task created successfully!");
  
      // Reset form if you want
      setTask({
        title: "",
        type: "",
        startDate: "",
        endDate: "",
        description: "",
        assignee: "Yash Ghori",
        priority: ["High"],
        status: ["Pending"],
      });
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the task.");
    }
  };
  useEffect(() => {
    const userId = "123";
  
    fetch(`http://localhost:8080/api/projects/owner/${userId}`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Failed to fetch projects:", err));
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
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
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
                  <select name="assignee" value={task.assignee} onChange={handleChange}>
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
