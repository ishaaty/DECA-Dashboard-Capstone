import { useEffect, useState } from "react";
import axios from "axios";
import "./RequestedUserCard.css";
const { useAuth0 } = require('@auth0/auth0-react');

export default function RequestedUserCard(props) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const { getAccessTokenSilently } = useAuth0();

    // Fetch user info when component mounts or when `user_id` changes
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                let response;
                try {
                    // Try using the production backend
                    response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/user-info`, {
                        params: { user_id: props.user_id }
                    });
                } catch (error) {
                    console.warn('Error fetching from production backend, falling back to localhost...');
                    // If the production URL fails, fallback to localhost
                    response = await axios.get('http://localhost:8081/user/user-info', {
                        params: { user_id: props.user_id }
                    });
                }
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

    const handleApproveFundraiser = async () => {
        try {
            console.log("fundraiser_id ", props.fundraiser_id);
            console.log("user_id ", props.user_id);

            let token = await getAccessTokenSilently({
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            });

            // Make a request to approve the fundraiser
            let response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/fundraisers/approve-fundraiser/${props.fundraiser_id}/${props.user_id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );

            // Handle success (e.g., update the UI with the new status)
            console.log('Fundraiser request approved');
            
            // Update the requesters list after approving the fundraiser
            props.setRequesters(prevRequesters => 
                prevRequesters.filter(user => user.user_id !== props.user_id) // Remove the approved user from requesters
            );
        } catch (error) {
            console.error('Error approving fundraiser:', error);
        }
    };

    // Function to handle denying the fundraiser
    const handleDenyFundraiser = async () => {
        try {
            console.log("fundraiser_id ", props.fundraiser_id);
            console.log("user_id ", props.user_id);

            let token = await getAccessTokenSilently({
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            });

            // Make a request to deny the fundraiser
            let response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/fundraisers/deny-fundraiser/${props.fundraiser_id}/${props.user_id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            

            // Handle success (e.g., update the UI with the new status)
            console.log('Fundraiser request denied');
            
            // Update the requesters list after denying the fundraiser
            props.setRequesters(prevRequesters => 
                prevRequesters.filter(user => user.user_id !== props.user_id) // Remove the denied user from requesters
            );
        } catch (error) {
            console.error('Error denying fundraiser:', error);
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
                    onClick={handleApproveFundraiser} // Call approve function
                >
                    Approve
                </button>
                <button
                    className="deny-button"
                    onClick={handleDenyFundraiser} // Call deny function
                >
                    Deny
                </button>
            </div>
        </div>
    );
}
