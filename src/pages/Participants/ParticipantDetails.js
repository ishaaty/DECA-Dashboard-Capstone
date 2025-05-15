import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './ParticipantDetails.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import PersonalCard from './PersonalCard/PersonalCard';

import { UserRoleContext } from '../../context/UserRoleContext';

export default function ParticipantDetails() {
  let userRole = useContext(UserRoleContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userFirst = params.get('userFirst');
  const userLast = params.get('userLast');
  const { getAccessTokenSilently } = useAuth0();

  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const fetchParticipantDetails = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        });
        let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/participantdetails/displaydetails`, {
          params: { userFirst, userLast },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setParticipant(response.data);
        setSelectedRole(response.data.position || '');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching participant details:', err);
        setError('Failed to fetch participant details.');
        setLoading(false);
      }
    };

    fetchParticipantDetails();
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

    console.log('Sending request with:', {
      userIds: [participant.userId],
      position: selectedRole,
    });

    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });

      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/participantdetails/updateusers`,
        {
          userIds: [participant.userId],
          position: selectedRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setParticipant((prev) => ({ ...prev, position: selectedRole }));
      alert('User role updated successfully!');
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role.');
    }
  };

  const renderEvents = () => {
    if (!participant || !participant.events || participant.events.length === 0) {
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
      <h1 id="partheader">Participant Details</h1>
      <div className="partdetailcontainer">
        <div className="generalinfo">
        <h3 id="detailname">Name: {participant.userFirst} {participant.userLast}</h3>
        <h3 id="detailemail">Email: {participant.userEmail}</h3>
        <h3 id="detailclass">Class: {participant.userClass}</h3>
        <h3 id="detailyears">Years of Experience: {participant.userExperience}</h3>
        <div className="partevents">
          <h3 id="parteventhead">Events</h3>
          {renderEvents()}
        </div>
        </div>
        <div className="admincontent">
        <PersonalCard
          role={userRole}
          cell={participant.userCell}
          home={participant.userHome}
          gender={participant.userGender}
          demographic={participant.userDemographic}
          dob={participant.dob}>
        </PersonalCard>

        {/* Only show this section if userRole is "admin" */}
        {(userRole === "admin" || userRole === "board member") && (
          <div className="roleselection">
            <label>Change Role: </label>
            <select className="roleselect" value={selectedRole} onChange={handleRoleChange}>
              <option id="pickrole" value="">--Select Role--</option>
              <option value="Admin">Admin</option>
              <option value="Participant">Participant</option>
              <option value="Board Member">Board Member</option>
              <option value={null}>No Role</option>
            </select>
            <button id="updatebtn" onClick={updateUserRole}>Update Role</button>
          </div>
        )}
        </div>
        

        

      </div>
    </>
  );
}
