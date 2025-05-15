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
  const [user_id, setUserId] = useState(null); 
  const [fundraisers, setFundraisers] = useState([]); 
  const [pendingFundraisers, setPendingFundraisers] = useState([]); 
  const [defaultFundraisers, setDefaultFundraisers] = useState([]); 
  const [deniedFundraisers, setDeniedFundraisers] = useState([]); 
  const [myFundraisers, setMyFundraisers] = useState([]);

  // Fetch user ID based on email
  useEffect(() => { 
    const fetchUserId = async () => { 

      console.log(user_id); 
      
      if (user?.email) { 
        try { 
          let response; 

          try {
            // Try using the production backend
            console.log("Fetching user_id for:", user.email);
            response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/get-user-id`, {
              params: { email: user.email }
            });

            console.log("User ID response:", response.data);

          } catch (error) { 
            console.warn('Error fetching from production backend, falling back to localhost...'); 

            // If the production URL fails, fallback to local host
            response = await axios.get('http://localhost:8081/user/get-user-id', { 
              params: { email: user.email }
            }); 
          }

          if (response.data?.user_id) { 
            setUserId(response.data.user_id); 
            console.log(user_id)
          } else { 
            console.error('User ID not found');
          }
        } catch (error) { 
          console.error('User email is not available');
        }
      }
    }; 

    fetchUserId();
  }, [user]); 

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

    const confirmDelete = window.confirm(
    `Are you sure you want to delete this fundraiser? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

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

  useEffect(() => {
    const fetchFundraisers = async () => {

        try {

            let allFundraisersResponse;
            try {
                // Try using the production backend
                allFundraisersResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fundraisers/display`);
            } catch (error) {
                console.warn('Error fetching from production backend, falling back to localhost...');
                // If the production URL fails, fallback to localhost
                allFundraisersResponse = await axios.get(`http://localhost:8081/fundraisers/display`);
            }
            const allFundraisers = allFundraisersResponse.data;



            let approvedFundraisersResponse;
            try {
                // Try using the production backend
                approvedFundraisersResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fundraisers/myfundraisers`, {
                    params: { user_id }
                });
            } catch (error) {
                console.warn('Error fetching from production backend, falling back to localhost...');
                
                // If the production URL fails, fallback to localhost
                approvedFundraisersResponse = await axios.get(`http://localhost:8081/fundraisers/myfundraisers`, {
                    params: { user_id }
                });
            }
            const approvedFundraisers = approvedFundraisersResponse.data;



            let pendingFundraisersResponse;
            try {
                // Try using the production backend
                pendingFundraisersResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fundraisers/pending-fundraisers`, {
                    params: { user_id }
                });
            } catch (error) {
                console.warn('Error fetching from production backend, falling back to localhost...');
                // If the production URL fails, fallback to localhost
                pendingFundraisersResponse = await axios.get(`http://localhost:8081/fundraisers/pending-fundraisers`, {
                    params: { user_id }
                });
            }
            const pendingFundraisers = pendingFundraisersResponse.data;



            let deniedFundraisersResponse;
            try {
                // Try using the production backend
                deniedFundraisersResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fundraisers/denied-fundraisers`, {
                    params: { user_id }
                });
            } catch (error) {
                console.warn('Error fetching from production backend, falling back to localhost...');
                
                // If the production URL fails, fallback to localhost
                deniedFundraisersResponse = await axios.get(`http://localhost:8081/fundraisers/denied-fundraisers`, {
                    params: { user_id }
                });
            }
            const deniedFundraisers = deniedFundraisersResponse.data; // List of denied fundraiser IDs



            // Filter fundraisers based on their categories
            const approvedFundraiserIds = approvedFundraisers.map(fundraiser => fundraiser.fundraiser_id);
            const pendingFundraiserIds = pendingFundraisers.map(fundraiser => fundraiser.fundraiser_id);
            const deniedFundraiserIds = deniedFundraisers.map(fundraiser => fundraiser.fundraiser_id);

            // Default fundraisers: Fundraisers that are not in approved, pending, or denied lists
            const defaultFundraisersList = allFundraisers.filter(fundraiser =>
                !approvedFundraiserIds.includes(fundraiser.fundraiser_id) &&
                !pendingFundraiserIds.includes(fundraiser.fundraiser_id) &&
                !deniedFundraiserIds.includes(fundraiser.fundraiser_id) // Exclude denied fundraisers
            );

            // Update state
            setFundraisers(allFundraisers); // For displaying all fundraisers, if needed
            setMyFundraisers(approvedFundraisers); // Approved fundraisers
            setPendingFundraisers(pendingFundraisers); // Pending fundraisers
            setDefaultFundraisers(defaultFundraisersList); // Default fundraisers (without denied ones)
            setDeniedFundraisers(deniedFundraisers);

        } catch (error) {
            console.error("Error fetching fundraisers:", error);
        }
    };

    fetchFundraisers();
}, [user_id]
);

