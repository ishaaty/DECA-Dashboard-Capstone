import React, { useState } from 'react';
import './EditEventBtn.css';

import axios from '../../../../services/axiosConfig';

const EditEventBtn = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newEvent, editEvent] = useState({ 
    title: props.title || '', 
    descrip: props.descrip || '', 
    location: props.location || '', 
    date: props.date || '', 
    time: props.time || '',
    req_1: props.req_1 || '',
    req_2: props.req_2 || '',
    req_3: props.req_3 || '',
    req_4: props.req_4 || '',
    req_5: props.req_5 || ''

  });

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/events/display/${props.comp_id}`);

      // Update the state with the new event
      props.setEvents(response.data); 
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEvent = async () => { 
    if (!newEvent.title) {
        alert('Please provide a title.');
        return;
    }

    const eventData = {
        event_name: newEvent.title,
        event_descrip: newEvent.descrip,
        event_location: newEvent.location,
        event_date: newEvent.date,
        event_time: newEvent.time,
        req_1: newEvent.req_1,
        req_2: newEvent.req_2,
        req_3: newEvent.req_3,
        req_4: newEvent.req_4,
        req_5: newEvent.req_5,
    };

    try {
        // Send a PUT request to edit the event

        console.log("attempting to edit event with id: ");
        console.log(props.event_id);

        const response = await axios.put(`http://localhost:8081/events/edit/${props.event_id}`, eventData);

        console.log('Updated Event:', response.data);

        // Fetch updated events
        fetchEvents();

        // Close the popup and reset form
        setIsPopupOpen(false);
        editEvent({ title: newEvent.title, descrip: newEvent.descrip, location: newEvent.location, date: newEvent.date, time: newEvent.time, req_1: newEvent.req_1, req_2: newEvent.req_2, req_3: newEvent.req_3, req_4: newEvent.req_4, req_5: newEvent.req_5 });
    } catch (error) {
        console.error('Error updating event:', error);
        alert('Failed to update event. Please try again.');
    }
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
                value={newEvent.title}
                onChange={(e) => editEvent({ ...newEvent, title: e.target.value })}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={newEvent.descrip}
                onChange={(e) => editEvent({ ...newEvent, descrip: e.target.value })}
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => editEvent({ ...newEvent, location: e.target.value })}
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => editEvent({ ...newEvent, date: e.target.value })}
              />
            </label>
            <label>
              Time:
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => editEvent({ ...newEvent, time: e.target.value })}
              />
            </label>
            <label>
              Requirement 1:
              <input
                type="text"
                value={newEvent.req_1}
                onChange={(e) => editEvent({ ...newEvent, req_1: e.target.value })}
              />
            </label>
            <label>
              Requirement 2:
              <input
                type="text"
                value={newEvent.req_2}
                onChange={(e) => editEvent({ ...newEvent, req_2: e.target.value })}
              />
            </label>
            <label>
              Requirement 3:
              <input
                type="text"
                value={newEvent.req_3}
                onChange={(e) => editEvent({ ...newEvent, req_3: e.target.value })}
              />
            </label>
            <label>
              Requirement 4:
              <input
                type="text"
                value={newEvent.req_4}
                onChange={(e) => editEvent({ ...newEvent, req_4: e.target.value })}
              />
            </label>
            <label>
              Requirement 5:
              <input
                type="text"
                value={newEvent.req_5}
                onChange={(e) => editEvent({ ...newEvent, req_5: e.target.value })}
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
