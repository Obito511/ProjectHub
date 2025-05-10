import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import Vnavbar from '../Vnavbar/Vnavbar';
import NotificationListener from './NotificationListener';

function Navbar() {
  const [user, setUser] = useState(null);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    if (!dateString) return ""; // Si dateString est undefined/null, retourner vide
  
    const fixedDateString = dateString.replace(/(\.\d{3})\d+/, '$1');
    const date = new Date(fixedDateString);
  
    if (isNaN(date)) return ""; // Si la date est invalide, retourner vide
  
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };
  
  
  
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
        
      }
      
      )
      .catch((error) => console.error('Error marking notification as read:', error));
  };

  const markAllAsRead = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:9090/api/notifications/mark-all-read`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
          );
        }
      })
      .catch((error) => console.error('Error marking all notifications as read:', error));
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
        .then(res => res.json())
        .then(data => {
          console.log("User data received:", data);
          setUser(data);
        })
        .catch(error => {
          console.log("Error fetching user data:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (showNotifications) {
      // This effect listens for notifications if the notifications area is open
    }
  }, [showNotifications]);

  const handleDisconnect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    setShowDisconnect(false);
    navigate("/login");
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-dropdown') && 
          !event.target.closest('.notification-icon')) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

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
          <div className="search-container1">
            <SearchIcon className="search-icon" onClick={() => setSearchOpen(!searchOpen)} />
            <input type="text" placeholder="Search..." className={`input1 ${searchOpen ? "search-active" : ""}`} />
          </div>
        </div>

        <div className="navbar-right">
          <div className="notification-wrapper">
            <button 
              className={`notification-icon ${unreadCount > 0 ? 'has-unread' : ''}`} 
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <NotificationsIcon />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown">
                <h4>
                  Notifications
                  {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
                </h4>
                
                {notifications.length === 0 ? (
                  <div className="empty-notifications">
                    <NotificationsOffIcon />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <>
                    <ul className="notif_ul">
                      {notifications.map((notification) => (
                        <li
                          key={notification.id}
                          className={!notification.read ? 'unread' : ''}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <p className="notification-message">{notification.message}</p>
                          <span className="notification-time">
                            {formatDate(notification.createdAt)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="notification-actions">
                      <button className="mark-all-read" onClick={markAllAsRead}>
                        <MarkChatReadIcon fontSize="small" style={{ marginRight: '5px' }} />
                        Mark all as read
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="profile-container" onClick={() => setShowDisconnect(!showDisconnect)}>
            <div className="profile">
              <img 
                src={user?.profilePicture || "/placeholder.jpg"} 
                alt="Profile" 
                className="profile-pic" 
              />
              <div className="profile-info">
                {user && (
                  <div className="profile-name">
                    {user.first_name || ''} {user.last_name || ''}
                  </div>
                )}
                <div className="profile-location">{user?.time_zone}</div>
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