if (userRole === "admin") { 
    return (
      <>
        <Header />
        <Menu />

        <h1 id = "fundheader">Fundraisers</h1>
    
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
                user_id={user_id}
                acquired={fundraiser.acquired}
                setFundraisers={setFundraisers}
                onDelete={() => handleDeleteFundraiser(fundraiser.fundraiser_id)}            />
            ))
          ) : (
            <p></p>
          )}
          </div>

          <div className = "createfund"><CreateFundraiserBtn setFundraisers={setFundraisers} /></div>

      </>
    );
} else if (userRole === "board member") { 
  return (
    <>
      <Header />
      <Menu />

      <div id = "fundheader">Fundraisers</div>
  
      <div className ="funds">
        {pendingFundraisers.length > 0 ? (
          pendingFundraisers.map((fundraiser) => (
            <FundraiserCard
              key={fundraiser.fundraiser_id}
              fundraiser_id={fundraiser.fundraiser_id}
              fund_name={fundraiser.fund_name}
              fund_description={fundraiser.fund_description}
              fund_location={fundraiser.fund_location}
              fund_date={fundraiser.fund_date}
              user_id={user_id}
              acquired={fundraiser.acquired}
              status = {"pending"}
              setFundraisers={setFundraisers}
              onDelete={() => handleDeleteFundraiser(fundraiser.fundraiser_id)}            />
          ))
        ) : (
          <h2>Requested</h2>
        )}
        {myFundraisers.length > 0 ? (
          myFundraisers.map((fundraiser) => (
            <FundraiserCard
              key={fundraiser.fundraiser_id}
              fundraiser_id={fundraiser.fundraiser_id}
              fund_name={fundraiser.fund_name}
              fund_description={fundraiser.fund_description}
              fund_location={fundraiser.fund_location}
              fund_date={fundraiser.fund_date}
              user_id={user_id}
              acquired={fundraiser.acquired}
              status = {"approved"}
              setFundraisers={setFundraisers}
              onDelete={() => handleDeleteFundraiser(fundraiser.fundraiser_id)}            />
          ))
        ) : (
          <h2>Approved</h2>
        )}
        {defaultFundraisers.length > 0 ? (
          defaultFundraisers.map((fundraiser) => (
            <FundraiserCard
              key={fundraiser.fundraiser_id}
              fundraiser_id={fundraiser.fundraiser_id}
              fund_name={fundraiser.fund_name}
              fund_description={fundraiser.fund_description}
              fund_location={fundraiser.fund_location}
              fund_date={fundraiser.fund_date}
              user_id={user_id}
              acquired={fundraiser.acquired}
              status = {"default"}
              setFundraisers={setFundraisers}
              onDelete={() => handleDeleteFundraiser(fundraiser.fundraiser_id)}            />
          ))
        ) : (
          <h2>[All other Fundraisers here]</h2>
        )}
        </div>

        <div className = "createfund"><CreateFundraiserBtn setFundraisers={setFundraisers} /></div>



    </>
  );
} else { 
  return (
    <>
      <Header />
      <Menu />

      <div id = "fundheader"><h1>Fundraisers</h1></div>
  
      <div className ="funds">
        {pendingFundraisers.length > 0 ? (
          pendingFundraisers.map((fundraiser) => (
            <FundraiserCard
              key={fundraiser.fundraiser_id}
              fundraiser_id={fundraiser.fundraiser_id}
              fund_name={fundraiser.fund_name}
              fund_description={fundraiser.fund_description}
              fund_location={fundraiser.fund_location}
              fund_date={fundraiser.fund_date}
              user_id={user_id}
              acquired={fundraiser.acquired}
              setFundraisers={setFundraisers}
              status = {"pending"}           />
          ))
        ) : (
          <h2>Requested</h2>
        )}
        {defaultFundraisers.length > 0 ? (
          defaultFundraisers.map((fundraiser) => (
            <FundraiserCard
              key={fundraiser.fundraiser_id}
              fundraiser_id={fundraiser.fundraiser_id}
              fund_name={fundraiser.fund_name}
              fund_description={fundraiser.fund_description}
              fund_location={fundraiser.fund_location}
              fund_date={fundraiser.fund_date}
              user_id={user_id}
              acquired={fundraiser.acquired}
              setFundraisers={setFundraisers}
              status = {"default"}           />
          ))
        ) : (
          <h3>[All other Fundraisers here]</h3>
        )}
        {myFundraisers.length > 0 ? (
          myFundraisers.map((fundraiser) => (
            <FundraiserCard
              key={fundraiser.fundraiser_id}
              fundraiser_id={fundraiser.fundraiser_id}
              fund_name={fundraiser.fund_name}
              fund_description={fundraiser.fund_description}
              fund_location={fundraiser.fund_location}
              fund_date={fundraiser.fund_date}
              user_id={user_id}
              acquired={fundraiser.acquired}
              setFundraisers={setFundraisers}
              status = {"approved"}           />
          ))
        ) : (
          <h2>Approved</h2>
        )}
        </div>
    </>
  );
}
}

export default FundraisersPage; 