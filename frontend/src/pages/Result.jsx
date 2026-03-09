import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Sidebar from "../components/Sidebar";
import { useUser } from "../context/UserContext";

function PlacementResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const data = location.state;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!data) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>No data found. Please calculate readiness first.</h2>
        <button onClick={() => navigate("/placement-readiness")}>Go Back</button>
      </div>
    );
  }

  const { codingScore, aptitudeScore, communicationScore, attendanceScore, overall } = data;

  const parameters = [
    { name: "Coding Skills", value: codingScore, color: "#4e73df" },
    { name: "Aptitude Skills", value: aptitudeScore, color: "#1cc88a" },
    { name: "Communication Skills", value: communicationScore, color: "#36b9cc" },
    { name: "Participation", value: attendanceScore, color: "#f6c23e" },
  ];

  let feedback = "";
  let status = "";
  let statusColor = "";
  
  if (overall >= 85) {
    feedback = "Excellent readiness! You're placement-ready!";
    status = "Ready";
    statusColor = "#10b981";
  } else if (overall >= 70) {
    feedback = "Good job! Focus on weaker skills for better readiness.";
    status = "Moderately Ready";
    statusColor = "#f59e0b";
  } else {
    feedback = "Work harder on your skills to improve placement readiness.";
    status = "Not Ready";
    statusColor = "#ef4444";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
        color: "#fff",
        display: "flex",
      }}
    >
      <Sidebar
        navItems={[
          { label: "Home", path: "/", icon: "🏠" },
          { label: "Exam Readiness", path: "/exam-readiness", icon: "📚" },
          { label: "Placement Readiness", path: "/placement-readiness", icon: "💼" },
          { label: "My Results", path: "/my-results", icon: "📊" },
          { label: "Profile", path: "/student-profile", icon: "👤" },
        ]}
        showLogout={true}
        onLogout={handleLogout}
        userName={user?.name || "Student"}
      />

      <main style={{ marginLeft: "280px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: "700", marginBottom: "30px" }}>💼 Placement Readiness Result</h1>
        
        {/* Status Badge */}
        <div
          style={{
            background: statusColor,
            color: "#fff",
            padding: "10px 24px",
            borderRadius: "25px",
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "30px",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
        >
          {status}
        </div>

        {/* Circular Overall Score */}
        <div style={{ width: "180px", marginBottom: "50px" }}>
          <CircularProgressbar
            value={overall}
            text={`${overall}%`}
            styles={buildStyles({
              textColor: "#fff",
              pathColor: overall >= 85 ? "#4e73df" : overall >= 70 ? "#1cc88a" : "#e74a3b",
              trailColor: "rgba(255,255,255,0.3)",
            })}
          />
        </div>

        {/* Parameter Bars */}
        <div style={{ width: "80%", maxWidth: "700px" }}>
          {parameters.map((param, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span>{param.name}</span>
                <span>{param.value}%</span>
              </div>
              <div style={{ height: "25px", borderRadius: "12px", background: "rgba(255,255,255,0.2)" }}>
                <div
                  style={{
                    width: `${param.value}%`,
                    height: "100%",
                    borderRadius: "12px",
                    background: param.color,
                    transition: "width 1s ease-in-out",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Feedback */}
        <div style={{ marginTop: "40px", fontSize: "22px", fontWeight: "500", textAlign: "center" }}>
          {feedback}
        </div>

        {/* Buttons */}
        <div style={{ marginTop: "50px", display: "flex", gap: "20px" }}>
          <button
            style={{
              padding: "12px 30px",
              fontSize: "18px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background: "#4e73df",
              color: "#fff",
              fontWeight: "600",
            }}
            onClick={() => navigate("/placement-readiness")}
          >
            Recalculate
          </button>
          <button
            style={{
              padding: "12px 30px",
              fontSize: "18px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background: "#1cc88a",
              color: "#fff",
              fontWeight: "600",
            }}
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </div>
      </main>
    </div>
  );
}

export default PlacementResult;
