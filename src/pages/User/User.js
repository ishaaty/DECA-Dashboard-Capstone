import React, { useState, useEffect, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { UserRoleContext } from '../../context/UserRoleContext';
import './User.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import axios from 'axios';

export default function User() {
  const [participants, setParticipants] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [errors, setErrors] = useState({ participants: null, boardMembers: null, admins: null });

  const { user } = useAuth0();
  const userEmail = user?.email;
  const { getAccessTokenSilently } = useAuth0();

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  // Dropdown options
  const genderOptions = ['Male', 'Female', 'Other'];
  const demographicOptions = [
    'American Indian/Alaskan Native',
    'Asian/Asian-American/Pacific Islander',
    'Black/African-American',
    'Latino/Hispanic',
    'Middle-Eastern',
    'Opt-Out',
    'Other',
    'White/Caucasian'
  ];

  useEffect(() => {
    const fetchUsersByRole = async (role, setState, errorKey) => {
      try {
        const token = await getAccessTokenSilently({
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        });
        let response;
        try {
          response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/participantdetails/displayusers`, {
            params: { position: role },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.warn('Error fetching from production backend, falling back to localhost...');
          response = await axios.get('http://localhost:8081/participantdetails/displayusers', {
            params: { position: role },
          });
        }

        console.log(`Fetched ${role}s:`, response.data);
        setState(Array.isArray(response.data) ? response.data : []);
        setErrors((prev) => ({ ...prev, [errorKey]: null }));
      } catch (err) {
        console.error(`Error fetching ${role}s:`, err);
        setErrors((prev) => ({ ...prev, [errorKey]: `Failed to load ${role}s.` }));
      }
    };

    fetchUsersByRole('participant', setParticipants, 'participants');
    fetchUsersByRole('board member', setBoardMembers, 'boardMembers');
    fetchUsersByRole('admin', setAdmins, 'admins');
  }, []);

  const getCurrentUser = (users) => {
    return users.find(
      u => u.account_email?.trim().toLowerCase() === userEmail?.trim().toLowerCase()
    );
  };

  const handleSave = async (updatedUser, originalUser) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/profile/update`, updatedUser);

      const updateUserList = (users, setUsers) => {
        const updatedList = users.map(u => u.user_id === updatedUser.user_id ? updatedUser : u);
        setUsers(updatedList);
      };

      if (originalUser.position === 'admin') updateUserList(admins, setAdmins);
      else if (originalUser.position === 'board member') updateUserList(boardMembers, setBoardMembers);
      else updateUserList(participants, setParticipants);

      setIsEditing(false);
      setEditedUser(null);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const renderUserCard = (user) => {
    const isCurrentEditing = isEditing && editedUser?.user_id === user.user_id;

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleCancel = () => {
      setIsEditing(false);
      setEditedUser(null);
    };

    const fields = [
      { label: 'First Name', key: 'first_name' },
      { label: 'Last Name', key: 'last_name' },
      { label: 'Class', key: 'user_class' },
      { label: 'Cell Phone', key: 'cell_phone' },
      { label: 'Home Phone', key: 'home_phone' },
      { label: 'Gender', key: 'gender' },
      { label: 'Demographic', key: 'demographic' },
      { label: 'Date of Birth', key: 'dob' },
      { label: 'Years Experience', key: 'years_experience'},
      { label: 'Position', key: 'position' },
    ];

    return (
      <div key={user.user_id} className="user-card">
        <h2>User Profile</h2>
        {fields.map(({ label, key }) => (
          <h4 key={key}>
            {isCurrentEditing && key !== 'position' ? (
              <>
                <span>{label}: </span>
                {key === 'gender' ? (
                  <select name={key} value={editedUser[key] || ''} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : key === 'demographic' ? (
                  <select name={key} value={editedUser[key] || ''} onChange={handleChange}>
                    <option value="">Select Demographic</option>
                    {demographicOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={editedUser[key] || ''}
                    onChange={handleChange}
                  />
                )}
              </>
            ) : (
              `${label}: ${user[key]}`
            )}
          </h4>
        ))}

        {!isCurrentEditing ? (
          <button onClick={() => { setIsEditing(true); setEditedUser({ ...user }); }}>Edit</button>
        ) : (
          <>
            <button onClick={() => handleSave(editedUser, user)}>Save</button>
            <button onClick={handleCancel} style={{ backgroundColor: '#6c757d', marginLeft: '0.5rem' }}>Cancel</button>
          </>
        )}
      </div>
    );
  };

  const currentAdmin = getCurrentUser(admins);
  const currentBoardMember = getCurrentUser(boardMembers);
  const currentParticipant = getCurrentUser(participants);

  return (
    <>
      <Header />
      <Menu />
      <div>
        <div className="partcontainer">
          {currentAdmin && <div>{renderUserCard(currentAdmin)}</div>}
          {currentBoardMember && <div>{renderUserCard(currentBoardMember)}</div>}
          {currentParticipant && <div>{renderUserCard(currentParticipant)}</div>}

          {!currentAdmin && !currentBoardMember && !currentParticipant && (
            <p style={{ color: 'red' }}>No user data found for your account.</p>
          )}
        </div>
      </div>
    </>
  );
}
