import React, { useState } from 'react';
import './EditEventBtn.css';

const EditEventBtn = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  var [newEvent, editEvent] = useState({ title: props.title, descrip: '', location: '', date: '', time: '' });

  const handleEvent = () => {
    if (!newEvent.title) {
      alert('Please provide a title.');
      return;
    }
    console.log('New Event:', newEvent);
    setIsPopupOpen(false);
    editEvent({ title: '', descrip: '', location: '', date: '', time: '' });
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
                onChange={(e) => editEvent({ ...newEvent, title: e.target.value })}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={props.descrip}
                onChange={(e) => editEvent({ ...newEvent, descrip: e.target.value })}
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                value={props.location}
                onChange={(e) => editEvent({ ...newEvent, location: e.target.value })}
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                value={props.date}
                onChange={(e) => editEvent({ ...newEvent, date: e.target.value })}
              />
            </label>
            <label>
              Time:
              <input
                type="time"
                value={props.time}
                onChange={(e) => editEvent({ ...newEvent, time: e.target.value })}
              />
            </label>
            
            {/* REQUIREMENTS TBD */}

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
