import React, { createContext, useState, useContext } from 'react';

// Create the context
const UserRoleContext = createContext();

// Custom hook to use the UserRoleContext
export const useUserRole = () => useContext(UserRoleContext);

// Provider component
export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);  // Default value can be null or any role as needed
  
  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};