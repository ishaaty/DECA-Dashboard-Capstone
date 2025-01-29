import React, { useState, useEffect } from 'react';
import './Participants.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import AdminCard from './AdminCard/AdminCard';
import ExportCard from './ExportCard/ExportCard';
import axios from 'axios';

export default function Participants(props) {
  const [participants, setParticipants] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [admins, setAdmins] = useState([]);  // Added state for admins
  const [error, setError] = useState(null);

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
    fetchUsersByRole('admin', setAdmins);  // Fetch admins
  }, []);

  const renderAdminContent = () => {
    if (props.userRole !== 'participant') {
      return <ExportCard />;
    }
    return null;
  };

  const renderParticipants = () => {
    if (error) return <p>{error}</p>;
    if (participants.length === 0) return <p>Loading participants...</p>;

    return participants.map((participant) => (
      <a
        key={participant.user_id}
        className="partanchor"
        href={`/participantdetails?userFirst=${participant.first_name}&userLast=${participant.last_name}`}
      >
        <h4 className="partname">
          {participant.first_name} {participant.last_name}
        </h4>
      </a>
    ));
  };

  const renderBoardMembers = () => {
    if (error) return <p>{error}</p>;
    if (boardMembers.length === 0) return <p>Loading board members...</p>;

    return boardMembers.map((boardMember) => (
      <AdminCard
        key={boardMember.user_id}
        name={`${boardMember.first_name} ${boardMember.last_name}`}
        email={boardMember.email}
      />
    ));
  };

  const renderAdmins = () => {  // Render admins under Advisors section
    if (error) return <p>{error}</p>;
    if (admins.length === 0) return <p>Loading admins...</p>;

    return admins.map((admin) => (
      <AdminCard
        key={admin.user_id}
        name={`${admin.first_name} ${admin.last_name}`}
        email={admin.email}
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
