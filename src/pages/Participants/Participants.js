import React, { useState, useEffect, useContext } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext';

import { Link } from 'react-router-dom'; // Import Link from react-router-dom
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
  const [error, setError] = useState(null);

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

    // Fetch participants, board members, and admins
    fetchUsersByRole('participant', setParticipants);
    fetchUsersByRole('board member', setBoardMembers);
    fetchUsersByRole('admin', setAdmins);
  }, []);

  // If the user is an admin, include an export card
  const renderAdminContent = () => {
    if (userRole === 'admin' || userRole === 'board member') {
      return <ExportCard />;
    }
    return null;
  };

  // Display the participants that were retrieved from the database
  const renderParticipants = () => {
    if (error) return <p>{error}</p>;
    if (participants.length === 0) return <p>Loading participants...</p>;

    return participants.map((participant) => (
      <Link
        key={participant.user_id}
        className="partanchor"
        to={`/participantdetails?userFirst=${participant.first_name}&userLast=${participant.last_name}`} // Use 'Link' for navigation
      >
        <h4 className="partname">
          {participant.first_name} {participant.last_name}
        </h4>
      </Link>
    ));
  };

  // Display the board members that were retrieved from the database
  const renderBoardMembers = () => {
    if (error) return <p>{error}</p>;
    if (boardMembers.length === 0) return <p>Loading board members...</p>;

    return boardMembers.map((boardMember) => (
      <AdminCard
        key={boardMember.user_id}
        firstName={boardMember.first_name}
        lastName={boardMember.last_name}
        email={boardMember.email}
      />
    ));
  };

  // Display the admins that were retrieved from the database
  const renderAdmins = () => {
    if (error) return <p>{error}</p>;
    if (admins.length === 0) return <p>Loading admins...</p>;

    return admins.map((admin) => (
      <AdminCard
        key={admin.user_id}
        firstName={admin.first_name}
        lastName={admin.last_name}
        email={admin.email}
        role="admin"
      />
    ));
  };

  return (
    <>
      <Header />
      <Menu />
      <div>
        <h1 id="partheader">Participants</h1>
        <div className="partcontainer">
          <div>
            {/* from Rebirth Textbook */}
          {/* <input id="searchbar" onkeyup="search_book()" type="text" name="search" placeholder="Search by Subject:" /> */}

            {/* from the video (3 minutes in)*/}
            {/* <p>Search</p>
            <form name="form1" method="post" action="searchresults.pfp">
              <input name="search" type="text" size="40" maxlength="50" />
              <input type="submit" name="Submit" value="Search" />
            </form> */}
            {/* ahhhhhhhhh */}
            <div>
              <h3 id="advisors">Advisors</h3>
              {renderAdmins()}
            </div>
            <div>
              <h3 id="board">Board Members</h3>
              {renderBoardMembers()}
            </div>
            <div>
              <h3 id="member">Members</h3>
              <div className="partlist">{renderParticipants()}</div>
            </div>
          </div>
          <div id="exportcontainer">{renderAdminContent()}</div>
        </div>
      </div>
    </>
  );
}
