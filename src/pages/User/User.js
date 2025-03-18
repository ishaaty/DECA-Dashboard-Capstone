import React, { useState, useEffect, useContext } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext';
import './User.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react'; // Import useAuth0 to access user info

export default function User() {
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  
  const { user, isAuthenticated } = useAuth0(); // Use Auth0 to get logged-in user info
  const userRole = useContext(UserRoleContext);

  useEffect(() => {
    const fetchUsersByRole = async (role, setState) => {
      try {
        const response = await axios.get('http://localhost:8081/participantdetails/displayusers', {
          params: { position: role },
        });
        console.log(`Response for ${role}:`, response.data);
        setState(Array.isArray(response.data) ? response.data : []); // Ensure data is an array
      } catch (err) {
        console.error(`Error fetching ${role}s:`, err);
        setError(`Failed to load ${role}s.`);
      }
    };

    // Fetch all users (participants, board members, admins)
    fetchUsersByRole('participant', setParticipants);
  }, []);

  // Filter participants based on the logged-in user's email
  const filteredParticipants = isAuthenticated && user ? 
    participants.filter(participant => participant.account_email === user.email) 
    : [];

  // Display the participants that were retrieved from the database
  const renderParticipants = () => {
    if (error) return <p>{error}</p>;
    if (filteredParticipants.length === 0) return <p>No matching participants found.</p>;

    return filteredParticipants.map((participant) => (
      <div
        key={participant.user_id}
      >
        <h4>First Name: {participant.first_name}</h4>
        <h4>Last Name: {participant.last_name}</h4>
        <h4>Graduation Year: {participant.user_class}</h4>
        <h4>Position: {participant.position}</h4>
        <h4>Cell Phone: {participant.cell_phone}</h4>
        <h4>Home Phone: {participant.home_phone}</h4>
        <h4>Gender: {participant.gender}</h4>
        <h4>Demographic: {participant.demographic}</h4>
        <h4>Birthday: {participant.dob}</h4>
        <h4>Login Email: {participant.account_email}</h4>
        <h4>School Email: {participant.email}</h4>
      </div>
    ));
  };

  return (
    <>
      <Header />
      <Menu />
      <div>
        <h1 id="partheader">Profile</h1>
        <div className="partcontainer">
          <div>
            <div>
              <div>{renderParticipants()}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}