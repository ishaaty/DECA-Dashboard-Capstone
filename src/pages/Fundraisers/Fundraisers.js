import './Fundraisers.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import Fundraisers from './FundraiserCard/FundraiserCard';

import { useState, useEffect, useContext } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext';
import axios from 'axios';

const FundraisersPage = () => {
  // const userRole = 'admin'; // Set to 'admin' or any other role for testing
  const [fundraisers, setFundraisers] = useState([]);
  const userRole = useContext(UserRoleContext);

  // Fetch fundraiser from axios
  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        let response;
        try {
          // Try using the production backend
          response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fundraisers/display`);
        } catch (error) {
          console.warn('Error fetching from production backend, falling back to localhost...');
          // If the production URL fails, fallback to localhost
          response = await axios.get('http://localhost:8081/fundraisers/display');
        }
        setFundraisers(response.data); // Correct way to update the state
      } catch (error) {
        console.error('Error fetching fundraisers:', error);
      }
    };
  
    fetchFundraisers();
  }, []);

  return (
    <div className="fundraisers-page">
      <Header />
      <Menu />
      <h1 className='comp'>Fundraisers</h1>
      <Fundraisers fundraisers={fundraisers} setFundraisers={setFundraisers} userRole={userRole} />
    </div>
  );
};

export default FundraisersPage;