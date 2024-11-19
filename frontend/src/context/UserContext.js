// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create UserContext to hold user information
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate fetching user data (replace this with your actual authentication logic)
    const loggedUser = { _id: 'user123', name: 'John Doe', role: 'user' }; 
    setUser(loggedUser);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
