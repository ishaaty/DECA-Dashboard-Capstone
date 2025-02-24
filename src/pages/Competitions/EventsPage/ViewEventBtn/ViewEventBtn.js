import React, { useState } from 'react';
import './ViewEventBtn.css';

const ViewEventBtn = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // const [newEvent, setNewEvent] = useState({ title: '', descrip: '', date: '', time: '', req_1: '', req_2: '', req_3: '', req_4: '', req_5: '' });
  const reqs = [props.req_1, props.req_2, props.req_3, props.req_4, props.req_5];

  // Filter out null, undefined, or empty values and join the rest with commas
  const displayReqs = reqs.filter(req => req).join(", ");

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
              <strong>Requirements:</strong> {displayReqs}
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
