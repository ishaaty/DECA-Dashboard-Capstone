import React, { useState } from 'react';
import './EditAnnounceBtn.css';
import axios from '../../../services/axiosConfig';

const EditAnnouncementBtn = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: props.title || '',
    description: props.description || '',
  });

  // Function to fetch updated announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:8081/announcements/display');
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
      ann_description: newAnnouncement.description, // Ensure 'ann_description' is used
    };

    try {
      console.log('Attempting to edit announcement with ID:', props.ann_id);
      const response = await axios.put(
        `http://localhost:8081/announcements/edit/${props.ann_id}`,
        announcementData
      );

      console.log('Updated Announcement:', response.data); // Log the response to ensure both fields are updated

      // Fetch updated announcements from the server
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
