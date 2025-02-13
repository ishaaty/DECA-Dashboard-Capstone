import React, { useState, useEffect } from 'react';
import './CreateEventBtn.css';

import axios from '../../../../services/axiosConfig';

const CreateEventBtn = ({ events, comp, setEvents }) => {

  let comp_id = 0;

  if (comp == "Regionals"){
    comp_id = 1;
  } else if (comp == "States"){
    comp_id = 2;
  } else {
    comp_id = 3;
  }

  const [newEvent, setNewEvent] = useState({ competition_id: comp_id, title: '', descrip: '', location: '', date: '', time: '' });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8081/events/display');
      
      // Update the state with the new event
      setEvents(response.data); 
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Fetch events once when component mounts
  useEffect(() => {
    fetchEvents();
  }, []); // Empty dependency array ensures this runs only once


  const handleAddEvent = async () => {
    // Ensure a title is provided before adding
    if (!newEvent.title) {
      alert('Please provide a title.');
      return;
    }
    try {
      // Prepare event data to send to backend
      const eventData = {
        competition_id: newEvent.competition_id, // Fix typo here
        event_name: newEvent.title,
        event_descrip: newEvent.descrip,
        event_location: newEvent.location,
        event_date: newEvent.date,
        event_time: newEvent.time
      };

      // Send the event data to the backend
      const response = await axios.post('http://localhost:8081/events/add', eventData);

      fetchEvents();

      // Close the popup and reset form
      setIsPopupOpen(false);
      setNewEvent({ competition_id: 1, title: '', descrip: '', location: '', date: '', time: '' });


    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event.');
    }
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
              <button onClick={handleAddEvent}>Create Event</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEventBtn;
