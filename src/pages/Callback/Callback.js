import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export default function Callback() {
  console.log("Reached callback");

  const { isAuthenticated, user, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Auth Check:", { isAuthenticated, user, error });

    if (isAuthenticated && user) {
      console.log("User data:", user);
      
      const fetchUserRole = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/user/role?email=${user.email}`);
            const role = response.data.role;
    
            if (role && ["participant", "admin", "board member"].includes(role)) {
                navigate("/home");
            } else {
                navigate("/pending-approval");
            }
        } catch (err) {
            console.error("Error fetching user role:", err);
    
            if (err.response) {
                if (err.response.status === 404) {
                    // User not found -> pending approval
                    navigate("/pending-approval");
                } else if (err.response.status === 400) {
                    console.error("Invalid request: Missing email");
                    navigate("/error");
                } else {
                    navigate("/error");
                }
            } else {
                // Network or unexpected error
                navigate("/error");
            }
        }
    };    

      fetchUserRole();
    } else if (error) {
      console.error("Auth0 error:", error);
      navigate("/error");
    }
  }, [isAuthenticated, user, error, navigate]);

  return <div>Loading...</div>;
}
