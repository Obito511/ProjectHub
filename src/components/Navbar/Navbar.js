import React, { useState } from "react";
import "./Navbar.css"; 
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        <div className="logo">
          <img src="name.png" alt="Logo" className="logo-image" />
        </div>
      </div>

      <div className={`navbar-center ${searchOpen ? "show-search" : ""}`}>
        <div className="search-container">
          <SearchIcon className="search-icon" onClick={() => setSearchOpen(!searchOpen)} />
          <input type="text" placeholder="Search..." className="search-bar" />
        </div>
      </div>

      <div className={`navbar-right ${menuOpen ? "menu-open" : ""}`}>
        <button className="notification-icon">
          <NotificationsNoneIcon className="icon" />
        </button>
        <div className="profile">
          <img src="https://i.pravatar.cc/32" alt="Profile" className="profile-pic" />
          <div className="profile-info">
            <span className="profile-name">Mohamed Aziz Jallali</span>
            <span className="profile-location">Hlif</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
