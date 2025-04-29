import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Vnavbar from '../Vnavbar/Vnavbar';

function Navbar() {
  const [user, setUser] = useState(null);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
        .then(res => {
          console.log("Response Status:", res.status);
          return res.text();
        })
        .then(text => {
          console.log("Response Body:", text);
          try {
            const data = JSON.parse(text);
            console.log("Current user:", data);
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

  // Close mobile menu when window resizes above mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

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
          {/* Preserve your original logo here */}
          <div className="logo">
            {/* If you have a logo image */}
            <img src="/name.png" alt="Logo" className="logo-image" />
            {/* Or if you don't have an image but had some text/element */}
          </div>
        </div>

        <div className="navbar-center">
          <div className="search-container">
            <SearchIcon 
              className="search-icon" 
              onClick={() => setSearchOpen(!searchOpen)} 
            />
            <input 
              type="text" 
              placeholder="Search..." 
              className={searchOpen ? "search-active" : ""} 
            />
          </div>
        </div>

        <div className="navbar-right">
          <button className="notification-icon">
            <NotificationsIcon />
          </button>

          <div 
            className="profile-container" 
            onClick={() => setShowDisconnect(!showDisconnect)}
          >
            <div className="profile">
            <img 
  src={user?.profilePicture || "/profile-placeholder.jpg"} 
  alt="Profile" 
  className="profile-pic" 
/>
              <div className="profile-info">
                <div className="profile-name">
                  {user?.first_name} {user?.last_name}
                </div>
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

      {/* Mobile Sidebar - Controlled by state */}
      <div className="main-container">
        <Vnavbar isMobileOpen={mobileMenuOpen} setIsMobileOpen={setMobileMenuOpen} />
        <div className="content">
          {/* Your main content goes here */}
        </div>
      </div>
    </>
  );
}

export default Navbar;