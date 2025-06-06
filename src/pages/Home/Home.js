import './Home.css';
import React, { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import AddGCalEvent from './AddGCalEvent/AddGCalEvent';
import CreateAnnounceBtn from './CreateAnnounceBtn/CreateAnnounceBtn';
import AnnounceCard from './AnnounceCard/AnnounceCard';
import { useAuth0 } from '@auth0/auth0-react';
import { UserRoleContext } from '../../context/UserRoleContext';
import axios from 'axios';

export default function Home() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const userRole = useContext(UserRoleContext);
  const [announcements, setAnnouncements] = useState([]);
  //const [htmlContent, setHtmlContent] = useState(null);

  useEffect(() => {
    // To fetch role based content
    // const fetchHtmlContent = async () => { 
    //   try {
    //     const token = await getAccessTokenSilently({
    //       audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    //     });

    //     const response = await axios.post('http://localhost:8081/pages/home', {
    //       role: userRole,
    //     }, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //     setHtmlContent(response.data);
    //   } catch (error) {
    //     console.error('Error fetching HTML content:', error);
    //   }
    // };

      const fetchAnnouncements = async () => {
        const token = await getAccessTokenSilently({
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        });

        let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/announcements/display`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setAnnouncements(response.data);
      }

      fetchAnnouncements();
  
    // if (user && isAuthenticated) {
    //   fetchHtmlContent();
    // }
  }, [getAccessTokenSilently, user, isAuthenticated]);

  // Handle deleting an announcement
  const handleDeleteAnnouncement = async (ann_id) => {
    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });
      
      // Send request to backend to delete the announcement
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/announcements/delete/${ann_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },

          }
        );

      // Remove the deleted announcement from the state
      setAnnouncements(prevAnnouncements =>
        prevAnnouncements.filter(announcement => announcement.ann_id !== ann_id)
      );
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement.');
    }
  }




    
    return (
      <>
        <Header />
        <Menu />
        <div className="home-container">
          <div className="calendar-container">
            {isAuthenticated && user && <h2>Welcome, {user.given_name} {user.family_name}!</h2>}
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

            {/* {(userRole === 'admin' || userRole === 'board member') && (
              <div>
                { <AddGCalEvent /> }
              </div>
            )} */}
          </div>

          <div className="sidebar-container">
            <div className="announcements-box">
              <h3>Announcements</h3>

              {userRole === "admin" && (
                <CreateAnnounceBtn setAnnouncements={setAnnouncements} />
              )}
              {userRole ==="board member" && (
              <CreateAnnounceBtn setAnnouncements={setAnnouncements} />
              )}

              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <AnnounceCard
                    key={announcement.ann_id}
                    ann_id={announcement.ann_id}
                    title={announcement.ann_name}
                    description={announcement.ann_description}
                    acquired={announcement.acquired}
                    setAnnouncements={setAnnouncements}
                    onDelete={() => handleDeleteAnnouncement(announcement.ann_id)} // Call handleDeleteAnnouncement
                  />

                ))
              ) : (
                <p>No announcements yet.</p>

              )}
              {/* {userRole === "admin" && (
                <CreateAnnounceBtn setAnnouncements={setAnnouncements} />
              )}
              {userRole ==="board member" && (
              <CreateAnnounceBtn setAnnouncements={setAnnouncements} />
              )} */}
            </div>
          </div>
        </div>
      </>
    );
  }
