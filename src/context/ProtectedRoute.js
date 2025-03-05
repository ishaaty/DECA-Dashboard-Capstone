import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading authentication...</div>;

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

// This will be used as a wrapper for the pages that cannot be accesssed before login
export default ProtectedRoute;
