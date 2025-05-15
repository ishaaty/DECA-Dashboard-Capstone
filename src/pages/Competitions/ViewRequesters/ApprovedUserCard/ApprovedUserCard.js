import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router
import "./ApprovedUserCard.css";
import { useAuth0 } from '@auth0/auth0-react';

export default function ApprovedUserCard({ user_id, event_id, title }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                let token = await getAccessTokenSilently({
                    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                });
                
                let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/user-info`, {
                    params: { user_id: user_id },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        if (user_id) {
            fetchUserInfo();
        }
    }, [user_id]);

    const handleViewTodoList = () => {
        console.log("Navigating with:", { user_id, event_id, user, title }); // Log to confirm
        // Pass user_id, event_id, and user object to the 'todolist' page
        navigate('/todolist', { state: { user_id, event_id, user, title } });
    };

    return (
        <div className="card-container">
            <p className="card-title">
                <strong>{user ? `${user.first_name} ${user.last_name}` : "Loading..."}</strong>
            </p>
            <p>{user ? `${user.email}` : "Loading..."}</p>
            <button
                className="approved-user-card-btn" id="view-todo-list"
                onClick={handleViewTodoList} // Use the button's onClick handler
            >
                View Todo List
            </button>
        </div>
    );
}
