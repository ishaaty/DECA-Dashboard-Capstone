import './Fundraisers.css';
import React, { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';

import CreateFundraiserBtn from './CreateFundraiserBtn/CreateFundraiserBtn';
import FundraiserCard from './FundraiserCard/FundraiserCard';
import EditFundraiserBtn from './EditFundraiserBtn/EditFundraiserBtn'; 
import { useAuth0 } from '@auth0/auth0-react';
import { UserRoleContext } from '../../context/UserRoleContext';
import axios from 'axios';

const FundraisersPage = () => {
  const { user, isAuthenticated } = useAuth0();
  const userRole = useContext(UserRoleContext);
  const [fundraisers, setFundraisers] = useState([]); // Ensure it's an array

  // Fetch fundraisers from axios
  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/fundraisers/display');
        console.log(response.data); // Log to check the response
        setFundraisers(response.data); // Correct way to update the state
      } catch (error) {
        console.error('Error fetching fundraisers:', error);
      }
    };

    fetchFundraisers();
  }, []);

  // Handle deleting an fundraiser
  const handleDeleteFundraiser = async (fundraiser_id) => {
    try {
      // Send request to backend to delete the fundraiser
      await axios.delete(`http://localhost:8081/fundraisers/delete/${fundraiser_id}`);

      // Remove the deleted fundraiser from the state
      setFundraisers(prevFundraisers =>
        prevFundraisers.filter(fundraiser => fundraiser.fundraiser_id !== fundraiser_id)
      );
    } catch (error) {
      console.error('Error deleting fundraiser:', error);
      alert('Failed to delete fundraiser.');
    }
  };
  return (
    <>
      <Header />
      <Menu />

      <div id = "fundheader"><h3>Fundraisers</h3></div>
  
      <div className ="funds">
        {fundraisers.length > 0 ? (
          fundraisers.map((fundraiser) => (
            <FundraiserCard
              key={fundraiser.fundraiser_id}
              fundraiser_id={fundraiser.fundraiser_id}
              fund_name={fundraiser.fund_name}
              fund_description={fundraiser.fund_description}
              fund_location={fundraiser.fund_location}
              fund_date={fundraiser.fund_date}
              acquired={fundraiser.acquired}
              setFundraisers={setFundraisers}
              onDelete={() => handleDeleteFundraiser(fundraiser.fundraiser_id)}            />
          ))
        ) : (
          <p>No fundraisers yet.</p>
        )}
        </div>
  
        {userRole === "admin" && (
          <div className = "createfund"><CreateFundraiserBtn setFundraisers={setFundraisers} /></div>
        )}

    </>
  );
        }; 

export default FundraisersPage; 