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

  const login = React.useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    setStudentProfile(null);
    localStorage.removeItem("user");
    localStorage.removeItem("studentProfile");
  }, []);

  const updateStudentProfile = React.useCallback((profileData) => {
    setStudentProfile(profileData);
    localStorage.setItem("studentProfile", JSON.stringify(profileData));
  }, []);

  const value = React.useMemo(() => ({
    user,
    login,
    logout,
    studentProfile,
    updateStudentProfile,
  }), [user, login, logout, studentProfile, updateStudentProfile]);

  return (
    <UserContext.Provider value={value}>
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
