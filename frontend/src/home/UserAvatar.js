import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './UserAvatar.css';

const UserAvatar = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem('UserId');
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${userId}`);
        setUser(res.data);
        setFormData(res.data); // Pre-fill editable fields
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const toggleDropdown = () => {
    setShowDetails(!showDetails);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('UserId');
    try {
      const response = await axios.put(`http://localhost:5000/api/user/${userId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Update the frontend state
      setUser(response.data);
      setIsEditing(false);
      alert('User profile updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update profile');
    }
  };
  

  return (
    <div className="user-avatar-container">
      <div className="user-avatar-circle" onClick={toggleDropdown}>
        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </div>

      {showDetails && (
        <div className="user-details-dropdown">
          <h3>User Details</h3>

          {isEditing ? (
            <>
              <p><strong>Name:</strong> <input type="text" name="name" value={formData.name} onChange={handleChange} /></p>
              <p><strong>Email:</strong> <input type="email" name="email" value={formData.email} onChange={handleChange} /></p>
              <p><strong>Phone:</strong> <input type="text" name="phone" value={formData.phone} onChange={handleChange} /></p>
              <p><strong>Address:</strong> <input type="text" name="address" value={formData.address} onChange={handleChange} /></p>
              <button onClick={handleSave} className="btn-save">Save</button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Address:</strong> {user.address}</p>
              <button onClick={handleEditClick} className="btn-edit">Edit</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
