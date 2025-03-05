import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserRoleContext } from '../context/UserRoleContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const userRole = useContext(UserRoleContext);

  // Wait until userRole is fetched
  if (userRole === null) {
    return <div>Loading...</div>;
  }

  // If user does not have the correct role, redirect to unauthorized page
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleBasedRoute;