import React from "react";
import './ProfileCard.css';
const user = {
  name: "Yash Ghori",
  location: "Ahmedabad, Gujarat",
  designation: "UI Intern",
  phone: "+91 7048144030",
  email: "yghori@asite.com",
};
const ProfileCard = ({ user = {} }) => {
  return (
    <div className="card profile-card">
      <img
        src= "obito.webp"
        alt={user.name || "User"}
        className="profile-image"
      />
      <h2 className="profile-name">{user.name || "No Name"}</h2>
      <p className="profile-location">{user.location || "No Location"}</p>
      <p className="profile-contact">{user.designation || "No Designation"}</p>
      <p className="profile-contact">📞 {user.phone || "No Phone"}</p>
      <p className="profile-contact">✉️ {user.email || "No Email"}</p>
    </div>
  );
};

export default ProfileCard;
