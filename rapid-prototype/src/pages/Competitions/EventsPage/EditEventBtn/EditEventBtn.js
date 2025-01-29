import React, { useState } from 'react';
import './EditEventBtn.css';

const EditEventBtn = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', descrip: '', date: '', time: '', requirements: [] });

  const handleEvent = () => {
    if (!newEvent.title) {
      alert('Please provide a title.');
      return;
    }
    console.log('New Event:', newEvent);
    setIsPopupOpen(false);
    setNewEvent({ title: '', descrip: '', date: '', time: '', requirements: [] });
  };

  return (
    <div className="create-event-container">
      <div>
        <button className="edit-event-dets-btn" onClick={() => setIsPopupOpen(true)}>
          Edit Event Details
        </button>
      </div>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Edit {props.title}</h2>
            <label>
              Title:
              <input
                type="text"
                value={props.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={props.descrip}
                onChange={(e) => setNewEvent({ ...newEvent, descrip: e.target.value })}
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                value={props.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </label>
            <label>
              Time:
              <input
                type="time"
                value={props.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
            </label>
            <label>
              Requirements:
              {/* FIGURE THIS ONE OUT */}
              <input
                type="text"
                value={props.requirements}
                onChange={(e) => setNewEvent({ ...newEvent, requirements: e.target.value })}
              />
            </label>

            <div className="popup-buttons">
              <button onClick={handleEvent}>Save Event</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEventBtn;
