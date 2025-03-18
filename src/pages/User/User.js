// import React, { useState, useEffect, useContext } from 'react';
// import { UserRoleContext } from '../../context/UserRoleContext';
// import './User.css';
// import Header from '../../components/Header/Header';
// import Menu from '../../components/Menu/Menu';
// import axios from 'axios';
// import { useAuth0 } from '@auth0/auth0-react'; // Import useAuth0 to access user info

// export default function User() {
//   const [participants, setParticipants] = useState([]);
//   const [boardMembers, setBoardMembers] = useState([]);
//   const [admins, setAdmins] = useState([]);
//   const [error, setError] = useState(null);

//   const { user, isAuthenticated } = useAuth0(); // Use Auth0 to get logged-in user info
//   const userRole = useContext(UserRoleContext);

//   useEffect(() => {
//     const fetchUsersByRole = async (role, setState) => {
//       try {
//         const response = await axios.get('http://localhost:8081/participantdetails/displayusers', {
//           params: { position: role },
//         });
//         console.log(`Response for ${role}:`, response.data);
//         setState(Array.isArray(response.data) ? response.data : []); // Ensure data is an array
//       } catch (err) {
//         console.error(`Error fetching ${role}s:`, err);
//         setError(`Failed to load ${role}s.`);
//       }
//     };

//     // Fetch users for all roles: participants, board members, admins
//     fetchUsersByRole('participant', setParticipants);
//     fetchUsersByRole('board member', setBoardMembers);
//     fetchUsersByRole('admin', setAdmins);
//   }, []);

//   // Filter users based on the logged-in user's email and role
//   const filteredUsers = (role) => {
//     if (isAuthenticated && user) {
//       switch(role) {
//         case 'participant':
//           return participants.filter(participant => participant.account_email === user.email);
//         case 'board member':
//           return boardMembers.filter(boardMember => boardMember.account_email === user.email);
//         case 'admin':
//           return admins.filter(admin => admin.account_email === user.email);
//         default:
//           return [];
//       }
//     }
//     return [];
//   };

//   // Render the users based on the filtered data
//   const renderUsers = (role, filteredUsers) => {
//     if (error) return <p>{error}</p>;
//     if (filteredUsers.length === 0) return <p>No matching {role}s found.</p>;

//     return filteredUsers.map((user) => (
//       <div key={user.user_id}>
//         <h4>First Name: {user.first_name}</h4>
//         <h4>Last Name: {user.last_name}</h4>
//         <h4>Graduation Year: {user.user_class}</h4>
//         <h4>Position: {user.position}</h4>
//         <h4>Cell Phone: {user.cell_phone}</h4>
//         <h4>Home Phone: {user.home_phone}</h4>
//         <h4>Gender: {user.gender}</h4>
//         <h4>Demographic: {user.demographic}</h4>
//         <h4>Birthday: {user.dob}</h4>
//         <h4>Login Email: {user.account_email}</h4>
//         <h4>School Email: {user.email}</h4>
//       </div>
//     ));
//   };

//   // Determine which section to display based on the logged-in user's role
//   const renderRoleSection = () => {
//     console.log(userRole);
//     if (userRole === 'participant') {
//       const filteredParticipants = filteredUsers('participant');
//       return (
//         <div>
//           <h2>Participants</h2>
//           {renderUsers('participant', filteredParticipants)}
//         </div>
//       );
//     } else if (userRole === 'board member') {
//       const filteredBoardMembers = filteredUsers('board member');
//       return (
//         <div>
//           <h2>Board Members</h2>
//           {renderUsers('board member', filteredBoardMembers)}
//         </div>
//       );
//     } else if (userRole === 'admin') {
//       const filteredAdmins = filteredUsers('admin');
//       return (
//         <div>
//           <h2>Admins</h2>
//           {renderUsers('admin', filteredAdmins)}
//         </div>
//       );
//     } else {
//       return <p>User role not recognized.</p>;
//     }
//   };

//   return (
//     <>
//       <Header />
//       <Menu />
//       <div>
//         <h1 id="partheader">Profile</h1>
//         <div className="partcontainer">
//           <div>{renderRoleSection()}</div>
//         </div>
//       </div>
//     </>
//   );
// }


// // // import React, { useState, useEffect, useContext } from 'react';
// // // import { UserRoleContext } from '../../context/UserRoleContext';
// // // import './User.css';
// // // import Header from '../../components/Header/Header';
// // // import Menu from '../../components/Menu/Menu';
// // // import axios from 'axios';
// // // import { useAuth0 } from '@auth0/auth0-react'; // Import useAuth0 to access user info

// // // export default function User() {
// // //   const [participants, setParticipants] = useState([]);
// // //   const [boardMembers, setBoardMembers] = useState([]);
// // //   const [admins, setAdmins] = useState([]);
// // //   const [error, setError] = useState(null);
  
// // //   const { user, isAuthenticated } = useAuth0(); // Use Auth0 to get logged-in user info
// // //   const userRole = useContext(UserRoleContext);

// // //   useEffect(() => {
// // //     const fetchUsersByRole = async (role, setState) => {
// // //       try {
// // //         const response = await axios.get('http://localhost:8081/participantdetails/displayusers', {
// // //           params: { position: role },
// // //         });
// // //         console.log(`Response for ${role}:`, response.data);
// // //         setState(Array.isArray(response.data) ? response.data : []); // Ensure data is an array
// // //       } catch (err) {
// // //         console.error(`Error fetching ${role}s:`, err);
// // //         setError(`Failed to load ${role}s.`);
// // //       }
// // //     };

