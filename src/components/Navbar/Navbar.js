import React from "react";
import "./Navbar.css"; 
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from "@mui/icons-material/Search";

function Navbar () {
    
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo"><img src="name.png" alt="Logo" className="logo-image" /></div>
      </div>

      <div className="navbar-center">
        
      </div>

      <div className="navbar-right">
      <div className="search-container">
        <SearchIcon className="search-icon" />
        <input type="text" placeholder="Search for anything..." className="search-bar" />
      </div>
        <button className="notification-icon"><NotificationsIcon className="icon" /></button>
        <div className="profile">
          <img
            src="https://scontent.ftun4-2.fna.fbcdn.net/v/t39.30808-6/475458415_9123100497768308_4962318396385105559_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=Gj3mwszGFJYQ7kNvgEjHhPd&_nc_oc=Adh2SAjqT2oISWXuAJ2PQpFKDtl2cD_vmPyBB0aJzuxCfdTJZ7RhL0SbWVkUXikp2TQ&_nc_zt=23&_nc_ht=scontent.ftun4-2.fna&_nc_gid=AuVkQV6LWvacZsvbKAAZyII&oh=00_AYCGPV57mMffQztPLtC0MKxkO-2cZaHCd2T6PEGyjSyY_w&oe=67C79514"
            alt="Profile"
            className="profile-pic"
          />
          <div className="profile-info">
            <span className="profile-name">Aziz Jallali</span>
            <span className="profile-location">Hlif</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
