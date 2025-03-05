import React, { createContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

// pages will be wrapped with this component so that they can access the user's role
export const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const { isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          
          // Send a request to get the user role
          const response = await axios.get('http://localhost:8081/user/role', {
            params: { email: user.email },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserRole(response.data.role);
          console.log('User role:', response.data.role);
        } catch (err) {
          console.error('Error fetching role:', err);
          setUserRole(null);
        }
      }
    };

    if (!isLoading && isAuthenticated && user) {
      fetchRole(); 
    }
  }, [isAuthenticated, user, getAccessTokenSilently, isLoading]);

  // Wait until user is authenticated or loading is complete
  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>; 
  }

  return (
    <UserRoleContext.Provider value={userRole}>
      {children}
    </UserRoleContext.Provider>
  );
};
