import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UnapprovedParticipants.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';

export default function UnapprovedParticipants({ userRole }) {
  // const [users, setUsers] = useState([]);
  // const [error, setError] = useState(null);

  

  // useEffect(() => {
  //   const fetchUsersByRole = async (role, setState) => {
  //     try {
  //       const response = await axios.get('http://localhost:8081/participantdetails/displayusers', {
  //         params: { position: role },
  //       });
  //       console.log(`Response for ${role}:`, response.data);
  //       setState(Array.isArray(response.data) ? response.data : []); // Ensure data is an array
  //     } catch (err) {
  //       console.error(`Error fetching ${role}s:`, err);
  //       setError(`Failed to load ${role}s.`);
  //     }
  //   };

  //   // Fetch users
  //   fetchUsersByRole(null, setUsers);
  // }, []);


  return (
    <>
      <Header />
      <Menu />

      <h1 id="partheader">Unapproved Participants</h1>
      <div class="approvals">
        <div class="userselection">
          <input type="checkbox" id="partcheck"></input>
          <label>name</label>
        </div>
        <div class="approvepartcont">
                <button id="approve">Approve (Member)</button>
                <button id="approve">Approve (Board)</button>
                <button id="deny">Deny Request</button>
        </div>
      </div>

    </>
  );
}

// const renderUsers = () => {
//   if (error) return <p>{error}</p>;
//   if (participants.length === 0) return <p>Loading users...</p>;

//   return participants.map((participant) => (
//     <a
//       key={participant.user_id}
//       className="partanchor"
//       href={`/participantdetails?userFirst=${participant.first_name}&userLast=${participant.last_name}`}
//     >
//       <h4 className="partname">
//         {participant.first_name} {participant.last_name}
//       </h4>
//     </a>
//   ));
// };
