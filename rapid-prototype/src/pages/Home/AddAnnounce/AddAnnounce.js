import React, { useState } from 'react';
import './AddAnnounce.css';

const AddAnnounce= () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', descrip: ''});

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title) {
      alert('Please provide a title.');
      return;
    }
    console.log('New Announcment:', newAnnouncement); // Log the new resource
    setIsPopupOpen(false);
    setNewAnnouncement({ title: '', descrip: ''});
  };

  return (
    <>
      <div className="center-button-container">
        <button className="center-button" onClick={() => setIsPopupOpen(true)}>
          Add Announcement
        </button>
      </div>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add New Announcement</h2>
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
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, descrip: e.target.value })
                }
              />
            </label>
            <div className="popup-buttons">
              <button onClick={handleAddAnnouncement}>Add Announcement</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddAnnounce;
