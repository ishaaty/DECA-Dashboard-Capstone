import React, { useState } from 'react';
import './EditFundraiserBtn.css';
import axios from '../../../services/axiosConfig';

const EditFundraiserBtn = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newFundraiser, setNewFundraiser] = useState({
    fund_name: props.fund_name || '',
    fund_description: props.fund_description || '',
    fund_date: props.fund_date || '', 
    fund_location: props.fund_location || '', 
  });


  // Function to fetch updated fundraisers
  const fetchFundraisers = async () => {

    try {
      // Get fundraisers from the backend
      let response;
        try {
          // Try using the production backend
          response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fundraisers/display`);
          props.setFundraisers(response.data); // Update the parents state with the fetched data
        } catch (error) {
          console.warn('Error fetching from production backend, falling back to localhost...');
          response = await axios.get('http://localhost:8081/fundraisers/display');
          props.setFundraisers(response.data);
        } 
    } catch (error) { 
      console.error('Error fetching fundraisers:', error);
    }
  };

  // Function to handle the PUT request and update the fundraiser
  const handleFundraiser = async () => {
    console.log('Current state of newFundraiser:', newFundraiser); // Log state before making request

    if (!newFundraiser.fund_name || !newFundraiser.fund_description || !newFundraiser.fund_date || !newFundraiser.fund_location) {
      alert('Please provide both a name, description, date, and location.');
      return;
    }

    const fundraiserData = {
      fund_name: newFundraiser.fund_name,
      fund_description: newFundraiser.fund_description, 
      fund_date: newFundraiser.fund_date, 
      fund_location: newFundraiser.fund_location, 
    };
    let response;

    try {
      // Attempt to update fundraiser using production backend
      console.log("Attempting to edit fundraiser with ID:", props.fundraiser_id);
  
      response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/fundraisers/edit/${props.fundraiser_id}`,
        fundraiserData
      );
  
      console.log('Updated Fundraiser:', response.data);
    } catch (error) {
      console.warn("Error fetching from production backend, falling back to localhost...");
  
      // Fallback to local backend
      console.log('Attempting to edit fundraiser with ID:', props.fundraiser_id);
  
      response = await axios.put(
        `http://localhost:8081/fundraisers/edit/${props.fundraiser_id}`,
        fundraiserData
      );
  
      console.log('Updated Fundraiser:', response.data);
    }
  
    try {
      // Fetch updated fundraisers from the server
      fetchFundraisers();
  
      // Close popup and reset form fields with updated data
      setIsPopupOpen(false);
  
      setNewFundraiser({
        fund_name: response.data.fund_name,
        fund_description: response.data.fund_description,
        fund_date: response.data.fund_date,
        fund_location: response.data.fund_location,
      });
    } catch (error) {
      console.error('Error updating fundraiser:', error);
      alert('Failed to update fundraiser. Please try again.');
    }
  };

  // Open the popup with the current state when clicking the "Edit" button
  const handleOpenPopup = () => {
    setNewFundraiser({
      fund_name: props.fund_name,
      fund_description: props.fund_description,
      fund_location: props.fund_location, 
      fund_date: props.fund_date
    });
    setIsPopupOpen(true);
  };

  return (
    <div className="create-fundraiser-container">
      <div>
        <button className="edit-fundraiser-dets-btn" onClick={handleOpenPopup}>
          Edit Fundraiser Details
        </button>
      </div>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Edit</h2>
            <label>
              Title:
              <input
                type="text"
                value={newFundraiser.fund_name}
                onChange={(e) =>
                  setNewFundraiser({ ...newFundraiser, fund_name: e.target.value })
                }
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={newFundraiser.fund_description}
                onChange={(e) =>
                  setNewFundraiser({ ...newFundraiser, fund_description: e.target.value })
                }
              />
            </label>
            <label>
              Date: 
              <input
                type="date"
                value={newFundraiser.fund_date}
                onChange={(e) =>
                  setNewFundraiser({ ...newFundraiser, fund_date: e.target.value })
                }
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                value={newFundraiser.fund_location}
                onChange={(e) =>
                  setNewFundraiser({ ...newFundraiser, fund_location: e.target.value })
                }
              />
            </label>
            <div className="popup-buttons">
              <button onClick={handleFundraiser}>Save Fundraiser</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditFundraiserBtn;
