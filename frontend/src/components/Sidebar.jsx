import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";

function Sidebar({ navItems = [], showLogout = false, onLogout = null, userName = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const { user } = useUser();
  
  const finalUserName = user?.userName || (user?.role === "admin" ? "Admin" : userName);

  React.useEffect(() => {
    // Only apply for logged-in students in the dashboard
    if (user && user.role !== "admin") {
      const handleBackButton = (event) => {
        // Force navigate to readiness page
        navigate("/readiness");
        // Push current state to prevent further back navigation
        window.history.pushState(null, null, window.location.pathname);
      };

      // Push initial state to start trapping back button
      window.history.pushState(null, null, window.location.pathname);
      window.addEventListener("popstate", handleBackButton);

      return () => {
        window.removeEventListener("popstate", handleBackButton);
      };
    }
  }, [user, navigate]);

  React.useEffect(() => {
    // Intercept back button for admin dashboard only
    if (user && user.role === "admin") {
      const handleAdminBackButton = (event) => {
        // Force navigate to admin dashboard
        navigate("/admin/dashboard");
        // Maintain history trap
        window.history.pushState(null, null, window.location.pathname);
      };

      // Initialize history trap
      window.history.pushState(null, null, window.location.pathname);
      window.addEventListener("popstate", handleAdminBackButton);

      return () => {
        window.removeEventListener("popstate", handleAdminBackButton);
      };
    }
  }, [user, navigate]);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Determine if navItems is categorized (array of objects with 'category' key)
  const isCategorized = navItems.length > 0 && navItems[0].category !== undefined;

  return (
    <aside
      style={{
        width: "280px",
        background: theme.sidebarBg,
        color: theme.sidebarText,
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
        boxShadow: "3px 0 12px rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
        transition: "background 0.3s ease, color 0.3s ease"
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "40px", display: "flex", justifyContent: "center" }}>
        <Logo size="large" />
      </div>

      {/* Welcome Text */}
      {finalUserName && (
        <div
          style={{
            marginBottom: "30px",
            fontSize: "14px",
            color: theme.subText,
            textAlign: "center",
            fontWeight: "500",
            paddingBottom: "20px",
            borderBottom: `1px solid ${theme.cardBorder === "none" ? "rgba(203, 213, 225, 0.2)" : theme.cardBorder}`,
          }}
        >
          Welcome, <strong style={{ color: theme.sidebarText, fontSize: "15px" }}>{finalUserName}</strong>
        </div>
      )}

      {/* Navigation Items */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
        {isCategorized ? (
          navItems.map((categoryGroup, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: theme.subText,
                fontWeight: "700",
                paddingLeft: "10px",
                marginBottom: "4px"
              }}>
                {categoryGroup.category}
              </div>
              {categoryGroup.items.map((item, i) => {
                const isActive = location.pathname === item.path;
                return (
                  <div
                    key={i}
                    onClick={() => handleNavClick(item.path)}
                    style={{
                      padding: "10px 16px",
                      cursor: "pointer",
                      borderRadius: "6px",
                      transition: "all 0.3s ease",
                      color: isActive ? theme.sidebarActiveText : theme.textMenu,
                      fontSize: "15px",
                      fontWeight: isActive ? "700" : "600",
                      backgroundColor: isActive ? theme.sidebarActiveBg : "transparent",
                      borderLeft: isActive ? `4px solid ${isDarkMode ? "#3b82f6" : "#2563eb"}` : "4px solid transparent",
                      paddingLeft: isActive ? "12px" : "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = theme.sidebarHoverBg;
                        e.currentTarget.style.color = theme.sidebarHoverText;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = theme.textMenu;
                      }
                    }}
                  >
                    {item.icon && (
                      <span style={{ fontSize: "18px", minWidth: "20px" }}>{item.icon}</span>
                    )}
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={index}
                onClick={() => handleNavClick(item.path)}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderRadius: "6px",
                  transition: "all 0.3s ease",
                  color: isActive ? theme.sidebarActiveText : theme.textMenu,
                  fontSize: "16px",
                  fontWeight: isActive ? "700" : "600",
                  backgroundColor: isActive ? theme.sidebarActiveBg : "transparent",
                  borderLeft: isActive ? `4px solid ${isDarkMode ? "#3b82f6" : "#2563eb"}` : "4px solid transparent",
                  paddingLeft: isActive ? "12px" : "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = theme.sidebarHoverBg;
                    e.currentTarget.style.color = theme.sidebarHoverText;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = theme.textMenu;
                  }
                }}
              >
                {item.icon && (
                  <span style={{ fontSize: "18px", minWidth: "20px" }}>{item.icon}</span>
                )}
                <span>{item.label}</span>
              </div>
            );
          })
        )}
      </nav>

      {/* Dark Mode Toggle */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
        <button
          onClick={toggleTheme}
          style={{
            padding: "10px 16px",
            backgroundColor: isDarkMode ? "transparent" : "#1e293b",
            color: isDarkMode ? "#cbd5e1" : "#ffffff",
            border: isDarkMode ? "1px solid #475569" : "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.3s ease",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
          }}
          onMouseEnter={(e) => {
            if (isDarkMode) {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            } else {
              e.currentTarget.style.backgroundColor = "#0f172a";
            }
          }}
          onMouseLeave={(e) => {
            if (isDarkMode) {
              e.currentTarget.style.backgroundColor = "transparent";
            } else {
              e.currentTarget.style.backgroundColor = "#1e293b";
            }
          }}
        >
          <span>{isDarkMode ? "☀️" : "🌙"}</span>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Logout Button */}
      {showLogout && onLogout && (
        <button
          onClick={handleLogout}
          style={{
            padding: "12px 16px",
            backgroundColor: "#ef4444",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            marginTop: "15px",
            transition: "all 0.3s ease",
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#dc2626";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#ef4444";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          <span>🚪</span>
          Logout
        </button>
      )}
    </aside>
  );
}

export default Sidebar;