// // //     // Fetch users for each role: participants, board members, and admins
// // //     fetchUsersByRole('participant', setParticipants);
// // //     fetchUsersByRole('board member', setBoardMembers);
// // //     fetchUsersByRole('admin', setAdmins);
// // //   }, []);

// // //   // Filter participants, board members, and admins based on the logged-in user's email
// // //   const filteredParticipants = isAuthenticated && user ? 
// // //     participants.filter(participant => participant.account_email === user.email) 
// // //     : [];

// // //   const filteredBoardMembers = isAuthenticated && user ? 
// // //     boardMembers.filter(boardMember => boardMember.account_email === user.email) 
// // //     : [];

// // //   const filteredAdmins = isAuthenticated && user ? 
// // //     admins.filter(admin => admin.account_email === user.email) 
// // //     : [];

// // //   // Render the users based on the filtered data
// // //   const renderUsers = (role, filteredUsers) => {
// // //     if (error) return <p>{error}</p>;
// // //     if (filteredUsers.length === 0) return <p>No matching {role}s found.</p>;

// // //     return filteredUsers.map((user) => (
// // //       <div key={user.user_id}>
// // //         <h4>First Name: {user.first_name}</h4>
// // //         <h4>Last Name: {user.last_name}</h4>
// // //         <h4>Graduation Year: {user.user_class}</h4>
// // //         <h4>Position: {user.position}</h4>
// // //         <h4>Cell Phone: {user.cell_phone}</h4>
// // //         <h4>Home Phone: {user.home_phone}</h4>
// // //         <h4>Gender: {user.gender}</h4>
// // //         <h4>Demographic: {user.demographic}</h4>
// // //         <h4>Birthday: {user.dob}</h4>
// // //         <h4>Login Email: {user.account_email}</h4>
// // //         <h4>School Email: {user.email}</h4>
// // //       </div>
// // //     ));
// // //   };

// // //   return (
// // //     <>
// // //       <Header />
// // //       <Menu />
// // //       <div>
// // //         <h1 id="partheader">Profile</h1>
// // //         <div className="partcontainer">
// // //           <div>
// // //             <h2>Participants</h2>
// // //             {renderUsers('participant', filteredParticipants)}
// // //           </div>
// // //           <div>
// // //             <h2>Board Members</h2>
// // //             {renderUsers('board member', filteredBoardMembers)}
// // //           </div>
// // //           <div>
// // //             <h2>Admins</h2>
// // //             {renderUsers('admin', filteredAdmins)}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // }


import React, { useState, useEffect, useContext } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext';
import './User.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react'; // Import useAuth0 to access user info

export default function User() {
  const [participants, setParticipants] = useState([]);
  const [boardMember, setBoardMembers] = useState([]);
  const [admin, setAdmin] = useState([]);
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
    fetchUsersByRole('board member', setBoardMembers);
    fetchUsersByRole('admin', setAdmin);
  }, []);

  // Filter participants based on the logged-in user's email
  const filteredParticipants = isAuthenticated && user ? 
    participants.filter(participant => participant.account_email === user.email) 
    : [];

  // Display the participants that were retrieved from the database
  const renderParticipants = () => {
    if (error) return <p>{error}</p>;

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

    // Filter participants based on the logged-in user's email
    const filteredBoardMembers = isAuthenticated && user ? 
    boardMember.filter(boardMember => boardMember.account_email === user.email) 
    : [];

  // Display the participants that were retrieved from the database
  const renderBoardMembers = () => {
    if (error) return <p>{error}</p>;

    return filteredBoardMembers.map((boardMember) => (
      <div
        key={boardMember.user_id}
      >
        <h4>First Name: {boardMember.first_name}</h4>
        <h4>Last Name: {boardMember.last_name}</h4>
        <h4>Graduation Year: {boardMember.user_class}</h4>
        <h4>Position: {boardMember.position}</h4>
        <h4>Cell Phone: {boardMember.cell_phone}</h4>
        <h4>Home Phone: {boardMember.home_phone}</h4>
        <h4>Gender: {boardMember.gender}</h4>
        <h4>Demographic: {boardMember.demographic}</h4>
        <h4>Birthday: {boardMember.dob}</h4>
        <h4>Login Email: {boardMember.account_email}</h4>
        <h4>School Email: {boardMember.email}</h4>
      </div>
    ));
  };

    // Filter participants based on the logged-in user's email
    const filteredAdmins = isAuthenticated && user ? 
    admin.filter(admin => admin.account_email === user.email) 
    : [];

  // Display the participants that were retrieved from the database
  const renderAdmin = () => {
    if (error) return <p>{error}</p>;

    return filteredAdmins.map((admin) => (
      <div
        key={admin.user_id}
      >
        <h4>First Name: {admin.first_name}</h4>
        <h4>Last Name: {admin.last_name}</h4>
        <h4>Graduation Year: {admin.user_class}</h4>
        <h4>Position: {admin.position}</h4>
        <h4>Cell Phone: {admin.cell_phone}</h4>
        <h4>Home Phone: {admin.home_phone}</h4>
        <h4>Gender: {admin.gender}</h4>
        <h4>Demographic: {admin.demographic}</h4>
        <h4>Birthday: {admin.dob}</h4>
        <h4>Login Email: {admin.account_email}</h4>
        <h4>School Email: {admin.email}</h4>
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
              <div>{renderBoardMembers()}</div>
              <div>{renderAdmin()}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}