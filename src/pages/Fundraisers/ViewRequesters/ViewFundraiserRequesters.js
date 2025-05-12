import './ViewFundraiserRequesters.css';
import Header from '../../../components/Header/Header'
import Menu from '../../../components/Menu/Menu'
import ParticipantCard from '../../../components/ParticipantCard/ParticipantCard';
import RequestedUserCard from './RequestedUserCard/RequestedUserCard';
import ApprovedUserCard from './ApprovedUserCard/ApprovedUserCard'
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams here
import { useLocation } from 'react-router-dom';
const { useAuth0 } = require('@auth0/auth0-react');


export default function ViewRequesters() {

    const location = useLocation();
    const { fundraiser_id, fund_name } = location.state || {};

    const [requesters, setRequesters] = useState([]);
    const [approvedUsers, setApprovedUsers] = useState([]);

    const {getAccessTokenSilently} = useAuth0();

    useEffect(() => {
        if (fundraiser_id) {
          const fetchFundraiserData = async () => {
            let token = await getAccessTokenSilently({
              audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            });

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fundraisers/get-user-fundraiser/${fundraiser_id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });
            let data = await response.json();
      
            // Process data if it's valid
            if (Array.isArray(data)) {
              const pending = data.filter(user => user.request_status === 'pending');
              const approved = data.filter(user => user.request_status === 'approved');
        
              console.log("Pending users:", pending);
              console.log("Approved users:", approved);
        
              setRequesters(pending);
              setApprovedUsers(approved);
            } else {
              console.error("Data is not an array:", data);
            }
          };
      
          fetchFundraiserData();
        }
    }, [fundraiser_id]); 
      
    
    

    return (
        <>
            <Header />
            <Menu />
            <h1 className="fundraiser-approval-header" style={{ marginBottom: "20px" }}>Fundraiser Approval</h1>
            <div style={{ display: "flex", gap: "0px" }}>
                <div className="col">
                    <h1>Requesters</h1>
                    <div className="requesters">
                    {requesters.length > 0 ? (
                        requesters.map((user, index) => (
                            <RequestedUserCard 
                                key={`requester_${user.user_id}_${fundraiser_id}_${index}`} 
                                user_id={user.user_id} 
                                fundraiser_id={fundraiser_id}
                                user={user} 
                                setRequesters={setRequesters} // Pass setRequesters as a prop
                            />

                        ))
                    ) : (
                        <p>No requesters found</p>
                    )}
                    </div>
                </div>

                <div className="col">
                    <h1>Approved</h1>
                    <div className="approved-users">
                    {approvedUsers.length > 0 ? (
                        approvedUsers.map((user, index) => (
                            <ApprovedUserCard 
                                key={`approved_${user.user_id}_${fundraiser_id}_${index}`} 
                                fund_name={fund_name}
                                user_id={user.user_id} 
                                fundraiser_id={fundraiser_id} 
                                user={user}
                            />
                        ))
                    ) : (
                        <p>No approved users found</p>
                    )}
                    </div>
                </div>

            </div>

        </>
    )
}
