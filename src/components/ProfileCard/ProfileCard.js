import React, { useEffect, useState } from "react";
import './ProfileCard.css';
import { MdEmail } from "react-icons/md";
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePublicId, setImagePublicId] = useState(null);

  // Cloudinary configuration
  const cld = new Cloudinary({ 
    cloud: { 
      cloudName: 'duxnqtjbb',
      apiKey: '783549275919169'
    } 
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error('No authentication token found');

        const response = await fetch('http://localhost:9090/api/auth/me', {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const userData = await response.json();
        setUser(userData);
        // Extract public ID from Cloudinary URL if needed
        const publicId = userData.cloudinaryPublicId;
        setImagePublicId(publicId);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      
      // Create FormData and send directly to backend
      const formData = new FormData();
      formData.append("image", file);

      // 1. Upload to backend endpoint
      const response = await fetch("http://localhost:9090/api/auth/update-profile-image", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      // 2. Get updated data from backend
      const result = await response.json();
      
      // 3. Update state with new public ID
      setImagePublicId(result.publicId);
      setUser(prev => ({
        ...prev,
        profilePicture: result.url,
        cloudinaryPublicId: result.publicId
      }));

      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Image upload failed:", error);
      alert(error.message || "There was an error updating your profile image.");
    } finally {
      setUploading(false);
    }
  };

  // Image transformation configuration
  const img = imagePublicId ? cld.image(imagePublicId)
    .resize(auto().gravity(autoGravity()).width(250).height(250))
    .format('auto')
    .quality('auto') : null;

  if (loading) return <div className="loading-message">Loading user data...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="card profile-card">
      <div className="profile-header">
        {img ? (
          <AdvancedImage 
            cldImg={img} 
            className="profile-image"
            alt="Profile picture"
          />
        ) : (
          <img 
            src="obito.webp" 
            alt="Default profile" 
            className="profile-image" 
          />
        )}

        <label className="upload-button">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          {uploading ? 'Uploading...' : 'Change Photo'}
        </label>

        <div className="profile-titles">
          <h2 className="profile-name">
          {user?.first_name || "No"} {user?.last_name || "Name"}
          </h2>
        </div>
        <div className="detail-item">
          <MdEmail className="icon" />
          <span>{user?.email || "No Email"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;