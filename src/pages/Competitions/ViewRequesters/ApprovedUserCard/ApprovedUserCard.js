import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router
import "./ApprovedUserCard.css";

export default function ApprovedUserCard({ user_id, event_id, title }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();  // Correct usage of navigate

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                let response;
                try {
                    // Try using the production backend
                    response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/user-info`, {
                        params: { user_id: user_id }
                    });
                } catch (error) {
                    console.warn('Error fetching from production backend, falling back to localhost...');
                    
                    // If the production URL fails, fallback to localhost
                    response = await axios.get('http://localhost:8081/user/user-info', {
                        params: { user_id: user_id }
                    });
                }
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
