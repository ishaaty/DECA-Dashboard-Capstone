import React, { useState, useEffect, useContext } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext';
import { Link } from 'react-router-dom';
import './Participants.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import AdminCard from './AdminCard/AdminCard';
import ExportCard from './ExportCard/ExportCard';
import axios from 'axios';


export default function Participants() {
  const [participants, setParticipants] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [errors, setErrors] = useState({ participants: null, boardMembers: null, admins: null });
  const [searchQuery, setSearchQuery] = useState('');

  const userRole = useContext(UserRoleContext);

  useEffect(() => {
    const fetchUsersByRole = async (role, setState, errorKey) => {
      try {
        const response = await axios.get('http://localhost:8081/participantdetails/displayusers', {
          params: { position: role },
        });
        console.log(`Response for ${role}:`, response.data);
        setState(Array.isArray(response.data) ? response.data : []);
        setErrors((prevErrors) => ({ ...prevErrors, [errorKey]: null }));
      } catch (err) {
        console.error(`Error fetching ${role}s:`, err);
        setErrors((prevErrors) => ({ ...prevErrors, [errorKey]: `Failed to load ${role}s.` }));
      }
    };

    fetchUsersByRole('participant', setParticipants, 'participants');
    fetchUsersByRole('board member', setBoardMembers, 'boardMembers');
    fetchUsersByRole('admin', setAdmins, 'admins');
  }, []);

  const renderUserList = (users, error, roleName, isAdminCard = false) => {
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (users.length === 0) return <p>No {roleName} found.</p>;

    // If the user searches, shows only search results
    const filteredUsers = users.filter(user =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredUsers.length === 0) return <p>No matching users found.</p>;

    return filteredUsers.map((user) =>
      isAdminCard ? (
        <AdminCard
          key={user.user_id}
          firstName={user.first_name}
          lastName={user.last_name}
          email={user.email}
        />
      ) : (
        <Link
          key={user.user_id}
          className="partanchor"
          to={`/participantdetails?userFirst=${user.first_name}&userLast=${user.last_name}`}
        >
          <h4 className="partname">
            {user.first_name} {user.last_name}
          </h4>
        </Link>
      )
    );
  };

  return (
    <>
      <Header />
      <Menu />
      <div>
        <h1 id="partheader">Participants</h1>
          <input
            type="text"
            placeholder="Search names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        <div className="partcontainer">
          <div>
            <div>
              <h3 id="advisors">Advisors</h3>
              {renderUserList(admins, errors.admins, 'admins', true)}
            </div>
            <div>
              <h3 id="board">Board Members</h3>
              {renderUserList(boardMembers, errors.boardMembers, 'board members', true)}
            </div>
            <div>
              <h3 id="member">Members</h3>
              <div className="partlist">
                {renderUserList(participants, errors.participants, 'participants')}
              </div>
            </div>
          </div>
          {userRole === 'admin' && <ExportCard />}
        </div>
      </div>
    </>
  );
}
