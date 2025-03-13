import React, { useState, useEffect, useContext } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import './User.css';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

export default function User() {
  const [userDetails, setUserDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  const { user, isAuthenticated } = useAuth0();
  const userRole = useContext(UserRoleContext);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isAuthenticated || !user?.email) return;
      try {
        console.log('User email:', user.email);
        const { data: userId } = await axios.get('http://localhost:8081/user/get-user-id', {
          params: { email: user.email },
        });
        console.log('User ID:', userId.user_id);
        
        const { data: userInfo } = await axios.get('http://localhost:8081/user/user-info', {
          params: { user_id: userId.user_id }, // Use 'user_id' as expected in the backend
        });        
        console.log('User info:', userInfo);
        setUserDetails(userInfo);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details.');
      }
    };

    fetchUserDetails();
  }, [isAuthenticated, user?.email]);

  const handleEditClick = () => {
    setEditMode(true);
    setEditedUser({ ...userDetails });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:8081/user/user-info/${userDetails.user_id}`, editedUser);
      setUserDetails(editedUser);
      setSuccessMessage('User information updated successfully!');
      setEditMode(false);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user information.');
    }
  };

  if (error) return <p>{error}</p>;
  if (!userDetails) return <p>Loading user details...</p>;

  return (
    <>
      <Header />
      {/* <Menu /> */}
      <div className="user-info">
        <h1 id="profileheader">User Profile</h1>
        {successMessage && <p>{successMessage}</p>}
        {editMode ? (
          <div>
            <label>First Name:</label>
            <input type="text" name="first_name" value={editedUser.first_name} onChange={handleInputChange} />
            <label>Last Name:</label>
            <input type="text" name="last_name" value={editedUser.last_name} onChange={handleInputChange} />
            <button onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        ) : (
          <div>
            <p>First Name: {userDetails.first_name}</p>
            <p>Last Name: {userDetails.last_name}</p>
            <p>Email: {userDetails.email}</p>
            {/* <button onClick={handleEditClick}>Edit</button> */}
          </div>
        )}
      </div>
    </>
  );
}
