import React, { useState } from 'react';
import './CreateAnnounceBtn.css';
import axios from '../../../services/axiosConfig';
import { useAuth0 } from '@auth0/auth0-react';

const CreateAnnounceBtn = ({ setAnnouncements }) => {
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', descrip: '' });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.descrip) {
      alert('Please provide a title and description.');
      return;
    }
    console.log("Adding New Announcement:", {
      title: newAnnouncement.title,
      description: newAnnouncement.descrip,
    });

    try {
      // Add new announcement to the backend
      const token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      });

      let response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/announcements/add`, {
        ann_name: newAnnouncement.title,
        ann_description: newAnnouncement.descrip,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      );

      // Add the new announcement to the current list of announcements (state)
      setAnnouncements(prevAnnouncements => [...prevAnnouncements, response.data]);

      // Close popup and reset input fields
      setIsPopupOpen(false);
      setNewAnnouncement({ title: '', descrip: '' });
    } catch (error) {
      console.error('Error adding announcement:', error);
      alert('Failed to add announcement.');
    }
  };

  

  return (
    <div className="create-announcement-container">
      <button className="center-button" onClick={() => setIsPopupOpen(true)}>
        Create Announcement
      </button>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Create New Announcement</h2>
            <label>
              Title:
              <input
                type="text"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={newAnnouncement.descrip}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, descrip: e.target.value })}
              />
            </label>
            <div className="popup-buttons">
              <button onClick={handleAddAnnouncement}>Create</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAnnounceBtn;
