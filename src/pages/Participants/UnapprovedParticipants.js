import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UnapprovedParticipants.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';

export default function UnapprovedParticipants({ userRole }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersByRole = async (role, setState) => {
      try {
        const response = await axios.get('http://localhost:8081/participantdetails/displayunapprovedusers', {
          params: { position: role },
        });
        console.log(`Response for user:`, response.data);
        setState(Array.isArray(response.data) ? response.data : []); // Ensure data is an array
      } catch (err) {
        console.error(`Error fetching users:`, err);
        setError(`Failed to load users.`);
      }
    };

    // Fetch users
    fetchUsersByRole(null, setUsers);
  }, []);

  const renderUsers = () => {
    if (error) return <p>{error}</p>;
    if (users.length === 0) return <p>Loading users...</p>;

    return users.map((user) => (
      <div className="userselection" key={user.id}>
        <input type="checkbox" id="partcheck" />
        <label>{user.first_name} {user.last_name}</label>
      </div>
    ));
  };

  return (
    <>
      <Header />
      <Menu />

      <h1 id="partheader">Unapproved Participants</h1>
      <div className="approvals">
        {renderUsers()}
        <div className="approvepartcont">
          <button id="approve">Approve (Member)</button>
          <button id="approve">Approve (Board)</button>
          <button id="deny">Deny Request</button>
        </div>
      </div>
    </>
  );
}
