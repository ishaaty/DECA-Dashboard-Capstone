import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Callback() {
  console.log("Reached callback");

  const { isAuthenticated, user, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Auth Check:", { isAuthenticated, user, error });

    if (isAuthenticated && user) {
      console.log("User data:", user);
      navigate("/home"); 
    } else if (error) {
      console.error("Auth0 error:", error);
      navigate("/error");
    }
  }, [isAuthenticated, user, error, navigate]);

  return <div>Loading...</div>;
}
