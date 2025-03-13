import { useEffect, useState } from "react";
import axios from "axios";
import "./RequestedUserCard.css";

export default function RequestedUserCard(props) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    // Fetch user info when component mounts or when `user_id` changes
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8081/user/user-info', {
                    params: { user_id: props.user_id }
                });
                setUser(response.data);
            } catch (err) {
                console.error("Error fetching user info:", err);
                setError("User not found");
            }
        };

        if (props.user_id) {
            fetchUserInfo();
        }
    }, [props.user_id]);  // Re-run when `user_id` changes

    const handleApproveEvent = async () => {
        try {
            console.log("event_id ", props.event_id);
            console.log("user_id ", props.user_id);

            // Make a request to approve the event
            const response = await axios.post(`http://localhost:8081/todolist/approve-event/${props.event_id}/${props.user_id}`);

            // Handle success (e.g., update the UI with the new status)
            console.log('Event request approved');
            
            // Update the requesters list after approving the event
            props.setRequesters(prevRequesters => 
                prevRequesters.filter(user => user.user_id !== props.user_id) // Remove the approved user from requesters
            );
        } catch (error) {
            console.error('Error approving event:', error);
        }
    };

    // Function to handle denying the event
    const handleDenyEvent = async () => {
        try {
            console.log("event_id ", props.event_id);
            console.log("user_id ", props.user_id);

            // Make a request to deny the event
            const response = await axios.post(`http://localhost:8081/todolist/deny-event/${props.event_id}/${props.user_id}`);

            // Handle success (e.g., update the UI with the new status)
            console.log('Event request denied');
            
            // Update the requesters list after denying the event
            props.setRequesters(prevRequesters => 
                prevRequesters.filter(user => user.user_id !== props.user_id) // Remove the denied user from requesters
            );
        } catch (error) {
            console.error('Error denying event:', error);
        }
    };

    if (error) return <p>{error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <div className="card-container">
            <strong>
                <p className="card-title">
                    {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
                </p>
            </strong>
            <p>{user ? `${user.email}` : "Loading..."}</p>
            <div>
                <button
                    className="approve-button"
                    onClick={handleApproveEvent} // Call approve function
                >
                    Approve
                </button>
                <button
                    className="deny-button"
                    onClick={handleDenyEvent} // Call deny function
                >
                    Deny
                </button>
            </div>
        </div>
    );
}
