import React, { useState, useEffect } from 'react';
import './CreateEventBtn.css';

import axios from '../../../../services/axiosConfig';

const CreateEventBtn = ({ events, setEvents, comp_id }) => {

  const [newEvent, setNewEvent] = useState({ comp_id: comp_id, title: '', descrip: '', location: '', date: '', time: '', req_1: '', req_2: '', req_3: '', req_4: '', req_5: '' });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  console.log("Received comp_id:", comp_id); // Debugging line

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/events/display/${comp_id}`);

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
      // Step 1: Split req_1 into an array
      let requirements = String(newEvent.req_1).split(";");
      console.log(requirements);
  
      // Step 2: Initialize reqsList with existing values
      let reqsList = [newEvent.req_1, newEvent.req_2, newEvent.req_3, newEvent.req_4, newEvent.req_5];
  
      // Step 3: Loop through 'requirements' and update 'reqsList'
      for (let i = 0; i < Math.min(requirements.length, reqsList.length); i++) {
        reqsList[i] = requirements[i];  // Update with the split values
        console.log(reqsList[i])
        console.log(requirements[i])
      }
  
      // Update newEvent with split values
      newEvent.req_1 = reqsList[0];
      newEvent.req_2 = reqsList[1];
      newEvent.req_3 = reqsList[2];
      newEvent.req_4 = reqsList[3];
      newEvent.req_5 = reqsList[4];
  
      // Optional: Log the result for debugging
      console.log("Updated reqsList:", reqsList);
  
      // Prepare event data to send to backend
      const eventData = {
        comp_id: newEvent.comp_id, // Fix typo here
        event_name: newEvent.title,
        event_descrip: newEvent.descrip,
        event_location: newEvent.location,
        event_date: newEvent.date,
        event_time: newEvent.time,
        req_1: newEvent.req_1,  // These should now have the updated values
        req_2: newEvent.req_2,
        req_3: newEvent.req_3,
        req_4: newEvent.req_4,
        req_5: newEvent.req_5,
      };
  
      // Send the event data to the backend
      const response = await axios.post('http://localhost:8081/events/add', eventData);
  
      // Fetch updated events
      fetchEvents();
  
      // Close the popup and reset form
      setIsPopupOpen(false);
      setNewEvent({
        comp_id: comp_id,
        title: '',
        descrip: '',
        location: '',
        date: '',
        time: '',
        req_1: '',
        req_2: '',
        req_3: '',
        req_4: '',
        req_5: '',
      });
  
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
              Enter ALL Requirements with ";" Separating Them:
              <input
                type="text"
                value={newEvent.requirements}
                onChange={(e) => setNewEvent({ ...newEvent, req_1: e.target.value })}
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
