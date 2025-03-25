import './ViewRequesters.css';
import Header from '../../../components/Header/Header'
import Menu from '../../../components/Menu/Menu'
import ParticipantCard from '../../../components/ParticipantCard/ParticipantCard';
import RequestedUserCard from './RequestedUserCard/RequestedUserCard';
import ApprovedUserCard from './ApprovedUserCard/ApprovedUserCard'
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams here
import { useLocation } from 'react-router-dom';


export default function ViewRequesters() {

    const location = useLocation();
    const { event_id, title } = location.state || {};

    const [requesters, setRequesters] = useState([]);
    const [approvedUsers, setApprovedUsers] = useState([]);

    useEffect(() => {
        if (event_id) {
            fetch(`http://localhost:8081/todolist/get-user-event/${event_id}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Fetched data:", data);
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
                })
                .catch(error => console.error("Error fetching users:", error));
        }
    }, [event_id]);  // Dependency array includes event_id to refetch when event_id changes
    
    
    

    return (
        <>
            <Header />
            <Menu />
            <h1 className="event-approval-header" style={{ marginBottom: "20px" }}>Event Approval</h1>
            <div style={{ display: "flex", gap: "0px" }}>
                <div className="col">
                    <h1>Requesters</h1>
                    {requesters.length > 0 ? (
                        requesters.map((user, index) => (
                            <RequestedUserCard 
                                key={`requester_${user.user_id}_${event_id}_${index}`} 
                                user_id={user.user_id} 
                                event_id={event_id}
                                user={user} 
                                setRequesters={setRequesters} // Pass setRequesters as a prop
                            />

                        ))
                    ) : (
                        <p>No requesters found</p>
                    )}
                </div>

                <div className="col">
                    <h1>Approved</h1>
                    {approvedUsers.length > 0 ? (
                        approvedUsers.map((user, index) => (
                            <ApprovedUserCard 
                                key={`approved_${user.user_id}_${event_id}_${index}`} 
                                title={title}
                                user_id={user.user_id} 
                                event_id={event_id} 
                                user={user}
                            />
                        ))
                    ) : (
                        <p>No approved users found</p>
                    )}
                </div>

            </div>

        </>
    )
}
