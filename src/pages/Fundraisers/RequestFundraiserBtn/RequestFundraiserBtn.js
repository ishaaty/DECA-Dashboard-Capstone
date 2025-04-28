import React, { useState } from 'react';
import './RequestFundraiserBtn.css';
import axios from '../../../services/axiosConfig';

const RequestFundraiserBtn = ({ setFundraisers }) => {
  const [newFundraiser, setNewFundraiser] = useState({ fund_name: '', fund_description: '', fund_date: '', fund_location: '' });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleAddFundraiser = async () => {
    if (!newFundraiser.fund_name || !newFundraiser.fund_description || !newFundraiser.fund_date || !newFundraiser.fund_location) {
      alert('Please provide a name, description, date, and location.');
      return;
    }
    console.log("Adding New Fundraiser:", {
      fund_name: newFundraiser.fund_name,
      fund_description: newFundraiser.fund_description,
      fund_date: newFundraiser.fund_date, 
      fund_location: newFundraiser.fund_location,
    });

    try {
      // Add new fundraiser to the backend
      let response;
        try {
          // Try using the production backend
          response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/fundraisers/add`, {
            fund_name: newFundraiser.fund_name,
            fund_description: newFundraiser.fund_description,
            fund_date: newFundraiser.fund_date, 
            fund_location: newFundraiser.fund_location, 
          });
        } catch (error) {
          console.warn('Error fetching from production backend, falling back to localhost...');
          response = await axios.post('http://localhost:8081/fundraisers/add', {
            fund_name: newFundraiser.fund_name,
            fund_description: newFundraiser.fund_description,
            fund_date: newFundraiser.fund_date, 
            fund_location: newFundraiser.fund_location, 
          });
        }

      

      // Add the new fundraiser to the current list of fundraisers (state)
      setFundraisers(prevFundraisers=> [...prevFundraisers, response.data]);

      // Close popup and reset input fields
      setIsPopupOpen(false);
      setNewFundraiser({ fund_name: '', fund_description: '', fund_date: '', fund_location: '' });
    } catch (error) {
      console.error('Error adding fundraiser:', error);
      alert('Failed to add fundraiser.');
    }
  };

  

  return (
    <div className="create-fundraiser-container">
      <button className="center-button" onClick={() => setIsPopupOpen(true)}>
        Request Fundraiser
      </button>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Request New Fundraiser</h2>
            <label>
              Name:
              <input
                type="text"
                value={newFundraiser.fund_name}
                onChange={(e) => setNewFundraiser({ ...newFundraiser, fund_name: e.target.value })}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={newFundraiser.fund_description}
                onChange={(e) => setNewFundraiser({ ...newFundraiser, fund_description: e.target.value })}
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                value={newFundraiser.fund_date}
                onChange={(e) => setNewFundraiser({ ...newFundraiser, fund_date: e.target.value })}
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                value={newFundraiser.fund_location}
                onChange={(e) => setNewFundraiser({ ...newFundraiser, fund_location: e.target.value })}
              />
            </label>
            <div className="popup-buttons">
              <button onClick={handleAddFundraiser}>Create</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestFundraiserBtn;
