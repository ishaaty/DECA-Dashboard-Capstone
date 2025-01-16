import React, { useState } from 'react';
import './AddGCalEvent.css';

const AddGCalEvent= () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', location: '', descrip: '', timezone: '', isAllDay: false, startDate: '',
    startTime: '', endDate: '', endTime: '', attendees: []
    });


  const handleAddEvent = () => {
    // TODO: FIGURE OUT MINIMUM CONDITIONS
    if (!newEvent.text || (!newEvent.link && !newEvent.pdf)) {
      alert('Please provide a name and either a link or a PDF file.');
      return;
    }
    console.log('New Event:', newEvent); // Log the new resource
    setIsPopupOpen(false);
    setNewEvent({ text: '', link: '', pdf: '' });
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
              Title:
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
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
              Timezone:
              <select
                value={newEvent.timezone}
                onChange={(e) => setNewEvent({ ...newEvent, timezone: e.target.value })}
              >
                <option value="EST">EST</option>
                <option value="PST">PST</option>
                <option value="UTC">UTC</option>
                <option value="GMT">GMT</option>
                {/* Add more timezones as needed */}
              </select>
            </label>
            
            <label>
              All Day
              <input
                type="checkbox"
                value={newEvent.isAllDay}
                onChange={(e) => setNewEvent({ ...newEvent, isAllDay: e.target.value })}
              />
            </label>
            <label>
              Start Date
              <input
                type="date"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
              />
            </label>

            <label>
              Start Time
              <input
                type="time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
              />
            </label>

            <label>
              End Date:
              <input
                type="date"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              />
            </label>

            <label>
              End Time:
              <input
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
              />
            </label>
            <label>
              Attendees:
              <select
                multiple
                value={newEvent.attendees} // This should be an array of selected options
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setNewEvent({ ...newEvent, attendees: selectedOptions }); // Update the state with the array of selected options
                }}
                style={{ display: 'block', marginBottom: '10px' }} // Style for the select dropdown
              >
                <option value="admin">Admin</option>
                <option value="board-members">Board Members</option>
                <option value="participants">Participants</option>
              </select>

              {/* Display selected attendees inside the same label */}
              <div>
                <strong>Selected Attendees: </strong>
                <ul>
                  {newEvent.attendees.map((attendee, index) => (
                    <p key={index}>{attendee}</p>
                  ))}
                </ul>
              </div>
            </label>

            <div className="popup-buttons">
              <button onClick={handleAddEvent}>Add Event</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddGCalEvent;
