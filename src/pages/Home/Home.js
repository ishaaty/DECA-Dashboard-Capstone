import './Home.css';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import AddGCalEvent from './AddGCalEvent/AddGCalEvent';
import AddAnnounce from './AddAnnounce/AddAnnounce';
import fetchWithAuth from '../../services/axiosConfig';
import { useAuth0 } from '@auth0/auth0-react';

function renderAdminContent() {
  return (
    <div>
      <AddGCalEvent />
      <AddAnnounce />
    </div>
  );
}

export default function Home({ userRole }) {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetchWithAuth(`/user/data?email=${user.email}`, token);
        setData(response);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [getAccessTokenSilently, user.email, isAuthenticated]);  // Re-fetch data when user or token changes

  return (
    <>
      <Header />
      <Menu />
      <div className="home-container">
        <div className="calendar-container">
            {isAuthenticated && user && (
            <h2>Welcome, {user.given_name} {user.family_name}!</h2>
          )}
          <h3>Calendar</h3>
          {/* Display the welcome message */}
          <iframe
            src="https://calendar.google.com/calendar/embed?src=10a7c2a9d9f433e04cbbb485579fa2c8d25039b6946d2399148e6afb1c52b051%40group.calendar.google.com&ctz=America%2FNew_York" 
            style={{ border: 0 }}
            width="500vh"
            height="400vh"
            frameBorder="0"
            scrolling="no"
            title=""
          ></iframe>

          {/* Render admin content if the user is an admin */}
          {userRole === "admin" && renderAdminContent()}

          {/* Display fetched data if available */}
          {data && <div>{JSON.stringify(data)}</div>}
        </div>
        <div className="sidebar-container">
          <div className="announcements-box">
            <h3>Announcements</h3>
            <ul>
              <li>Bake Sale - October 9</li>
              <li>Signup to volunteer!</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
