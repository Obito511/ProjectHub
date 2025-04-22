import React, { useEffect, useState } from "react";
import './ProfileCard.css';
import { MdEmail, MdLocationOn, MdWork, MdPhone } from "react-icons/md";

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:9090/api/auth/me', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include"
        });

        console.log("Response Status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        console.log("Response Body:", text);

        try {
          const userData = JSON.parse(text);
          console.log("Current user:", userData);
          setUser(userData);
        } catch (parseError) {
          throw new Error('Failed to parse JSON response');
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="loading-message">Loading user data...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="card profile-card">
      <div className="profile-header">
        <img
          src={user.profileImage || "obito.webp"}
          alt={user.name || "User"}
          className="profile-image"
        />
        <div className="profile-titles">
          <h2 className="profile-name">
            {user.first_name || "No"} {user.last_name || "Name"}
          </h2>
        </div>
        <div className="detail-item">
          <MdEmail className="icon" />
          <span>{user.email || "No Email"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;