import './Fundraisers.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import Fundraisers from './FundraiserCard/FundraiserCard';

import { useState, useEffect } from 'react';
import axios from 'axios';

const FundraisersPage = (props) => {
  // const userRole = 'admin'; // Set to 'admin' or any other role for testing
  const [fundraisers, setFundraisers] = useState([]);

  // Fetch fundraiser from axios
  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/fundraisers/display');
        fetchFundraisers(response.data);
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
      <h1>Fundraisers</h1>
      <Fundraisers fundraisers={fundraisers} setFundraisers={setFundraisers} userRole={props.userRole} />
    </div>
  );
};

export default FundraisersPage;