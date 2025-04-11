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
  const [userData, setUserData] = useState(null); // Store the user data to edit
  const [isEditing, setIsEditing] = useState(false); // Control whether the user is editing or not
  
  const { user, isAuthenticated } = useAuth0(); // Use Auth0 to get logged-in user info

  useEffect(() => {
    const fetchUsersByRole = async (role, setState) => {
      try {
        let response;
        try {
          // Try using the production backend URL first
          response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/participantdetails/displayusers`, {
            params: { position: role },
          });
        } catch (error) {
          console.warn('Error fetching from production backend, falling back to localhost...');
          // If the production backend fails, fallback to localhost:8081
          response = await axios.get('http://localhost:8081/participantdetails/displayusers', {
            params: { position: role },
          });
        }
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

  // Open the edit form and pre-fill the data
  const handleEditClick = () => {
    setIsEditing(true);
    setUserData({ ...filteredParticipants[0] }); // pre-fill data for the current user
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };


const handleSaveClick = async () => {
  try {
    const response = await axios.post('http://localhost:8081/edit', userData);
    console.log('Success:', response.data.message);
    setIsEditing(false); // Close the edit form
    setParticipants((prevParticipants) => 
      prevParticipants.map((participant) => 
        participant.user_id === userData.user_id ? userData : participant
      )
    );
  } catch (err) {
    // Log error details for debugging
    console.error('Axios Error:', err);
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error:', err.response.data);
      console.error('Response Status:', err.response.status);
      console.error('Response Headers:', err.response.headers);
    } else if (err.request) {
      // The request was made but no response was received
      console.error('Request Error:', err.request);
    } else {
      // Something else happened in setting up the request
      console.error('Error:', err.message);
    }
    setError('Failed to update profile.');
  }
};



  // Cancel editing
  const handleCancelClick = () => {
    setIsEditing(false); // Close the edit form
  };

  const renderParticipants = () => {
    if (error) return <p>{error}</p>;

    return filteredParticipants.map((participant) => (
      <div key={participant.user_id}>
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
        {!isEditing && <button onClick={handleEditClick}>Edit</button>}
      </div>
    ));
  };

  // Editable form for user to update their profile
  const renderEditableForm = () => {
    return (
      <div className="editable-form">
        <label>First Name:</label>
        <input
          type="text"
          name="first_name"
          value={userData.first_name}
          onChange={handleInputChange}
        />
        <label>Last Name:</label>
        <input
          type="text"
          name="last_name"
          value={userData.last_name}
          onChange={handleInputChange}
        />
        <label>Graduation Year:</label>
        <input
          type="text"
          name="user_class"
          value={userData.user_class}
          onChange={handleInputChange}
        />
        <label>Position:</label>
        <input
          type="text"
          name="position"
          value={userData.position}
          onChange={handleInputChange}
        />
        <label>Cell Phone:</label>
        <input
          type="text"
          name="cell_phone"
          value={userData.cell_phone}
          onChange={handleInputChange}
        />
        <label>Home Phone:</label>
        <input
          type="text"
          name="home_phone"
          value={userData.home_phone}
          onChange={handleInputChange}
        />
        <label>Gender:</label>
        <input
          type="text"
          name="gender"
          value={userData.gender}
          onChange={handleInputChange}
        />
        <label>Demographic:</label>
        <input
          type="text"
          name="demographic"
          value={userData.demographic}
          onChange={handleInputChange}
        />
        <label>Birthday:</label>
        <input
          type="text"
          name="dob"
          value={userData.dob}
          onChange={handleInputChange}
        />
        <label>Login Email:</label>
        <input
          type="email"
          name="account_email"
          value={userData.account_email}
          onChange={handleInputChange}
        />
        <label>School Email:</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
        />
        <button onClick={handleSaveClick}>Save</button>
        <button onClick={handleCancelClick}>Cancel</button>
      </div>
    );
  };

  return (
    <>
      <Header />
      <Menu />
      <div>
        <h1 id="partheader">Profile</h1>
        <div className="partcontainer">
          <div>
            {isEditing ? renderEditableForm() : renderParticipants()}
          </div>
        </div>
      </div>
    </>
  );
}

// import React, { useState, useEffect, useContext } from 'react';
// import { UserRoleContext } from '../../context/UserRoleContext';
// import './User.css';
// import Header from '../../components/Header/Header';
// import Menu from '../../components/Menu/Menu';
// import axios from 'axios';
// import { useAuth0 } from '@auth0/auth0-react'; // Import useAuth0 to access user info

// export default function User() {
//   const [participants, setParticipants] = useState([]);
//   const [boardMember, setBoardMembers] = useState([]);
//   const [admin, setAdmin] = useState([]);
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

//     // Fetch all users (participants, board members, admins)
//     fetchUsersByRole('participant', setParticipants);
//     fetchUsersByRole('board member', setBoardMembers);
//     fetchUsersByRole('admin', setAdmin);
//   }, []);

//   // Filter participants based on the logged-in user's email
//   const filteredParticipants = isAuthenticated && user ? 
//     participants.filter(participant => participant.account_email === user.email) 
//     : [];

//   // Display the participants that were retrieved from the database
//   const renderParticipants = () => {
//     if (error) return <p>{error}</p>;

//     return filteredParticipants.map((participant) => (
//       <div
//         key={participant.user_id}
//       >
//         <h4>First Name: {participant.first_name}</h4>
//         <h4>Last Name: {participant.last_name}</h4>
//         <h4>Graduation Year: {participant.user_class}</h4>
//         <h4>Position: {participant.position}</h4>
//         <h4>Cell Phone: {participant.cell_phone}</h4>
//         <h4>Home Phone: {participant.home_phone}</h4>
//         <h4>Gender: {participant.gender}</h4>
//         <h4>Demographic: {participant.demographic}</h4>
//         <h4>Birthday: {participant.dob}</h4>
//         <h4>Login Email: {participant.account_email}</h4>
//         <h4>School Email: {participant.email}</h4>
//       </div>
//     ));
//   };

//     // Filter participants based on the logged-in user's email
//     const filteredBoardMembers = isAuthenticated && user ? 
//     boardMember.filter(boardMember => boardMember.account_email === user.email) 
//     : [];

//   // Display the participants that were retrieved from the database
//   const renderBoardMembers = () => {
//     if (error) return <p>{error}</p>;

//     return filteredBoardMembers.map((boardMember) => (
//       <div
//         key={boardMember.user_id}
//       >
//         <h4>First Name: {boardMember.first_name}</h4>
//         <h4>Last Name: {boardMember.last_name}</h4>
//         <h4>Graduation Year: {boardMember.user_class}</h4>
//         <h4>Position: {boardMember.position}</h4>
//         <h4>Cell Phone: {boardMember.cell_phone}</h4>
//         <h4>Home Phone: {boardMember.home_phone}</h4>
//         <h4>Gender: {boardMember.gender}</h4>
//         <h4>Demographic: {boardMember.demographic}</h4>
//         <h4>Birthday: {boardMember.dob}</h4>
//         <h4>Login Email: {boardMember.account_email}</h4>
//         <h4>School Email: {boardMember.email}</h4>
//       </div>
//     ));
//   };

//     // Filter participants based on the logged-in user's email
//     const filteredAdmins = isAuthenticated && user ? 
//     admin.filter(admin => admin.account_email === user.email) 
//     : [];

//   // Display the participants that were retrieved from the database
//   const renderAdmin = () => {
//     if (error) return <p>{error}</p>;

//     return filteredAdmins.map((admin) => (
//       <div
//         key={admin.user_id}
//       >
//         <h4>First Name: {admin.first_name}</h4>
//         <h4>Last Name: {admin.last_name}</h4>
//         <h4>Graduation Year: {admin.user_class}</h4>
//         <h4>Position: {admin.position}</h4>
//         <h4>Cell Phone: {admin.cell_phone}</h4>
//         <h4>Home Phone: {admin.home_phone}</h4>
//         <h4>Gender: {admin.gender}</h4>
//         <h4>Demographic: {admin.demographic}</h4>
//         <h4>Birthday: {admin.dob}</h4>
//         <h4>Login Email: {admin.account_email}</h4>
//         <h4>School Email: {admin.email}</h4>
//       </div>
//     ));
//   };

//   return (
//     <>
//       <Header />
//       <Menu />
//       <div>
//         <h1 id="partheader">Profile</h1>
//         <div className="partcontainer">
//           <div>
//             <div>
//               <div>{renderParticipants()}</div>
//               <div>{renderBoardMembers()}</div>
//               <div>{renderAdmin()}</div>
//               <button>Edit</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }