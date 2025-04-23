import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditProfileForm.css";

const EditProfileForm = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    timezone: "",
    profilePicture: "",
  });

  // Fetch user on component mount
  useEffect(() => {
    axios.get("http://localhost:9090/api/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:9090/api/auth/update", user, { withCredentials: true });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Something went wrong while updating.");
    }
  };

  return (
    <div className="profile-card edit-profile-card">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="form-section">

        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input 
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter first name"
            />
          </div> 
        </div>
        <div className="form-row">
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter last name"
              />
            </div>
          </div>

        <div className="form-row">

          <div className="form-group">
            <label>Password (not editable)</label>
            <input
              type="password"
              value="********"
              disabled
              className="form-input"
            />
          </div>
        </div>

        <button type="submit" className="save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;
