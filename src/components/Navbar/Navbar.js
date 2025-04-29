import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Vnavbar from '../Vnavbar/Vnavbar';
import NotificationListener from './NotificationListener'; // Import the NotificationListener component

function Navbar() {
  const [user, setUser] = useState(null);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // New state for toggling notifications
  const [notifications, setNotifications] = useState([]); // Store notifications
  const navigate = useNavigate();
  const markAsRead = (notificationId) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:9090/api/notifications/mark-read/${notificationId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n
            )
          );
        }
      })
      .catch((error) => console.error('Error marking notification as read:', error));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:9090/api/auth/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then(res => res.text())
        .then(text => {
          try {
            const data = JSON.parse(text);
            setUser(data);
            
          } catch (e) {
            console.log("Error parsing response:", e);
          }
        })
        .catch(error => {
          console.log("Error fetching user data:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (showNotifications) {
      // This effect listens for notifications if the notifications area is open
      // You can handle notifications here if needed
    }
  }, [showNotifications]);

  const handleDisconnect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    setShowDisconnect(false);
    navigate("/login");
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon />
          </button>
          <div className="logo">
            <img src="/name.png" alt="Logo" className="logo-image" />
          </div>
        </div>

        <div className="navbar-center">
          <div className="search-container">
            <SearchIcon className="search-icon" onClick={() => setSearchOpen(!searchOpen)} />
            <input type="text" placeholder="Search..." className={searchOpen ? "search-active" : ""} />
          </div>
        </div>

        <div className="navbar-right">
          <button className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
            <NotificationsIcon />
          </button>

          {/* Notifications Area */}
          {showNotifications && (
  <div className="notifications-dropdown">
    <h4>Your Notifications</h4>
    {notifications.length === 0 ? (
      <p>No new notifications</p>
    ) : (
      <ul>
        {notifications.map((notification) => (
          <li
            key={notification.id}
            style={{ opacity: notification.read ? 0.6 : 1 }}
            onClick={() => markAsRead(notification.id)}
          >
            {notification.message} <br />
            <small>{new Date(notification.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    )}
  </div>
)}

          <div className="profile-container" onClick={() => setShowDisconnect(!showDisconnect)}>
            <div className="profile">
            <img 
  src={user?.profilePicture || "/profile-placeholder.jpg"} 
  alt="Profile" 
  className="profile-pic" 
/>
              <div className="profile-info">
                <div className="profile-name"> {user?.firstName} {user?.lastNname} </div>
                <div className="profile-location">{user?.timezone}</div>
              </div>
            </div>

            {showDisconnect && (
              <div className="disconnect-button" onClick={handleDisconnect}>
                Disconnect
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="main-container">
        <Vnavbar isMobileOpen={mobileMenuOpen} setIsMobileOpen={setMobileMenuOpen} />
        <div className="content"></div>
      </div>

      {/* Notification Listener component */}
      <NotificationListener userId={user?.id} setNotifications={setNotifications} />
    </>
  );
}

export default Navbar;
