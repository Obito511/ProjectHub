import React, { useState } from "react";
import "./Createtask.css";

const TaskForm = () => {
  const priorityOptions = ["High", "Medium", "Low"];
  const statusOptions = ["Pending", "In Progress", "Completed"];

  const [task, setTask] = useState({
    title: "",
    type: "",
    startDate: "",
    endDate: "",
    description: "",
    assignee: "Yash Ghori",
    priority: ["High"],
    status: ["Pending"],
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSelect = (e, field) => {
    const value = e.target.value;
    if (!task[field].includes(value)) {
      setTask({ ...task, [field]: [...task[field], value] });
    }
  };

  const handleRemove = (value, field) => {
    setTask({ ...task, [field]: task[field].filter((item) => item !== value) });
  };

  return (
    <div className="task-form-container">
      <div className="task-form">
        <div className="task-inputs">
          <input type="text" name="title" placeholder="Task Title" value={task.title} onChange={handleChange} />
          <input type="text" name="type" placeholder="Task Type" value={task.type} onChange={handleChange} />
          <input type="date" name="startDate" value={task.startDate} onChange={handleChange} />
          <input type="date" name="endDate" value={task.endDate} onChange={handleChange} />
        </div>
        <textarea name="description" placeholder="Task Description" value={task.description} onChange={handleChange} />
        
        <div className="task-op">
          <select name="assignee" value={task.assignee} onChange={handleChange} className="select">
            <option>Yash Ghori</option>
          </select>
          
          <div className="select-group">
            <label>Priority</label>
            <div className="multi-select">
              {task.priority.map((item) => (
                <span className="tag" key={item}>
                  {item} <button onClick={() => handleRemove(item, "priority")}>✖</button>
                </span>
              ))}
              <select onChange={(e) => handleSelect(e, "priority")}>
                <option value="">Select Priority</option>
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="select-group">
            <label>Task Assigning</label>
            <div className="multi-select">
              {task.status.map((item) => (
                <span className="tag" key={item}>
                  {item} <button onClick={() => handleRemove(item, "status")}>✖</button>
                </span>
              ))}
              <select onChange={(e) => handleSelect(e, "status")}>
                <option value="">Select Status</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="buttons">
          <button className="create">Create</button>
          <button className="delete">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;