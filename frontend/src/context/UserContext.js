import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [studentProfile, setStudentProfile] = useState(() => {
    const savedProfile = localStorage.getItem("studentProfile");
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setStudentProfile(null);
    localStorage.removeItem("user");
    localStorage.removeItem("studentProfile");
  };

  const updateStudentProfile = (profileData) => {
    setStudentProfile(profileData);
    localStorage.setItem("studentProfile", JSON.stringify(profileData));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        studentProfile,
        updateStudentProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
