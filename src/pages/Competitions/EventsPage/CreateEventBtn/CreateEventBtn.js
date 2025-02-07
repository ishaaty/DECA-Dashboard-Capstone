import React, { useState } from 'react';
import './CreateEventBtn.css';

const CreateEventBtn = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', descrip: '', location: '', date: '', time: '', requirements: [] });

  const handleEvent = () => {
    if (!newEvent.title) {
      alert('Please provide a title.');
      return;
    }
    console.log('New Event:', newEvent);
    setIsPopupOpen(false);
    setNewEvent({ title: '', descrip: '', location: '', date: '', time: '', requirements: [] });
  };

  return (
    <div className="create-event-container">
      <div>
        <button className="center-button" onClick={() => setIsPopupOpen(true)}>
          Create Event
        </button>
      </div>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Create New Event</h2>
            <label>
              Title:
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={newEvent.descrip}
                onChange={(e) => setNewEvent({ ...newEvent, descrip: e.target.value })}
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </label>
            <label>
              Time:
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
            </label>
            <label>
              Requirements:
              {/* FIGURE THIS ONE OUT */}
              <input
                type="text"
                value={newEvent.requirements}
                onChange={(e) => setNewEvent({ ...newEvent, requirements: e.target.value })}
              />
            </label>

            <div className="popup-buttons">
              <button onClick={handleEvent}>Create Event</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEventBtn;
