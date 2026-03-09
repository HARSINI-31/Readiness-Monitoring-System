import React from "react";

const Logo = ({ size = "large" }) => {
  const sizes = {
    small: { width: "40px", height: "40px", fontSize: "18px" },
    medium: { width: "60px", height: "60px", fontSize: "28px" },
    large: { width: "80px", height: "80px", fontSize: "36px" }
  };

  const style = sizes[size] || sizes.large;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer"
      }}
    >
      <div
        style={{
          ...style,
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          color: "#fff",
          boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)"
        }}
      >
        📊
      </div>
      <div
        style={{
          display: size === "small" ? "none" : "flex",
          flexDirection: "column",
          gap: "2px"
        }}
      >
        <div
          style={{
            fontSize: size === "small" ? "12px" : size === "medium" ? "14px" : "18px",
            fontWeight: "bold",
            color: "#f0f4f8",
            letterSpacing: "0.5px",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)"
          }}
        >
          Readiness Pro
        </div>
        <div
          style={{
            fontSize: size === "small" ? "10px" : size === "medium" ? "11px" : "12px",
            color: "#e2e8f0",
            fontWeight: "500",
            textShadow: "0 1px 3px rgba(0, 0, 0, 0.4)"
          }}
        >
          Assessment Platform
        </div>
      </div>
    </div>
  );
};

export default Logo;
