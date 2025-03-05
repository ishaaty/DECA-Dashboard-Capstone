import './Home.css';
import React from 'react';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import AddGCalEvent from './AddGCalEvent/AddGCalEvent';
import AddAnnounce from './AddAnnounce/AddAnnounce';
import { useAuth0 } from '@auth0/auth0-react';

import { useContext } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext';

function renderAdminContent(userRole) {
  if (userRole === 'admin' || userRole === 'board member') {
    return (
      <div>
        <AddGCalEvent />
        <AddAnnounce />
      </div>
    );
  }
}

export default function Home() {
  const { user, isAuthenticated } = useAuth0();
  const userRole = useContext(UserRoleContext);

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
          <iframe
            src="https://calendar.google.com/calendar/embed?src=10a7c2a9d9f433e04cbbb485579fa2c8d25039b6946d2399148e6afb1c52b051%40group.calendar.google.com&ctz=America%2FNew_York"
            style={{ border: 0 }}
            width="500vh"
            height="400vh"
            frameBorder="0"
            scrolling="no"
            title="Calendar"
          ></iframe>

          {/* Render admin content if the role is admin */}
          {renderAdminContent(userRole)}
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
