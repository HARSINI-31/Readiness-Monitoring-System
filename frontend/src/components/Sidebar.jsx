import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";

function Sidebar({ navItems = [], showLogout = false, onLogout = null, userName = "" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <aside
      style={{
        width: "280px",
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        color: "#ffffff",
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
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "40px", display: "flex", justifyContent: "center" }}>
        <Logo size="large" />
      </div>

      {/* Welcome Text */}
      {userName && (
        <div
          style={{
            marginBottom: "30px",
            fontSize: "14px",
            color: "#cbd5e1",
            textAlign: "center",
            fontWeight: "500",
            paddingBottom: "20px",
            borderBottom: "1px solid rgba(203, 213, 225, 0.2)",
          }}
        >
          Welcome,
          <br />
          <strong style={{ color: "#ffffff", fontSize: "15px" }}>{userName}</strong>
        </div>
      )}

      {/* Navigation Items */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        {navItems.map((item, index) => {
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
                color: isActive ? "#ffffff" : "#cbd5e1",
                fontSize: "16px",
                fontWeight: isActive ? "700" : "600",
                backgroundColor: isActive ? "rgba(59, 130, 246, 0.3)" : "transparent",
                borderLeft: isActive ? "4px solid #3b82f6" : "4px solid transparent",
                paddingLeft: isActive ? "12px" : "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "rgba(203, 213, 225, 0.1)";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#cbd5e1";
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
      </nav>

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
            marginTop: "20px",
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