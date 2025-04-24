import './Fundraisers.css';
import React, { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';

import CreateFundraiserBtn from './CreateFundraiserBtn/CreateFundraiserBtn';
import RequestFundraiserBtn from './RequestFundraiserBtn/RequestFundraiserBtn';
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
      let response;
  
      try {
        // Try using the production backend
        response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fundraisers/display`);
      } catch (error) {
        console.warn("Error fetching from production backend, falling back to localhost...");
  
        // If production URL fails, fallback to localhost
        response = await axios.get('http://localhost:8081/fundraisers/display');
      }
  
      try {
        console.log(response.data); // Log to check the response
        setFundraisers(response.data); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching fundraisers:', error);
      }
    };
  
    fetchFundraisers();
  }, []);

  // Handle deleting an fundraiser
  const handleDeleteFundraiser = async (fundraiser_id) => {

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/fundraisers/delete/${fundraiser_id}`);
  
      // Update frontend state
      setFundraisers(prevFundraisers =>
        prevFundraisers.filter(fundraiser => fundraiser.fundraiser_id !== fundraiser_id)
      );
    } catch (error) {
      console.error('Error deleting fundraiser:', error?.response?.data || error?.message || error);
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
  
        {(userRole === "admin" || userRole === "board member") && (
          <div className = "createfund"><CreateFundraiserBtn setFundraisers={setFundraisers} /></div>
        )}
        {userRole == "participant" && (
          <div className = "createfund"><RequestFundraiserBtn setFundraiser={setFundraisers} /></div>
        )}

    </>
  );
        }; 

export default FundraisersPage; 