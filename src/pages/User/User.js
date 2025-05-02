import React, { useState, useEffect, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { UserRoleContext } from '../../context/UserRoleContext';
import { Link } from 'react-router-dom';
import './User.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import axios from 'axios';

export default function User() {
  const [participants, setParticipants] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [errors, setErrors] = useState({ participants: null, boardMembers: null, admins: null });

  const { user } = useAuth0();
  const userEmail = user?.email;
  const userRole = useContext(UserRoleContext);
  const { getAccessTokenSilently } = useAuth0();

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);


  useEffect(() => {
    const fetchUsersByRole = async (role, setState, errorKey) => {
      try {
        const token = await getAccessTokenSilently({
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        });
        let response;
        try {
          response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/participantdetails/displayusers`, {
            params: { position: role },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.warn('Error fetching from production backend, falling back to localhost...');
          response = await axios.get('${process.env.REACT_APP_API_BASE_URL}/participantdetails/displayusers', {
            params: { position: role },
          });
        }

        console.log(`Fetched ${role}s:`, response.data);
        setState(Array.isArray(response.data) ? response.data : []);
        setErrors((prev) => ({ ...prev, [errorKey]: null }));
      } catch (err) {
        console.error(`Error fetching ${role}s:`, err);
        setErrors((prev) => ({ ...prev, [errorKey]: `Failed to load ${role}s.` }));
      }
    };

    fetchUsersByRole('participant', setParticipants, 'participants');
    fetchUsersByRole('board member', setBoardMembers, 'boardMembers');
    fetchUsersByRole('admin', setAdmins, 'admins');
  }, []);

  const getCurrentUser = (users) => {
    return users.find(
      u => u.account_email?.trim().toLowerCase() === userEmail?.trim().toLowerCase()
    );
  };

  // const renderUserCard = (user) => {
  //   return (
  //     <Link
  //       key={user.user_id}
  //       className="partanchor"
  //       to={`/userdetails?userFirst=${user.first_name}&userLast=${user.last_name}`}
  //     >
  //       <h2>Participants</h2>
  //       <h4 className="partname">
  //         {user.first_name}
  //       </h4>
  //       <h4 className="partname">
  //         {user.last_name}
  //       </h4>
  //       <h4 className="partname">
  //         {user.user_class}
  //       </h4>
  //       <h4 className="partname">
  //         {user.position}
  //       </h4>
  //       <h4 className="partname">
  //         {user.cell_phone}
  //       </h4>
  //       <h4 className="partname">
  //         {user.home_phone}
  //       </h4>
  //       <h4 className="partname">
  //         {user.gender}
  //       </h4>
  //       <h4 className="partname">
  //         {user.demographic}
  //       </h4>
  //       <h4 className="partname">
  //         {user.dob}
  //       </h4>
  //       <h4 className="partname">
  //         {user.account_email}
  //       </h4>
  //       <h4 className="partname">
  //         {user.email}
  //       </h4>
  //     </Link>
  //   );
  // };
  // const handleSave = async (updatedUser) => {
  //   try {
  //     const token = await getAccessTokenSilently({
  //       audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  //     });
  
  //     await axios.put(`${process.env.REACT_APP_API_BASE_URL}/profile/update`, updatedUser, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  
  //     setIsEditing(false);
  //     setEditedUser(null);
  
  //     // Refresh data
  //     window.location.reload(); // or re-fetch participants, boardMembers, admins
  //   } catch (error) {
  //     console.error('Error saving user data:', error);
  //   }
  // };
  const handleSave = async (updatedUser, originalUser) => {
    try {
      // const token = await getAccessTokenSilently({
      //   audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      // });
  
      //await axios.put(`${process.env.REACT_APP_API_BASE_URL}/profile/update`, updatedUser, {
        await axios.put(`http://localhost:8081/profile/update`, updatedUser, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });

  
      // Update user in the appropriate list
      const updateUserList = (users, setUsers) => {
        const updatedList = users.map(u => u.user_id === updatedUser.user_id ? updatedUser : u);
        setUsers(updatedList);
      };
  
      if (originalUser.position === 'admin') updateUserList(admins, setAdmins);
      else if (originalUser.position === 'board member') updateUserList(boardMembers, setBoardMembers);
      else updateUserList(participants, setParticipants);
  
      setIsEditing(false);
      setEditedUser(null);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };
  

  const renderUserCard = (user) => {
    const isCurrentEditing = isEditing && editedUser?.user_id === user.user_id;
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleCancel = () => {
      setIsEditing(false);
      setEditedUser(null);
    };
  
    return (
      <div key={user.user_id} className="user-card">
        <h2>User Profile</h2>
        {['first_name', 'last_name', 'user_class', 'position', 'cell_phone', 'home_phone', 'gender', 'demographic', 'dob', 'account_email', 'email'].map((field) => (
          <h4 key={field} className="partname">
            {isCurrentEditing ? (
              <input
                type="text"
                name={field}
                value={editedUser[field] || ''}
                onChange={handleChange}
              />
            ) : (
              user[field]
            )}
          </h4>
        ))}
  
        {!isCurrentEditing ? (
          <button onClick={() => { setIsEditing(true); setEditedUser({ ...user }); }}>Edit</button>
        ) : (
          <>
            <button onClick={() => handleSave(editedUser, user)}>Save</button>
            <button onClick={handleCancel} style={{ backgroundColor: '#6c757d', marginLeft: '0.5rem' }}>Cancel</button>
          </>
        )}
      </div>
    );
  };
  

  const currentAdmin = getCurrentUser(admins);
  const currentBoardMember = getCurrentUser(boardMembers);
  const currentParticipant = getCurrentUser(participants);

  return (
    <>
      <Header />
      <Menu />
      <div>
        <div className="partcontainer">
          {currentAdmin && (
            <div>
              {/* <h3 id="advisors">Advisors</h3> */}
              {renderUserCard(currentAdmin)}
            </div>
          )}

          {currentBoardMember && (
            <div>
              {/* <h3 id="board">Board Members</h3> */}
              {renderUserCard(currentBoardMember)}
            </div>
          )}

          {currentParticipant && (
            <div>
              {/* <h3 id="member">Members</h3> */}
              <div className="partlist">
                {renderUserCard(currentParticipant)}
              </div>
            </div>
          )}

          {!currentAdmin && !currentBoardMember && !currentParticipant && (
            <p style={{ color: 'red' }}>No user data found for your account.</p>
          )}
        </div>
      </div>
    </>
  );
}


// import React, { useState, useEffect, useContext } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// import { UserRoleContext } from '../../context/UserRoleContext';
// import './User.css';
// import Header from '../../components/Header/Header';
// import Menu from '../../components/Menu/Menu';
// import axios from 'axios';

// export default function User() {
//   const [participants, setParticipants] = useState([]);
//   const [boardMembers, setBoardMembers] = useState([]);
//   const [admins, setAdmins] = useState([]);
//   const [errors, setErrors] = useState({ participants: null, boardMembers: null, admins: null });
//   const [editableUser, setEditableUser] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const { user } = useAuth0();
//   const userEmail = user?.email;
//   const userRole = useContext(UserRoleContext);

//   useEffect(() => {
//     const fetchUsersByRole = async (role, setState, errorKey) => {
//       try {
//         let response;
//         try {
//           response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/participantdetails/displayusers`, {
//             params: { position: role },
//           });
//         } catch (error) {
//           console.warn('Error fetching from production backend, falling back to localhost...');
//           response = await axios.get('http://localhost:8081/participantdetails/displayusers', {
//             params: { position: role },
//           });
//         }

//         setState(Array.isArray(response.data) ? response.data : []);
//         setErrors((prev) => ({ ...prev, [errorKey]: null }));
//       } catch (err) {
//         setErrors((prev) => ({ ...prev, [errorKey]: `Failed to load ${role}s.` }));
//       }
//     };

//     fetchUsersByRole('participant', setParticipants, 'participants');
//     fetchUsersByRole('board member', setBoardMembers, 'boardMembers');
//     fetchUsersByRole('admin', setAdmins, 'admins');
//   }, []);

//   const getCurrentUser = (users) => {
//     return users.find(
//       u => u.account_email?.trim().toLowerCase() === userEmail?.trim().toLowerCase()
//     );
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditableUser((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSave = async () => {
//     setIsSaving(true);
//     try {
//       await axios.put(`${process.env.REACT_APP_API_BASE_URL}/participantdetails/updateuser`, editableUser);
//       alert('User information saved.');
//     } catch (err) {
//       console.error('Failed to save user:', err);
//       alert('Error saving user data.');
//     }
//     setIsSaving(false);
//   };

//   const renderEditableForm = (user) => {
//     if (!editableUser) setEditableUser(user);

//     return (
//       <div className="user-form">
//         {[
//           'first_name',
//           'last_name',
//           'user_class',
//           'position',
//           'cell_phone',
//           'home_phone',
//           'gender',
//           'demographic',
//           'dob',
//           'account_email',
//           'email',
//         ].map((field) => (
//           <div key={field}>
//             <label>{field.replace('_', ' ')}:</label>
//             <input
//               type="text"
//               name={field}
//               value={editableUser?.[field] || ''}
//               onChange={handleChange}
//             />
//           </div>
//         ))}

//         <button onClick={handleSave} disabled={isSaving}>
//           {isSaving ? 'Saving...' : 'Save Changes'}
//         </button>
//       </div>
//     );
//   };

//   const currentUser =
//     getCurrentUser(admins) || getCurrentUser(boardMembers) || getCurrentUser(participants);

//   return (
//     <>
//       <Header />
//       <Menu />
//       <div>
//         <div className="partcontainer">
//           {currentUser ? (
//             renderEditableForm(currentUser)
//           ) : (
//             <p style={{ color: 'red' }}>No user data found for your account.</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
