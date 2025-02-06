import React, { useState, useEffect } from 'react';
import './FundraiserCard.css';

import axios from '../../../services/axiosConfig';

// Single Fundraiser Component
const Fundraiser = ({ title, description, date, userRole, onDelete }) => {
  return (
    <div className="fundraiser-box">
      <p className="fundraiser-title">{title}</p>
      <p className="fundraiser-descrip">{description}</p>
      <p className="fundraiser-date">{date}</p>
      {userRole === 'admin' && (
        <button className="fundraiser-button" onClick={onDelete}>
          Delete
        </button>
      )}
    </div>
  );
};

// Fundraisers List Component
const Fundraisers = ({ fundraisers, userRole }) => {
  const [fundraiserList, setFundraiserList] = useState([]);

  // Synchronize fundraiserList state with fundraisers prop
  useEffect(() => {
    setFundraiserList(fundraisers);
  }, [fundraisers]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newFundraiser, setNewFundraiser] = useState({ title: '', description: '', date: '' });


  const handleAddFundraiser = async () => {
    if (!newFundraiser.title || !newFundraiser.description || !newFundraiser.date) {
      alert('Please provide a title, description, and date.');
      return;
    }
  
    try {
      const FundraiserData = {
        name: newFundraiser.title,
        description: newFundraiser.description,
        date: newFundraiser.date,
      };
  
      console.log('Sending payload:', FundraiserData); // Log the payload
  
      const response = await axios.post('http://localhost:8081/fundraisers/add', FundraiserData);
  
      console.log('Fundraiser added:', response.data);
      setFundraiserList([...fundraiserList, response.data]);
      setIsPopupOpen(false);
      setNewFundraiser({ title: '', description: '', date: ''});
    } catch (error) {
      if (error.response) {
        console.error('Error adding fundraiser:', error.response.data);
        alert(`Failed to add fundraiser: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error('Error adding fundraiser:', error);
        alert('Failed to add fundraiser.');
      }
    }
  };
  

  const handleDeleteFundraiser = async (id) => {
    try {
      // send the id of the fundraiser to delete to the backend
      await axios.delete(`http://localhost:8081/fundraisers/delete/${id}`);
      setFundraiserList(fundraiserList.filter((fundraiser) => fundraiser.fundraiser_id !== id)); // Update local state
    } catch (error) {
      console.error('Error deleting fundraiser:', error);
      alert('Failed to delete fundraiser.');
    }
  };
  

  return (
    <>
      <div className="fundraisers-container">
        {fundraiserList.map((fundraiser, index) => (
          <Fundraiser
            key={fundraiser.fundraiser_id}
            title={fundraiser.fundraiser_name || fundraiser.title}
            description={fundraiser.fundraiser_description || fundraiser.description}
            date={fundraiser.fundraiser_date || fundraiser.date}
            userRole={userRole}
            onDelete={() => handleDeleteFundraiser(fundraiser.fundraiser_id)}
          />
        ))}
      </div>
      {userRole === 'admin' && (
        <>
          <div className="center-button-container">
            <button className="center-button" onClick={() => setIsPopupOpen(true)}>
              Add New Fundraiser
            </button>
          </div>
          {isPopupOpen && (
            <div className="popup">
              <div className="popup-content">
                <h2>Add New Fundraiser</h2>
                <label>
                  Name:
                  <input
                    type="title"
                    value={newFundraiser.title}
                    onChange={(e) => setNewFundraiser({ ...newFundraiser, title: e.target.value })}
                  />
                </label>
                <label>
                  description:
                  <input
                    type="description"
                    value={newFundraiser.description}
                    onChange={(e) =>
                      setNewFundraiser({ ...newFundraiser, description: e.target.value })
                    }
                  />
                </label>
                <label>
                  date:
                  <input
                    type="date"
                    value={newFundraiser.date}
                    onChange={(e) =>
                      setNewFundraiser({ ...newFundraiser, date: e.target.value })
                    }
                  />
                </label>
                <div className="popup-buttons">
                  <button onClick={handleAddFundraiser}>Add Fundraiser</button>
                  <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
          
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Fundraisers;
