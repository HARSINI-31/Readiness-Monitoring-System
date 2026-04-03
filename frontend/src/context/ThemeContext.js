import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true; // Default to dark mode
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.body.className = 'dark-mode';
    } else {
      document.body.className = 'light-mode';
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Theme configuration
  const theme = {
    bg: isDarkMode ? "linear-gradient(135deg, #0f172a, #1e293b, #334155)" : "#F8FAFC",
    sidebarBg: isDarkMode ? "linear-gradient(135deg, #1e293b, #0f172a)" : "#FFFFFF",
    sidebarText: isDarkMode ? "#ffffff" : "#1E293B",
    sidebarActiveBg: isDarkMode ? "rgba(59, 130, 246, 0.3)" : "#E0F2FE",
    sidebarActiveText: isDarkMode ? "#ffffff" : "#3B82F6",
    sidebarHoverBg: isDarkMode ? "rgba(203, 213, 225, 0.1)" : "#F1F5F9",
    sidebarHoverText: isDarkMode ? "#ffffff" : "#1E293B",
    textMenu: isDarkMode ? "#cbd5e1" : "#64748B",
    mainText: isDarkMode ? "#ffffff" : "#1E293B",
    subText: isDarkMode ? "#cbd5e1" : "#64748B",
    cardBg: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
    cardBorder: isDarkMode ? "none" : "1px solid #E2E8F0",
    cardShadow: isDarkMode ? "none" : "0 2px 8px rgba(0,0,0,0.05)",
    inputBg: isDarkMode ? "#1e293b" : "#ffffff",
    inputText: isDarkMode ? "#ffffff" : "#1e293b",
    tableHeaderBg: isDarkMode ? "rgba(0, 0, 0, 0.3)" : "#F8FAFC",
    tableBorder: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#E2E8F0",
    tableRowHover: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#F1F5F9",
    primaryButton: "#3B82F6",
    primaryButtonHover: "#2563EB"
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
