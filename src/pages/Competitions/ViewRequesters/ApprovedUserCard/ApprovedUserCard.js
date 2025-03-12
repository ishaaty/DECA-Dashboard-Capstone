import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router
import "./ApprovedUserCard.css";
import { Link } from "react-router-dom";

export default function ApprovedUserCard({ user_id, event_id }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();  // useNavigate is correct here

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/user/user-info`, { 
                    params: { user_id: user_id }
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
        console.log("Navigating with:", { user_id, event_id }); // Log the values
        navigate('/todolist', { state: { user_id, event_id } });
    };
    

    return (
        <div className="card-container">
            <p className="card-title">
                <strong>{user ? `${user.first_name} ${user.last_name}` : "Loading..."}</strong>
            </p>
            <p>{user ? `${user.email}` : "Loading..."}</p>
            <Link to={`/todolist?user_id=${user_id}&event_id=${event_id}`}>
                <button style={{ backgroundColor: "#00529B" }} className="view-requesters-btn">
                    View Todo List
                </button>
            </Link>
        </div>
    );
}
