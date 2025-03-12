import { useEffect, useState } from "react";
import axios from "axios";
import "./RequestedUserCard.css";

export default function RequestedUserCard({ user_id }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    // Fetch user info when component mounts or when `user_id` changes
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8081/user/user-info', {
                    params: { user_id: user_id }
                });
                setUser(response.data);
            } catch (err) {
                console.error("Error fetching user info:", err);
                setError("User not found");
            }
        };

        if (user_id) {
            fetchUserInfo();
        }
    }, [user_id]);  // Re-run when `user_id` changes

    const handleStatusUpdate = async (status) => {
        try {
            // Make Axios request to update the status
            await axios.post(`http://localhost:8081/todolist/update-request-status/${user_id}`, {
                request_status: status
            });

            // Refetch the user info to update the status in the UI
            const response = await axios.get('http://localhost:8081/user/user-info', {
                params: { user_id: user_id }
            });

            // Update the user state with the latest data
            setUser(response.data);
        } catch (error) {
            console.error("Error updating status:", error);
            setError("Failed to update status");
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
                    onClick={() => handleStatusUpdate("approved")}
                >
                    Approve
                </button>
                <button
                    className="deny-button"
                    onClick={() => handleStatusUpdate("denied")}
                >
                    Deny
                </button>
            </div>
        </div>
    );
}
