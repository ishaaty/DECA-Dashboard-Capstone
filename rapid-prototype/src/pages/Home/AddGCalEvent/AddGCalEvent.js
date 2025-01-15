import React, { useState } from 'react';
import './AddGCalEvent.css';

const AddGCalEvent= () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newResource, setNewResource] = useState({ text: '', link: '', pdf: '' });

  const handleAddResource = () => {
    if (!newResource.text || (!newResource.link && !newResource.pdf)) {
      alert('Please provide a name and either a link or a PDF file.');
      return;
    }
    console.log('New Resource:', newResource); // Log the new resource
    setIsPopupOpen(false);
    setNewResource({ text: '', link: '', pdf: '' });
  };

  return (
    <>
      <div className="center-button-container">
        <button className="center-button" onClick={() => setIsPopupOpen(true)}>
          Add New Event
        </button>
      </div>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add New Event</h2>
            <label>
              Name:
              <input
                type="text"
                value={newResource.text}
                onChange={(e) => setNewResource({ ...newResource, text: e.target.value })}
              />
            </label>
            <label>
              Link:
              <input
                type="url"
                value={newResource.link}
                onChange={(e) =>
                  setNewResource({ ...newResource, link: e.target.value, pdf: '' })
                }
              />
            </label>
            <div className="popup-buttons">
              <button onClick={handleAddResource}>Add Resource</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddGCalEvent;
