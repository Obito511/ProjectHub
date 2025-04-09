import React, { useState } from "react";
import "./ProjectForm.css";
import Vnavbar from "../Vnavbar/Vnavbar";
import Navbar from "../Navbar/Navbar";

const ProjectForm = () => {
  const [title, setTitle] = useState("Addodle");
  const [projectType, setProjectType] = useState("Type - I");
  const [startDate, setStartDate] = useState("2022-05-01");
  const [endDate, setEndDate] = useState("2022-12-01");
  const [description, setDescription] = useState(
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"
  );
  const [roles, setRoles] = useState([
    { name: "Yash", role: "Team lead", selected: true },
    { name: "Yash", role: "Team lead", selected: false },
    { name: "Yash", role: "Team lead", selected: false },
    { name: "Yash", role: "Team lead", selected: false },
    { name: "Yash", role: "Team lead", selected: false },
  ]);

  const handleRoleChange = (index) => {
    setRoles((prevRoles) =>
      prevRoles.map((role, i) =>
        i === index ? { ...role, selected: !role.selected } : role
      )
    );
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Project Type</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                >
                  <option value="Type - I">Type - I</option>
                  <option value="Type - II">Type - II</option>
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Project Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group roles">
              <label>Project Roles</label>
              <div className="roles-container">
                {roles.map((role, index) => (
                  <div key={index} className="role-item">
                    <input
                      type="checkbox"
                      checked={role.selected}
                      onChange={() => handleRoleChange(index)}
                    />
                    <span>
                      {role.name} <em>{role.role}</em>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="button-group">
              <button className="delete-btn">Delete</button>
              <button className="create-btn">Create</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectForm;
