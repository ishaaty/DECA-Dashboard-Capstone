import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './UserDetails.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import { UserRoleContext } from '../../context/UserRoleContext';

export default function UserDetails() {
  const userRole = useContext(UserRoleContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userFirst = params.get('userFirst');
  const userLast = params.get('userLast');

  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const fetchParticipantDetails = async () => {
      try {
        let response;

        try {
          // Try using the production backend URL first
          response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/participantdetails/displaydetails`, {
            params: { userFirst, userLast },
          });
        } catch (error) {
          console.warn('Error fetching from production backend, falling back to localhost...');
          // If the production backend fails, fallback to localhost:8081
          response = await axios.get('http://localhost:8081/participantdetails/displaydetails', {
            params: { userFirst, userLast },
          });
        }
        setParticipant(response.data);
        setSelectedRole(response.data.position || '');
      } catch (err) {
        console.error('Error fetching participant details:', err);
        setError('Failed to fetch participant details.');
      } finally {
        setLoading(false);
      }
    };

    if (userFirst && userLast) {
      fetchParticipantDetails();
    }
  }, [userFirst, userLast]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const updateUserRole = async () => {
    if (!selectedRole) {
      alert('Please select a role.');
      return;
    }

    if (!participant || !participant.userId) {
      alert('User ID is missing. Cannot update role.');
      return;
    }

    try {

      try {
        // Try using the production backend URL first
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/participantdetails/updateusers`, {
          userIds: [participant.userId],
          position: selectedRole,
        });
      } catch (error) {
        console.warn('Error updating user on production backend, falling back to localhost...');
        
        // If the production backend fails, fallback to localhost:8081
        await axios.put('http://localhost:8081/participantdetails/updateusers', {
          userIds: [participant.userId],
          position: selectedRole,
        });
      }
      setParticipant((prev) => ({ ...prev, position: selectedRole }));
      alert('User role updated successfully!');
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role.');
    }
  };

  const renderEvents = () => {
    if (!participant?.events?.length) {
      return <p>No events</p>;
    }

    return participant.events.map((event, index) => (
      <p key={index} className="event-name">{event.eventName}</p>
    ));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Header />
      <Menu />
      <h1 id="partheader">User Details test test test</h1>
      <div className="partdetailcontainer">
        <h3 id="detailname">Name: {participant.userFirst} {participant.userLast}</h3>
        <h3 id="detailemail">Email: {participant.userEmail}</h3>
        <h3 id="detailclass">Class: {participant.userClass}</h3>
        <div className="partevents">
          <h3 id="parteventhead">Events</h3>
          {renderEvents()}
        </div>

        {userRole === 'admin' && (
          <div className="roleselection">
            <label>Select Role: </label>
            <select className="roleselect" value={selectedRole} onChange={handleRoleChange}>
              <option value="">--Select Role--</option>
              <option value="Admin">Admin</option>
              <option value="Participant">Participant</option>
              <option value="Board Member">Board Member</option>
              <option value={null}>No Role</option>
            </select>
            <button id="updatebtn" onClick={updateUserRole}>Update Role</button>
          </div>
        )}
      </div>
    </>
  );
}
