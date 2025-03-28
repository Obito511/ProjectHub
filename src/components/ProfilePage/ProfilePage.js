// ProfilePage.jsx
import React from "react";
import EditProfileForm from "../EditProfileForm/EditProfileForm";
import ProfileCard from "../ProfileCard/ProfileCard";
import ProjectsList from "../ProjectsList/ProjectsList";
import './ProfilePage.css';

const projects = [
    { name: "Emo Stuff", image: "obito.webp" },
    { name: "Tim Burton", image: "obito.webp" },
    { name: "Halloween", image: "obito.webp" },
    { name: "Emo Stuff", image: "obito.webp" },
    { name: "Emo Stuff", image: "obito.webp" },
  ];
  const user = {
    name: "Yash Ghori",
    location: "Ahmedabad, Gujarat",
    designation: "UI Intern",
    phone: "+91 7048144030",
    email: "yghori@asite.com",
  };
const ProfilePage = () => {
    return (
        <div className="profile-page-container">
            <div className="profile-left">
                <ProfileCard />
            </div>
            <div className="profile-center">
            <EditProfileForm users={user} />
            </div>
            <div className="profile-right">
            <ProjectsList projects={projects} />
            </div>
        </div>
    );
};

export default ProfilePage;
