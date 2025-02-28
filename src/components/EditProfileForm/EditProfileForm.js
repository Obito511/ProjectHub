import React from "react";
import "./EditProfileForm.css"
const EditProfileForm = ({ user = {} }) => {
    return (
      <div className="edit-profile-form">
        <form>
          <h2>Edit Profile</h2> {/* Move inside the form */}
          <div>
            <label>First Name</label>
            <input type="text" value={user.name || ""} placeholder="First Name" />
          </div>
  
          <div>
            <label>Last Name</label>
            <input type="text" value={user.lastName || ""} placeholder="Last Name" />
          </div>
  
          <div>
            <label>Email</label>
            <input type="email" value={user.email || ""} placeholder="Email" />
          </div>
  
          <div>
            <label>Phone Number</label>
            <input type="text" value={user.phone || ""} placeholder="Phone Number" />
          </div>
  
          <div>
            <label>Designation</label>
            <input type="text" value={user.designation || ""} placeholder="Designation" />
          </div>
  
          <div>
            <label>Nationality</label>
            <input type="text" value={user.nationality || ""} placeholder="Nationality" />
          </div>
  
          <button type="submit">Save</button>
        </form>
      </div>
    );
  };
  
  
export default EditProfileForm;
