import './Contact.css';
import Header from '../../components/Header/Header'
import React, { useEffect, useState } from 'react';
import fetchWithAuth from '../../services/axiosConfig';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';


export default function Contact({ userRole }) {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;  // Early exit if `user` is not yet defined

      try {
        const token = await getAccessTokenSilently();
        const response = await fetchWithAuth(`/user/data?email=${user.email}`, token);
        setData(response);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    if (isAuthenticated && user) {
      fetchData();
    }
  }, [getAccessTokenSilently, user, isAuthenticated]);  // Re-fetch data when user or token changes

  return (
    <>
      <Header />
      <h1>Profile</h1>
      {user && <p>Name: {user.given_name} {user.family_name}</p>}
      {user && <p>Email: {user.email}</p>}
      {user && <p>Class Year: {}</p>}
      <div className="home-container">
        <div className="calendar-container">
          {/* Display fetched data if available */}
          {/* {data && <div>{JSON.stringify(data)}</div>} */}
        </div>
      </div>
    </>
  );
}


    // useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const token = await getAccessTokenSilently();
    //     const response = await fetchWithAuth(`/user/data?email=${user.email}`, token);
    //     setData(response);
    //   } catch (err) {
    //     console.error('Error fetching data:', err);
    //   }
    // };

    // return (
    //     <>
    //         <Header />
    //         <h2>Profile</h2>
    //     </>
    // )
// import React, { useEffect, useState } from 'react';
// import Header from '../../components/Header/Header';
// import Menu from '../../components/Menu/Menu';
// import fetchWithAuth from '../../services/axiosConfig';
// import { useAuth0 } from '@auth0/auth0-react';

// export default function Contact({ userRole }) {
//   const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = await getAccessTokenSilently();
//         const response = await fetchWithAuth(`/user/data?email=${user.email}`, token);
//         setData(response);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//       }
//     };

//     if (isAuthenticated) {
//       fetchData();
//     }
//   }, [getAccessTokenSilently, user.email, isAuthenticated]);  // Re-fetch data when user or token changes

//   return (
//     <>
//       <Header />
//       <Menu />
//       <div className="home-container">
//         <div className="calendar-container">
//             {isAuthenticated && user && (
//             <h2>Welcome, {user.given_name} {user.family_name}!</h2>
//           )}

//           {/* Display fetched data if available */}
//           {data && <div>{JSON.stringify(data)}</div>}
//         </div>
//       </div>
//     </>
//   );
// }
