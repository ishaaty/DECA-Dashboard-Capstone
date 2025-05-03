import React, { useState } from 'react';
import './EditAnnounceBtn.css';
import axios from '../../../services/axiosConfig';
import { useAuth0 } from '@auth0/auth0-react';

const EditAnnouncementBtn = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: props.title || '',
    description: props.description || '',
  });

  const { getAccessTokenSilently } = useAuth0();

  // Function to fetch updated announcements
  const fetchAnnouncements = async () => {
    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });

      let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/announcements/display`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      props.setAnnouncements(response.data); // Update the parent state with the fetched data
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  // Function to handle the PUT request and update the announcement
  const handleAnnouncement = async () => {
    console.log('Current state of newAnnouncement:', newAnnouncement); // Log state before making request

    if (!newAnnouncement.title || !newAnnouncement.description) {
      alert('Please provide both title and description.');
      return;
    }

    const announcementData = {
      ann_name: newAnnouncement.title,
      ann_description: newAnnouncement.description,
    };

    try {
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });

      let response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/announcements/edit/${props.ann_id}`,
        announcementData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      fetchAnnouncements();

      // Close the popup and reset form fields with the updated data
      setIsPopupOpen(false);
      setNewAnnouncement({
        title: response.data.ann_name,
        description: response.data.ann_description, // Ensure description is correctly updated
      });
    } catch (error) {
      console.error('Error updating announcement:', error);
      alert('Failed to update announcement. Please try again.');
    }
  };

  // Open the popup with the current state when clicking the "Edit" button
  const handleOpenPopup = () => {
    setNewAnnouncement({
      title: props.title,
      description: props.description,
    });
    setIsPopupOpen(true);
  };

  return (
    <div className="create-announcement-container">
      <div>
        <button className="edit-announcement-dets-btn" onClick={handleOpenPopup}>
          Edit Announcement Details
        </button>
      </div>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Edit</h2>
            <label>
              Title:
              <input
                type="text"
                value={newAnnouncement.title}
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                }
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={newAnnouncement.description}
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, description: e.target.value })
                }
              />
            </label>
            <div className="popup-buttons">
              <button onClick={handleAnnouncement}>Save Announcement</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAnnouncementBtn;
