import React, { useState } from 'react';
import './ViewEventBtn.css';

const ViewEventBtn = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', descrip: '', date: '', time: '', requirements: [] });

  // const handleEvent = () => {
  //   if (!newEvent.title) {
  //     alert('Please provide a title.');
  //     return;
  //   }
  //   console.log('New Event:', newEvent);
  //   setIsPopupOpen(false);
  //   setNewEvent({ title: '', descrip: '', date: '', time: '', requirements: [] });
  // };

  return (
    <div className="create-event-container">
      <div>
        <button className="edit-event-dets-btn" onClick={() => setIsPopupOpen(true)}>
          View Event Details
        </button>
      </div>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <strong><h2>{props.title}</h2></strong>
            <label>
              <strong>Description:</strong> {props.descrip}
            </label>
            <label>
              <strong>Date:</strong> {props.date}
            </label>
            <label>
              <strong>Time:</strong> {props.time}
            </label>
            <label>
              <strong>Requirements:</strong> TBD
              {/* FIGURE THIS ONE OUT */}
            </label>
            <div className="popup-buttons">
              <button onClick={() => setIsPopupOpen(false)}>Exit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ViewEventBtn;
