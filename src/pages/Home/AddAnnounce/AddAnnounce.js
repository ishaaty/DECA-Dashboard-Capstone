import React, { useState, useEffect } from 'react';
import './AddAnnounce.css';
import axios from '../../../services/axiosConfig';


// Single Announcement Component
const Announcement = ({ ann_name, ann_description, userRole, onDelete }) => {
  console.log("User Role:", userRole);
  return (
    <div className="announcement-box">
      <p className="announcement-title">{ann_name}</p> 
      <p className="announcement-text">{ann_description}</p>
      {userRole === 'admin' && (
        <button className="announcement-button" onClick={onDelete}>
          Delete
        </button>
      )}
    </div>
  );
};

// Announcements List Component
const Announcements = ({ announcements = [], userRole }) => {
  const [announcementList, setAnnouncementList] = useState(announcements);

  // Sync state when announcements prop updates
  useEffect(() => {
    setAnnouncementList(announcements || []);
  }, [announcements]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ ann_name: '', ann_description: '' });

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.ann_name || !newAnnouncement.ann_description) {
      alert('Please provide a title and description');
      return;
    }
  
    try {
      const announcementData = {
        ann_name: newAnnouncement.ann_name,
        ann_description: newAnnouncement.ann_description,
      };
  
      const response = await axios.post('http://localhost:8081/announcements/add', announcementData);
  
      const newAnn = response.data;
      if (newAnn?.ann_id) {
        setAnnouncementList((prevList) => [...prevList, newAnn]);
      } else {
        console.error("Unexpected response format:", response.data);
      }
      setIsPopupOpen(false);
      setNewAnnouncement({ ann_name: '', ann_description: '' });
    } catch (error) {
      console.error('Error adding announcement:', error);
      alert('Failed to add announcement.');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/announcements/delete/${id}`);
      setAnnouncementList((prevList) => prevList.filter((announcement) => announcement.ann_id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement.');
    }
  };
  
  return (
    <>
      <div className="announcements-container">
        {announcementList.length > 0 ? (
          announcementList.map((announcement) => (
            <Announcement
              key={announcement.ann_id}
              ann_name={announcement.ann_name}
              ann_description={announcement.ann_description}
              userRole={userRole}
              onDelete={() => handleDeleteAnnouncement(announcement.ann_id)}
            />
          ))
        ) : (
          userRole === 'admin' && (
            <div className="no-announcements">
              <button className="center-button" onClick={() => setIsPopupOpen(true)}>
                Add New Announcement
              </button>
            </div>
          )
        )}
      </div>

      {userRole === 'admin' && (
        <div className="center-button-container">
          <button className="center-button" onClick={() => setIsPopupOpen(true)}>
            Add New Announcement
          </button>
        </div>
      )}

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add New Announcement</h2>
            <label>
              Name:
              <input
                type="text"
                value={newAnnouncement.ann_name}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, ann_name: e.target.value })}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={newAnnouncement.ann_description}
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, ann_description: e.target.value })
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

export default Announcements;
